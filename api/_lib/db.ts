import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.NEON_DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('NEON_DATABASE_URL environment variable is not set');
}

const sql = neon(DATABASE_URL);

export default sql;

/**
 * Execute a raw SQL query with optional parameters.
 * Uses the Neon serverless driver which works in edge/serverless environments.
 */
export async function query<T = any>(
  strings: TemplateStringsArray,
  ...params: any[]
): Promise<T[]> {
  try {
    const result = await sql(strings.join('?'), ...params);
    return result as T[];
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

