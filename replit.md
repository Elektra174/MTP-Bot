# MPT Therapist Chatbot

## Overview

This is an AI-powered therapeutic chatbot application implementing Meta-Personal Therapy (MPT) methodology. The application provides psychological support through structured therapeutic scenarios and free-form consultations, utilizing the Cerebras AI API for natural language processing.

The system guides users through evidence-based therapeutic protocols including work with burnout, anxiety management, relationship difficulties, and self-identity crises. It follows strict MPT methodology principles focused on identifying deep needs, working with bodily sensations and emotions, and developing constructive strategies.

## Recent Changes (December 06, 2025)

**Project Import Completed**: Successfully imported GitHub repository and configured for Replit environment
- Installed all npm dependencies (100+ packages including React, Express, Tailwind, Radix UI)
- Created missing `shared/schema.ts` file with 15 therapeutic scenarios and type definitions
- Verified Vite configuration for Replit proxy compatibility (allowedHosts: true)
- Set up development workflow "Start application" running on port 5000
- Configured CEREBRAS_API_KEY environment secret
- Successfully tested application - Russian language UI loads correctly
- Configured deployment settings for production (autoscale, npm build/start)

**Status**: Application is fully functional and ready to use in both development and production modes.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript running on Vite for fast development and optimized production builds.

**UI Component System**: shadcn/ui components built on Radix UI primitives, following Material Design 3 principles adapted for therapeutic environments. The design emphasizes:
- Professional therapeutic aesthetic with calming visual language
- Clear information hierarchy optimized for extended reading sessions
- Minimal cognitive load to maintain focus on therapeutic content
- Inter font family for excellent readability

**State Management**: 
- React Query (@tanstack/react-query) for server state management and API interactions
- Local React state with hooks for component-level state
- Session state persisted in-memory on the server side

**Routing**: Single-page application with component-based navigation. Primary routes handled through conditional rendering rather than traditional routing library.

**Styling**: 
- Tailwind CSS with custom design tokens defined in CSS variables
- Dark/light theme support via ThemeProvider context
- Consistent spacing system using Tailwind units (3, 4, 6, 8, 12, 16)
- Custom shadows and elevation effects for Material Design feel

### Backend Architecture

**Framework**: Express.js server with TypeScript

**API Structure**: RESTful API with primary endpoint `/api/chat` for streaming therapeutic conversations

**Session Management**: In-memory Map-based session storage tracking:
- Conversation history (messages array)
- Current therapeutic phase
- Selected scenario context
- Session timestamps

**AI Integration**: Cerebras Cloud SDK client configured with:
- Model: qwen-3-235b-a22b-instruct-2507
- Streaming responses for real-time interaction
- Temperature: 0.7, Top-p: 0.8 for balanced creativity
- Max completion tokens: 20,000

**Therapeutic Logic**: 
- Comprehensive MPT system prompt embedding therapeutic methodology
- Scenario-based conversation flows with 15 predefined therapeutic scenarios including:
  - Burnout and emotional exhaustion
  - Anxiety and panic attacks
  - Loneliness and social isolation
  - Relationship difficulties
  - Loss and grief
  - Trauma recovery
  - Self-esteem and identity crises
  - And more specialized scenarios
- Phase tracking through therapeutic process (initial → goals → needs → energy → metaposition → integration → actions → closing)
- Circular questioning techniques to identify deep needs

### Data Storage Solutions

**Current Implementation**: In-memory storage using JavaScript Map objects for:
- User data (minimal authentication structure in place)
- Active chat sessions
- Message history

**Database Configuration**: Drizzle ORM configured for PostgreSQL with schema defined but not actively used in current implementation. Database migration setup exists for future persistence requirements.

**Schema Design** (defined but not implemented):
- Users table with UUID primary keys
- Potential for sessions and messages tables to persist therapeutic history

### Authentication and Authorization

**Current State**: Basic authentication structure defined but not enforced. The system includes:
- User schema with username/password fields
- Storage interface for user CRUD operations
- No active authentication middleware in request pipeline

**Future Consideration**: Session-based authentication with express-session configured via connect-pg-simple for PostgreSQL-backed sessions (package installed but not implemented).

### Design System Integration

**Component Library**: Full shadcn/ui component suite including:
- Form components (input, textarea, select, checkbox, radio)
- Layout components (card, dialog, popover, sheet, sidebar)
- Feedback components (toast, alert, progress)
- Navigation components (tabs, accordion, breadcrumb)

**Responsive Design**: Mobile-first approach with:
- useIsMobile hook for breakpoint detection (768px)
- Sidebar component with mobile sheet variant
- Adaptive spacing and typography scales

**Accessibility**: Components built on Radix UI primitives ensuring:
- Keyboard navigation support
- ARIA attributes for screen readers
- Focus management and visual indicators

### Build and Development

**Development Server**: Vite dev server with HMR (Hot Module Replacement) via WebSocket at `/vite-hmr`
- Command: `npm run dev` 
- Runs on port 5000 bound to 0.0.0.0 for Replit compatibility
- TypeScript execution via tsx for hot reloading

**Production Build**: 
- Client: Vite builds to `dist/public`
- Server: esbuild bundles TypeScript to `dist/index.cjs` with selective dependency bundling
- Build script uses allowlist approach for critical dependencies to reduce cold start times
- Command: `npm run build`

**Production Deployment**:
- Command: `npm start` (runs NODE_ENV=production node dist/index.cjs)
- Deployment target: Autoscale (stateless web application)
- Serves static files from dist/public and handles API requests

**Development Tools**:
- Replit-specific plugins for cartographer and dev banner (environment-conditional)
- Runtime error overlay for improved debugging
- TypeScript strict mode enabled across entire codebase

## External Dependencies

### AI Services
- **Cerebras Cloud SDK** (@cerebras/cerebras_cloud_sdk): Primary LLM provider for therapeutic conversations
- API key configured via `CEREBRAS_API_KEY` environment variable
- Streaming completion API for real-time responses

### Database
- **PostgreSQL**: Configured via `DATABASE_URL` environment variable (Drizzle expects this to be provisioned)
- **Drizzle ORM**: Type-safe database toolkit with schema defined in `shared/schema.ts`
- **connect-pg-simple**: PostgreSQL session store adapter (installed but not active)

### UI Framework Dependencies
- **Radix UI**: Headless component primitives for accessibility-first components
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **class-variance-authority**: Type-safe variant styling for component variations
- **Lucide React**: Icon library for consistent visual language

### Form Management
- **React Hook Form**: Via @hookform/resolvers integration with Zod schemas
- **Zod**: Runtime type validation for request/response schemas
- **drizzle-zod**: Schema generation from Drizzle tables

### Development Dependencies
- **Vite**: Frontend build tool and dev server
- **esbuild**: Server-side TypeScript compilation for production
- **tsx**: TypeScript execution for development server

### Utility Libraries
- **date-fns**: Date formatting and manipulation
- **nanoid**: Unique ID generation for sessions and messages
- **clsx + tailwind-merge**: Conditional className utilities

### Planned/Optional Integrations
- Authentication providers (passport infrastructure exists)
- Email services (nodemailer installed)
- Payment processing (stripe installed but unused)
- File uploads (multer installed but unused)