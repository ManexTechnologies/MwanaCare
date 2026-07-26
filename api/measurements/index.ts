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
    // GET - List measurements for the authenticated user
    if (req.method === 'GET') {
      const measurements = await sql`
        SELECT 
          id, 
          date, 
          weight, 
          height, 
          head_circumference, 
          notes, 
          created_at
        FROM growth_measurements
        WHERE user_id = ${authUser.userId}
        ORDER BY date DESC
        LIMIT 50
      `;

      return res.status(200).json({
        measurements: measurements.map((m: any) => ({
          id: m.id,
          date: m.date,
          weight: parseFloat(m.weight),
          height: parseFloat(m.height),
          headCircumference: m.head_circumference ? parseFloat(m.head_circumference) : undefined,
          notes: m.notes || undefined,
        })),
      });
    }

    // POST - Create a new measurement
    if (req.method === 'POST') {
      const { weight, height, headCircumference, notes } = req.body || {};

      if (weight == null || height == null) {
        return res.status(400).json({ error: 'Weight and height are required' });
      }

      const newMeasurements = await sql`
        INSERT INTO growth_measurements (user_id, weight, height, head_circumference, notes)
        VALUES (${authUser.userId}, ${weight}, ${height}, ${headCircumference || null}, ${notes || null})
        RETURNING id, date, weight, height, head_circumference, notes
      `;

      const m = newMeasurements[0];

      return res.status(201).json({
        measurement: {
          id: m.id,
          date: m.date,
          weight: parseFloat(m.weight),
          height: parseFloat(m.height),
          headCircumference: m.head_circumference ? parseFloat(m.head_circumference) : undefined,
          notes: m.notes || undefined,
        },
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Measurements error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

