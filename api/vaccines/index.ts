import { VercelRequest, VercelResponse } from '@vercel/node';
import sql from '../_lib/db';
import { extractAuthUser } from '../_lib/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Verify JWT
  const authUser = extractAuthUser(req.headers.authorization);
  if (!authUser) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // GET - Get all vaccine statuses for the authenticated user
    if (req.method === 'GET') {
      const statuses = await sql`
        SELECT vaccine_id, status, updated_at
        FROM vaccine_statuses
        WHERE user_id = ${authUser.userId}
      `;

      const statusMap: Record<string, string> = {};
      statuses.forEach((s: any) => {
        statusMap[s.vaccine_id] = s.status;
      });

      return res.status(200).json({ vaccineStatuses: statusMap });
    }

    // POST - Update vaccine statuses (upsert)
    if (req.method === 'POST') {
      const { vaccineId, status } = req.body || {};

      if (!vaccineId || !status) {
        return res.status(400).json({ error: 'vaccineId and status are required' });
      }

      if (!['done', 'pending', 'upcoming'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status value' });
      }

      // Upsert: insert or update
      await sql`
        INSERT INTO vaccine_statuses (user_id, vaccine_id, status)
        VALUES (${authUser.userId}, ${vaccineId}, ${status})
        ON CONFLICT (user_id, vaccine_id)
        DO UPDATE SET status = ${status}, updated_at = NOW()
      `;

      return res.status(200).json({ success: true, vaccineId, status });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Vaccines error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

