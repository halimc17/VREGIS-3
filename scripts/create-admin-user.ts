import * as dotenv from 'dotenv';

// Load environment variables FIRST before any other imports
dotenv.config({ path: '.env.local' });

import { db } from '../src/lib/db/connection';
import { users } from '../src/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcryptjs from 'bcryptjs';

async function createAdminUser() {
  try {
    console.log('Creating admin user...');

    const email = 'firdausk2020@gmail.com';
    const password = 'K4lil4791355R';
    const name = 'Firdaus Admin';

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      console.log('Admin user already exists with this email');

      // Update password for existing user
      const hashedPassword = await bcryptjs.hash(password, 12);

      await db
        .update(users)
        .set({
          password: hashedPassword,
          role: 'administrator',
          updatedAt: new Date()
        })
        .where(eq(users.email, email));

      console.log('Updated existing admin user password and role');
      return;
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 12);

    // Create new admin user - without username field
    const newUser = await db
      .insert(users)
      .values({
        name: name,
        email: email,
        password: hashedPassword,
        role: 'administrator',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    console.log('Admin user created successfully:', {
      id: newUser[0].id,
      name: newUser[0].name,
      email: newUser[0].email,
      role: newUser[0].role
    });

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