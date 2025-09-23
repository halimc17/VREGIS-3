# Product Requirements Document (PRD)
## Volleyball Tournament Management System

---

## 📋 Executive Summary

### Visi
Menyediakan platform digital yang terintegrasi untuk mengelola seluruh aspek turnamen bola voli, mulai dari pendaftaran tim hingga manajemen kompetisi.

### Misi
Memudahkan penyelenggara turnamen dalam mengelola event bola voli dengan sistem yang user-friendly, efisien, dan komprehensif.

### Target Pengguna
- **Primary**: Organizer turnamen bola voli
- **Secondary**: Tim/klub bola voli, kapten tim
- **Tertiary**: Administrator sistem, official tournament

### Value Proposition
- Mengurangi kerumitan administrative turnamen hingga 80%
- Centralized platform untuk semua kebutuhan tournament management
- Real-time tracking dan reporting
- Professional tournament experience

---

## 🎯 Product Overview

### Deskripsi Aplikasi
Volleyball Tournament Management System adalah platform web-based yang dirancang khusus untuk mengelola turnamen bola voli. Aplikasi ini menyediakan fitur lengkap mulai dari pembuatan turnamen, registrasi tim, manajemen pemain, hingga sistem pembayaran dan pelaporan.

### Tujuan Bisnis
1. **Efisiensi Operasional**: Otomatisasi proses manual dalam pengelolaan turnamen
2. **User Experience**: Memberikan pengalaman yang seamless bagi semua stakeholder
3. **Data Centralization**: Semua data turnamen tersimpan terpusat dan aman
4. **Scalability**: Dapat menghandle multiple tournament secara bersamaan

### Key Features
- ✅ Tournament Management System
- ✅ Team Registration & Management
- ✅ Player Data Management
- ✅ Admin Dashboard & Analytics
- ✅ Authentication & Authorization
- ✅ Payment Integration (Ready)
- ✅ Real-time Notifications

---

## 🏗️ Technical Architecture

### Tech Stack
```
Frontend:     Next.js 15 (App Router)
UI Framework: shadcn/ui + Tailwind CSS v4
Backend:      Next.js API Routes
Database:     PostgreSQL (Neon)
Auth:         JWT + HTTP-only Cookies
File Storage: Cloudinary
Deployment:   Vercel
Build Tool:   Turbopack
```

### Database Schema
```sql
-- Core Tables
users           (Authentication & User Management)
tournaments     (Tournament Data & Configuration)
teams          (Team Information & Metadata)
registrations  (Many-to-many: Teams ↔ Tournaments)

-- Enums
role_enum              ('user', 'administrator')
category_enum          ('putra', 'putri', 'mixed')
tournament_status_enum ('open', 'closed')
```

### Authentication & Security
- **JWT Authentication**: 24-hour sessions
- **HTTP-only Cookies**: Secure session storage
- **Role-based Access**: Admin vs User permissions
- **Password Security**: bcrypt hashing (12 rounds)
- **API Protection**: Middleware untuk route protection

### UI/UX Framework
```
Design System: shadcn/ui (New York Style)
Base Theme:    Neutral color palette
Components:    40+ reusable UI components
Icons:         Lucide React
Typography:    Geist font family
```

### File Upload & Media Management
**Platform**: Cloudinary
**Purpose**: Mengelola semua operasi upload file dalam aplikasi

**Use Cases**:
- Team logos upload
- Player photos/ID photos
- Tournament banners/posters
- Document uploads (payment proof, certificates)
- Profile pictures for admin users

**Configuration**:
```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME="dvi5lhmyc"
CLOUDINARY_API_KEY="385957998344647"
CLOUDINARY_API_SECRET="Lf3NULT68RwbcYfx0kbw8oQH5zU"
CLOUDINARY_URL="cloudinary://385957998344647:Lf3NULT68RwbcYfx0kbw8oQH5zU@dvi5lhmyc"
```

**Features**:
- Automatic image optimization dan resize
- Support multiple format (JPEG, PNG, PDF, etc.)
- Cloud-based storage dengan CDN
- Secure direct upload dari frontend
- Transformation API untuk image processing
- Upload progress tracking
- File size limits dan validation

**Implementation**:
- Frontend: @cloudinary/react package
- Backend: cloudinary Node.js SDK
- Upload strategy: Direct upload to Cloudinary
- Security: Signed upload dengan preset

---

## 👥 User Personas & Roles

### 1. Administrator
**Profile**: Tournament organizer, Event manager
**Goals**:
- Manage multiple tournaments efficiently
- Monitor registrations and payments
- Generate reports and analytics
- Manage system users

**Permissions**:
- Full CRUD access to tournaments
- User management
- Registration approval/rejection
- Payment status management
- Analytics dashboard access

### 2. Team Captain
**Profile**: Team leader, Club representative
**Goals**:
- Register team for tournaments
- Manage player roster
- Track registration status
- Handle team communications

**Permissions**:
- Read tournament information
- Submit team registrations
- Edit team details
- View registration status

### 3. Public User
**Profile**: Volleyball enthusiasts, Spectators
**Goals**:
- View tournament information
- Check results and schedules
- Follow favorite teams

**Permissions**:
- Read-only access to public tournament data
- View team information
- Access tournament schedules

---

## 🚀 Feature Requirements

### 1. Tournament Management
**Status**: ✅ Implemented

**Features**:
- Create/Edit/Delete tournaments
- Tournament categories: Putra, Putri, Mixed
- Pool configuration (separate for putra/putri)
- Registration deadlines
- Entry fee management
- Tournament status (Open/Closed)

**User Stories**:
- As an admin, I can create new tournaments with all necessary details
- As an admin, I can set different pool numbers for male/female categories
- As an admin, I can close registrations when deadline is reached

### 2. Team Registration & Management
**Status**: ✅ Core Implementation

**Features**:
- Team profile creation
- Captain information management
- Institution/club affiliation
- Experience level tracking
- Player count management
- Registration status tracking

**User Stories**:
- As a team captain, I can register my team for available tournaments
- As a team captain, I can update team information
- As an admin, I can approve/reject team registrations

### 3. Player Management
**Status**: 🔄 Planned Enhancement

**Features**:
- Individual player profiles
- Player statistics
- Position tracking
- Age verification
- Medical clearance status

**User Stories**:
- As a team captain, I can add/remove players from my roster
- As an admin, I can view complete player database
- As a player, I can view my tournament history

### 4. Payment System
**Status**: 🔄 Infrastructure Ready

**Database Schema**:
```sql
registrations {
  payment_status: 'unpaid' | 'paid' | 'refunded'
  payment_date: timestamp
  entry_fee: integer (in cents)
}
```

**Features**:
- Payment status tracking
- Entry fee management
- Payment confirmation
- Refund management

### 5. Dashboard & Analytics
**Status**: ✅ Basic Implementation

**Current Features**:
- Tournament statistics
- Registration counts
- Team overview
- Recent activity feed
- Quick action shortcuts

**Planned Enhancements**:
- Revenue analytics
- Participation trends
- Performance metrics
- Export capabilities

---

## 🔄 User Flows

### Admin Workflow
```
Login → Dashboard → Tournament Management
  ├── Create Tournament
  ├── Manage Registrations
  ├── Monitor Payments
  └── Generate Reports
```

### Team Registration Workflow
```
Public Page → Register Team → Fill Details → Submit Registration
  → Confirmation → Payment → Approval → Tournament Participation
```

### Tournament Lifecycle
```
Planning → Creation → Registration Open → Team Registrations
  → Registration Close → Payment Processing → Tournament Execution
  → Results → Analytics
```

---

## 🎨 UI/UX Guidelines

### Design System
**Framework**: shadcn/ui (New York style)
**Color Palette**: Neutral-based theme
**Typography**: Geist font family

### Component Library
```typescript
// Form Components
Button, Input, Label, Textarea, Select
Checkbox, Radio, Switch

// Layout Components
Card, Dialog, Sheet, Sidebar
Table, Tabs, Accordion

// Feedback Components
Toast, Alert, Badge, Skeleton
Progress, Loading States

// Navigation Components
Breadcrumb, Dropdown Menu, Pagination
```

### Responsive Design
- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: sm, md, lg, xl, 2xl
- **Grid System**: CSS Grid + Flexbox
- **Touch Friendly**: Appropriate touch targets

### Accessibility Standards
- **WCAG 2.1 AA**: Compliance target
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Semantic HTML + ARIA labels
- **Color Contrast**: Minimum 4.5:1 ratio

---

## 🔌 API Specifications

### Authentication Endpoints
```typescript
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

### Tournament Endpoints
```typescript
GET    /api/tournaments          // List all tournaments
POST   /api/tournaments          // Create tournament
GET    /api/tournaments/[id]     // Get tournament details
PUT    /api/tournaments/[id]     // Update tournament
DELETE /api/tournaments/[id]     // Delete tournament
```

### Team Endpoints
```typescript
GET    /api/teams               // List all teams
POST   /api/teams               // Create team
GET    /api/teams/[id]          // Get team details
PUT    /api/teams/[id]          // Update team
DELETE /api/teams/[id]          // Delete team
```

### Registration Endpoints
```typescript
GET    /api/registrations       // List registrations
POST   /api/registrations       // Create registration
PUT    /api/registrations/[id]  // Update registration status
DELETE /api/registrations/[id]  // Cancel registration
```

### User Management Endpoints
```typescript
GET    /api/users               // List users (Admin only)
POST   /api/users               // Create user (Admin only)
PUT    /api/users/[id]          // Update user (Admin only)
DELETE /api/users/[id]          // Delete user (Admin only)
```

---

## ⚡ Non-functional Requirements

### Performance Requirements
- **Page Load Time**: < 2 seconds (First Contentful Paint)
- **API Response Time**: < 500ms (95th percentile)
- **Database Queries**: Optimized with proper indexing
- **Bundle Size**: < 250KB (gzipped JavaScript)

### Security Requirements
- **Authentication**: JWT with secure HTTP-only cookies
- **Authorization**: Role-based access control
- **Data Validation**: Server-side validation with Zod
- **SQL Injection**: Protected via Drizzle ORM
- **XSS Protection**: Content Security Policy headers

### Scalability Requirements
- **Concurrent Users**: 1000+ simultaneous users
- **Database**: Horizontal scaling via Neon
- **File Storage**: CDN integration for assets
- **Caching**: API response caching strategy

### Reliability Requirements
- **Uptime**: 99.9% availability target
- **Error Handling**: Graceful error recovery
- **Data Backup**: Automated daily backups
- **Monitoring**: Real-time error tracking

---

## 👨‍💻 Development Guidelines

### Code Standards
```typescript
// Component Structure
export interface ComponentProps {
  // Props definition
}

export function Component({ ...props }: ComponentProps) {
  // Component implementation
}

// File Naming
kebab-case.tsx        // Components
camelCase.ts          // Utilities
UPPERCASE.md          // Documentation
```

### Component Architecture
```
src/
├── app/              # Next.js App Router
├── components/       # Reusable components
│   ├── ui/          # shadcn/ui components
│   └── [feature]/   # Feature-specific components
├── lib/             # Utilities & configurations
│   ├── db/          # Database schema & connection
│   └── auth.ts      # Authentication utilities
└── types/           # TypeScript type definitions
```

### Testing Requirements
- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Playwright for critical user flows
- **Coverage Target**: 80% code coverage

### Version Control
- **Git Workflow**: GitFlow with feature branches
- **Commit Messages**: Conventional commits format
- **Code Review**: Required for all PRs
- **CI/CD**: Automated testing and deployment

---

## 🚀 Deployment & Infrastructure

### Vercel Deployment
```bash
# Environment Setup
NEXT_PUBLIC_APP_URL=https://tournament.example.com
DATABASE_URL=postgresql://user:pass@host:port/db
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://tournament.example.com
```

### Database Setup (Neon)
```sql
-- Required Environment Variables
DATABASE_URL=postgresql://[user]:[password]@[hostname]/[database]?sslmode=require

-- Database Commands
npm run db:generate    # Generate migrations
npm run db:push        # Push schema changes
npm run db:migrate     # Run migrations
npm run db:studio      # Open Drizzle Studio
```

### Domain Configuration
- **Production**: tournament.example.com
- **Staging**: staging-tournament.example.com
- **Development**: localhost:3000

### Monitoring & Analytics
- **Error Tracking**: Sentry integration
- **Performance**: Vercel Analytics
- **User Analytics**: Google Analytics 4
- **Uptime Monitoring**: Uptime Robot

---

## 📊 Success Metrics

### Key Performance Indicators (KPIs)
1. **User Adoption**
   - Monthly Active Users (MAU)
   - User Registration Rate
   - Feature Adoption Rate

2. **Operational Efficiency**
   - Tournament Creation Time Reduction
   - Registration Processing Speed
   - Administrative Task Automation

3. **User Satisfaction**
   - Net Promoter Score (NPS)
   - User Retention Rate
   - Support Ticket Reduction

4. **Technical Performance**
   - Page Load Speed
   - API Response Times
   - Error Rate < 0.1%

### Analytics Dashboard
- Real-time user activity
- Tournament participation trends
- Revenue tracking
- Geographic distribution
- Device/browser analytics

---

## 🗺️ Product Roadmap

### Phase 1: Core MVP ✅ **COMPLETED**
- User authentication & authorization
- Tournament CRUD operations
- Team registration system
- Basic admin dashboard
- Responsive UI with shadcn/ui

### Phase 2: Enhanced Features 🔄 **IN PROGRESS**
- Player management system
- Payment integration (Stripe/Midtrans)
- Advanced analytics dashboard
- Email notifications system
- Tournament bracket generation

### Phase 3: Advanced Capabilities 📋 **PLANNED**
- Live scoring system
- Mobile app (React Native)
- Social media integration
- Multi-language support
- API for third-party integrations

### Phase 4: Enterprise Features 🎯 **FUTURE**
- Multi-tenant architecture
- Custom branding options
- Advanced reporting & exports
- Integration with sports federations
- Automated tournament scheduling

---

## 📞 Support & Maintenance

### Documentation
- **API Documentation**: Swagger/OpenAPI spec
- **User Guide**: Step-by-step tutorials
- **Admin Manual**: Administrative procedures
- **Developer Docs**: Technical implementation guide

### Maintenance Schedule
- **Security Updates**: Monthly
- **Feature Updates**: Quarterly
- **Database Maintenance**: Weekly
- **Performance Optimization**: Ongoing

### Support Channels
- **Technical Support**: GitHub Issues
- **User Support**: Email support
- **Documentation**: Comprehensive online docs
- **Community**: Discord/Slack channel

---

## 📄 Appendices

### A. Database Schema Diagram
```
users (1) ←→ (∞) tournaments
teams (∞) ←→ (∞) tournaments (via registrations)
registrations (many-to-many bridge table)
```

### B. Technology Dependencies
```json
{
  "core": ["next@15.5.3", "react@19.1.0", "typescript@5"],
  "ui": ["@radix-ui/*", "tailwindcss@4", "lucide-react"],
  "database": ["drizzle-orm", "@neondatabase/serverless"],
  "auth": ["jose", "bcryptjs"],
  "validation": ["zod"],
  "notifications": ["sonner"]
}
```

### C. Environment Configuration
```bash
# Development
NODE_ENV=development
DATABASE_URL=postgresql://localhost:5432/volleyball_dev
NEXTAUTH_SECRET=dev-secret

# Production
NODE_ENV=production
DATABASE_URL=$NEON_DATABASE_URL
NEXTAUTH_SECRET=$PRODUCTION_SECRET
NEXTAUTH_URL=https://tournament.example.com
```

---

**Document Version**: 1.0
**Last Updated**: January 2025
**Next Review**: March 2025

---

*This PRD serves as the single source of truth for the Volleyball Tournament Management System. All development decisions should align with the requirements and guidelines outlined in this document.*