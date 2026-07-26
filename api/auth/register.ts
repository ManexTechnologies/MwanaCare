import { VercelRequest, VercelResponse } from '@vercel/node';
import sql from '../_lib/db';
import { hashPassword, generateToken } from '../_lib/auth';

interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, password } = req.body as RegisterBody;

    // Validate input
    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if email already exists
    const existingUsers = await sql`
      SELECT id FROM users WHERE email = ${normalizedEmail}
    `;

    if (existingUsers.length > 0) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Insert user
    const newUsers = await sql`
      INSERT INTO users (name, email, password_hash)
      VALUES (${name.trim()}, ${normalizedEmail}, ${passwordHash})
      RETURNING id, name, email, created_at
    `;

    const user = newUsers[0];

    // Generate JWT
    const token = generateToken(user.id, user.email);

    // Return user (without password) and token
    return res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.created_at,
      },
      token,
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

