# Volleyball Tournament Management System

A modern web application for managing volleyball tournaments, team registrations, and event organization.

## Features

- 🏐 **Tournament Management**: Create and manage volleyball tournaments
- 👥 **Team Registration**: Public team registration with validation
- 🔐 **Admin Dashboard**: Secure admin panel with authentication
- 📊 **Real-time Stats**: Dashboard with tournament and registration statistics
- 🎨 **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- 🗄️ **Database**: PostgreSQL with Neon for reliable data storage

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI**: shadcn/ui, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Neon)
- **ORM**: Drizzle ORM
- **Authentication**: JWT with secure cookies
- **Validation**: Zod schema validation

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="your_neon_database_url_here"

# Auth (generate a random secret)
NEXTAUTH_SECRET="your_random_secret_here"
NEXTAUTH_URL="http://localhost:3000"
```

### 2. Database Setup

1. Create a Neon database account at [neon.com](https://neon.com)
2. Create a new project and database
3. Copy the connection string to your `.env.local` file
4. Run database migrations:

```bash
npm run db:push
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Create Admin User

You'll need to manually create an admin user in your database. Here's an example SQL:

```sql
INSERT INTO users (email, password, name, role)
VALUES (
  'admin@tournament.com',
  '$2a$12$hashed_password_here',
  'Admin User',
  'admin'
);
```

Note: Use a proper password hashing tool or create a seeding script to hash the password with bcryptjs.

### 5. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── admin/             # Protected admin pages
│   ├── api/               # API routes
│   ├── login/             # Authentication
│   └── register/          # Public registration
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── lib/                  # Utilities and configurations
│   ├── auth.ts           # Authentication logic
│   └── db/               # Database configuration
└── types/                # TypeScript definitions
```

## Available Routes

### Public Routes
- `/` - Home page
- `/register` - Team registration
- `/login` - Admin login

### Protected Admin Routes
- `/admin` - Dashboard
- `/admin/tournaments` - Tournament management
- `/admin/teams` - View registered teams
- `/admin/registrations` - Manage registrations

## Database Schema

The application uses the following main entities:

- **Users**: Admin users for authentication
- **Tournaments**: Tournament information and settings
- **Teams**: Registered volleyball teams
- **Registrations**: Team registrations for specific tournaments

## API Endpoints

- `POST /api/auth/login` - Admin authentication
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user
- `GET/POST /api/tournaments` - Tournament CRUD operations
- `GET/POST /api/teams` - Team operations
- `GET/POST /api/registrations` - Registration management

## Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate database migrations
npm run db:push      # Push schema to database
npm run db:studio    # Open Drizzle Studio
```

## Deployment

1. Deploy to your preferred platform (Vercel, Netlify, etc.)
2. Set up environment variables in your deployment platform
3. Ensure your Neon database is accessible from your deployment
4. Run `npm run build` to create the production build

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for your volleyball tournaments!