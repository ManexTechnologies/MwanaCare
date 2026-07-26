import { VercelRequest, VercelResponse } from '@vercel/node';
import sql from '../_lib/db';
import { extractAuthUser } from '../_lib/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify JWT from Authorization header
    const authUser = extractAuthUser(req.headers.authorization);
    if (!authUser) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Fetch full user data (join with dashboard data if exists)
    const users = await sql`
      SELECT 
        u.id, 
        u.name, 
        u.email, 
        u.baby_name, 
        u.due_date, 
        u.created_at,
        d.current_week,
        d.baby_weight,
        d.baby_height
      FROM users u
      LEFT JOIN dashboard_data d ON d.user_id = u.id
      WHERE u.id = ${authUser.userId}
    `;

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[0];

    return res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        babyName: user.baby_name || undefined,
        dueDate: user.due_date ? new Date(user.due_date).toISOString() : undefined,
        createdAt: user.created_at,
        dashboard: user.current_week
          ? {
              currentWeek: user.current_week,
              babyWeight: user.baby_weight?.toString() || '3.2',
              babyHeight: user.baby_height?.toString() || '49.5',
            }
          : undefined,
      },
    });
  } catch (error: any) {
    console.error('Get profile error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

