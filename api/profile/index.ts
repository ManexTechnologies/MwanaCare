import type { VercelRequest, VercelResponse } from '@vercel/node';
import sql from '../../api/_lib/db';
import { extractAuthUser } from '../../api/_lib/auth';

/**
 * PUT /api/profile
 * Update the authenticated user's profile (name, baby_name, due_date)
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow PUT
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed. Use PUT.' });
  }

  // Authenticate
  const authUser = extractAuthUser(req.headers.authorization);
  if (!authUser) {
    return res.status(401).json({ error: 'Unauthorized. Valid token required.' });
  }

  try {
    const { name, baby_name, due_date } = req.body;

    // Build update fields dynamically
    const updates: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramIndex++}`);
      params.push(name.trim());
    }
    if (baby_name !== undefined) {
      updates.push(`baby_name = $${paramIndex++}`);
      params.push(baby_name.trim() || null);
    }
    if (due_date !== undefined) {
      updates.push(`due_date = $${paramIndex++}`);
      params.push(due_date.trim() || null);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    // Add user_id as last param
    params.push(authUser.userId);

    const result = await sql`
      UPDATE users 
      SET ${sql(updates.join(', '))}
      WHERE id = $${paramIndex}
      RETURNING id, name, email, baby_name, due_date, created_at
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result[0];
    return res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        babyName: user.baby_name,
        dueDate: user.due_date,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
