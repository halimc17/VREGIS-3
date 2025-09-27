import * as dotenv from 'dotenv';

// Load environment variables FIRST
dotenv.config({ path: '.env.local' });

import { neon } from '@neondatabase/serverless';

const connectionString = 'postgresql://neondb_owner:npg_qouyfp46kOiT@ep-proud-bread-a1358c86-pooler.ap-southeast-1.aws.neon.tech/vregis?sslmode=require&channel_binding=require';

async function testConnection() {
  try {
    console.log('Testing database connection...');
    console.log('Connection string:', connectionString);
    console.log('');

    const sql = neon(connectionString);

    // Test basic connection
    const result = await sql`SELECT NOW() as current_time, version() as postgres_version`;
    console.log('✅ Connection successful!');
    console.log('Current time:', result[0].current_time);
    console.log('PostgreSQL version:', result[0].postgres_version);
    console.log('');

    // List all tables
    console.log('📋 Available tables:');
    const tables = await sql`
      SELECT table_name, table_schema
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;

    if (tables.length === 0) {
      console.log('No tables found in the public schema.');
    } else {
      tables.forEach(table => {
        console.log(`- ${table.table_name}`);
      });
    }
    console.log('');

    // Check users table structure
    console.log('👤 Users table structure:');
    const userColumns = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'users' AND table_schema = 'public'
      ORDER BY ordinal_position;
    `;

    if (userColumns.length === 0) {
      console.log('Users table not found.');
    } else {
      userColumns.forEach(col => {
        console.log(`- ${col.column_name}: ${col.data_type} ${col.is_nullable === 'YES' ? '(nullable)' : '(not null)'}`);
      });
    }
    console.log('');

    // Count users
    const userCount = await sql`SELECT COUNT(*) as count FROM users`;
    console.log(`📊 Total users: ${userCount[0].count}`);

    // Show user emails
    const users = await sql`SELECT id, name, email, is_active FROM users LIMIT 5`;
    console.log('📧 User emails:');
    users.forEach(user => {
      console.log(`- ${user.email} (${user.name}) - Active: ${user.is_active}`);
    });

  } catch (error) {
    console.error('❌ Connection failed:');
    console.error(error);
    process.exit(1);
  }
}

testConnection().then(() => {
  console.log('\n✅ Database connection test completed successfully');
  process.exit(0);
});