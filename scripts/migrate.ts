/**
 * One-time migration script to apply schema.sql to Neon.
 * Run: npx tsx scripts/migrate.ts
 */
import { neon } from '@neondatabase/serverless';
import * as fs from 'fs';
import * as path from 'path';

const DATABASE_URL = process.env.NEON_DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ NEON_DATABASE_URL environment variable is not set');
  console.error('   Create a .env file with NEON_DATABASE_URL=your-connection-string');
  process.exit(1);
}

async function main() {
  console.log('🔄 Connecting to Neon database...');
  // Use sql.unsafe for raw SQL execution
  const sql = neon(DATABASE_URL);

  const schemaPath = path.join(__dirname, '..', 'api', 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf-8');

  console.log('📄 Running schema.sql...');
  
  // Split by semicolons and execute each statement
  const statements = schema
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  let successCount = 0;
  let failCount = 0;

  for (const stmt of statements) {
    try {
      // Use unsafe() for raw SQL strings without parameters
      await sql.unsafe(stmt + ';');
      successCount++;
      process.stdout.write('✅ ');
    } catch (err: any) {
      // Ignore "already exists" errors
      if (err.message?.includes('already exists')) {
        successCount++;
        process.stdout.write('⏭️  ');
      } else {
        failCount++;
        process.stdout.write('❌ ');
        console.error(`\nError: ${err.message}`);
        // Don't log the full statement for errors, just the first part
        console.error(`Statement: ${stmt.substring(0, 120)}...`);
      }
    }
  }

  console.log(`\n\n✅ Migration complete! ${successCount} succeeded, ${failCount} failed.`);
  process.exit(failCount > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('❌ Migration failed:', err.message);
  process.exit(1);
});
