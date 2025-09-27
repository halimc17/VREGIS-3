import * as dotenv from 'dotenv';

// Load environment variables FIRST before any other imports
dotenv.config({ path: '.env.local' });

import { neon } from '@neondatabase/serverless';
import bcryptjs from 'bcryptjs';

const sql = neon(process.env.DATABASE_URL!);

async function createAdminUser() {
  try {
    console.log('Creating admin user with SQL...');

    const email = 'firdausk2020@gmail.com';
    const password = 'K4lil4791355R';
    const name = 'Firdaus Admin';

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 12);

    // First, let's see what columns exist in the users table
    const tableInfo = await sql`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position;
    `;

    console.log('Current users table structure:');
    console.log(tableInfo);

    if (tableInfo.length === 0) {
      console.log('Users table does not exist. Creating it...');

      // Create the users table with the correct structure
      await sql`
        CREATE TABLE users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          role VARCHAR(50) NOT NULL DEFAULT 'user',
          created_at TIMESTAMP DEFAULT NOW() NOT NULL,
          updated_at TIMESTAMP DEFAULT NOW() NOT NULL
        );
      `;

      console.log('Users table created successfully');
    }

    // Check if user exists
    const existingUsers = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;

    if (existingUsers.length > 0) {
      console.log('User already exists. Updating password...');

      await sql`
        UPDATE users
        SET password_hash = ${hashedPassword},
            updated_at = NOW()
        WHERE email = ${email}
      `;

      console.log('User updated successfully');
    } else {
      console.log('Creating new admin user...');

      await sql`
        INSERT INTO users (name, email, password_hash, is_active, created_at, updated_at)
        VALUES (${name}, ${email}, ${hashedPassword}, true, NOW(), NOW())
      `;

      console.log('Admin user created successfully');
    }

    console.log('\nYou can now login with:');
    console.log('Email:', email);
    console.log('Password:', password);

  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

// Run the script
createAdminUser().then(() => {
  console.log('Done');
  process.exit(0);
});