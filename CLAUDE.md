# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🚨 IMPORTANT: Always Reference PRD.md

**BEFORE starting any development work, ALWAYS refer to `PRD.md` (Product Requirements Document) for:**
- Complete project specifications
- Feature requirements and user stories
- Technical architecture guidelines
- UI/UX design principles
- API specifications
- Development standards

**ALL development decisions must align with the requirements and guidelines outlined in PRD.md.**

## Project Overview

This is a volleyball tournament management system built with:
- **Frontend**: Next.js 15 with App Router, React 19, TypeScript
- **UI**: shadcn/ui components (New York style), Tailwind CSS v4
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL via Neon with Drizzle ORM
- **Authentication**: JWT with secure cookies, bcryptjs for password hashing

📖 **For complete project specifications, see `PRD.md`**

## Essential Commands

### Development
```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production with Turbopack
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Database Operations
```bash
npm run db:generate  # Generate database migrations
npm run db:push      # Push schema changes to database
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Drizzle Studio for database management
```

## Architecture Overview

### Database Schema (`src/lib/db/schema.ts`)
- **users**: Admin authentication (id, email, password, name, role)
- **tournaments**: Tournament info (name, dates, location, maxTeams, status)
- **teams**: Registered teams (name, captain info, institution, experience)
- **registrations**: Many-to-many relationship between teams and tournaments

### Authentication System (`src/lib/auth.ts`)
- JWT-based authentication with 24-hour sessions
- Secure HTTP-only cookies for session storage
- Middleware protection for `/admin` routes
- Password hashing with bcryptjs (12 rounds)

### App Structure
```
src/app/
├── admin/              # Protected admin pages
│   ├── page.tsx       # Dashboard with stats
│   ├── tournaments/   # Tournament management
│   ├── teams/         # View registered teams
│   └── registrations/ # Manage registrations
├── api/               # API routes
│   ├── auth/          # Login/logout/me endpoints
│   ├── tournaments/   # Tournament CRUD
│   ├── teams/         # Team operations
│   └── registrations/ # Registration management
├── login/             # Admin login page
├── register/          # Public team registration
└── page.tsx          # Public home page
```

### Key Components
- `src/components/app-sidebar.tsx`: Admin navigation sidebar
- `src/components/login-form.tsx`: Admin authentication form
- `src/components/ui/`: shadcn/ui components with New York style
- `src/middleware.ts`: Route protection for admin pages

## Environment Setup

Required environment variables in `.env.local`:
```env
DATABASE_URL="your_neon_database_url"
NEXTAUTH_SECRET="your_random_secret_key"
NEXTAUTH_URL="http://localhost:3000"
```

## Development Workflow

### 📋 PRD-First Development Process
1. **Always Check PRD.md First**: Before implementing any feature, refer to PRD.md for:
   - Feature specifications
   - User stories and requirements
   - Technical guidelines
   - UI/UX standards

### 🔄 Standard Development Steps
1. **Database First**: Always run `npm run db:push` after schema changes
2. **Admin Access**: Create admin users manually in database or via seeding script
3. **Route Protection**: All `/admin` routes require authentication via middleware
4. **API Structure**: RESTful endpoints under `/api` with proper error handling
5. **Component Development**: Follow shadcn/ui patterns as defined in PRD.md
6. **Testing**: Implement features according to testing requirements in PRD.md

## shadcn/ui Configuration

- Style: "new-york"
- Base color: "neutral"
- CSS file: `src/app/globals.css`
- Component aliases configured for `@/components`, `@/lib`, `@/hooks`
- Uses Lucide React for icons

## Database Connection

Uses Drizzle ORM with PostgreSQL:
- Connection: `src/lib/db/connection.ts`
- Schema: `src/lib/db/schema.ts`
- Config: `drizzle.config.ts` in project root

## 📚 Key Documents

1. **PRD.md** - Product Requirements Document (MUST READ FIRST)
   - Complete feature specifications
   - Technical architecture
   - User stories and requirements
   - API documentation
   - Development guidelines

2. **CLAUDE.md** - This file (Quick reference for Claude Code)
   - Essential commands
   - Development workflow
   - Project structure overview

## 🎯 Feature Development Priority

**Refer to PRD.md roadmap for current priorities:**
- ✅ **Phase 1**: Core MVP (COMPLETED)
- 🔄 **Phase 2**: Enhanced Features (IN PROGRESS)
- 📋 **Phase 3**: Advanced Capabilities (PLANNED)
- 🎯 **Phase 4**: Enterprise Features (FUTURE)

**Always check PRD.md for the latest feature requirements and specifications before starting development work.**