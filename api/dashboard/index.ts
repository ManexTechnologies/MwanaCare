import type { VercelRequest, VercelResponse } from '@vercel/node';
import sql from '../_lib/db';
import { extractAuthUser } from '../_lib/auth';

/**
 * GET /api/dashboard
 * Returns the dashboard data for the authenticated user.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed. Use GET.' });
  }

  const authUser = extractAuthUser(req.headers.authorization);
  if (!authUser) {
    return res.status(401).json({ error: 'Unauthorized. Valid token required.' });
  }

  try {
    // Try to get existing dashboard data, or return defaults
    const result = await sql`
      SELECT current_week, baby_weight, baby_height 
      FROM dashboard_data 
      WHERE user_id = ${authUser.userId}
      LIMIT 1
    `;

    if (result.length === 0) {
      // Return default dashboard data
      return res.status(200).json({
        dashboard: {
          currentWeek: 32,
          babyWeight: 3.2,
          babyHeight: 49.5,
        },
      });
    }

    const data = result[0];
    return res.status(200).json({
      dashboard: {
        currentWeek: data.current_week,
        babyWeight: parseFloat(data.baby_weight),
        babyHeight: parseFloat(data.baby_height),
      },
    });
  } catch (error) {
    console.error('Dashboard fetch error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
