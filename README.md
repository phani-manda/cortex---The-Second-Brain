# Cortex – AI Second Brain

A beautifully intelligent knowledge management system that captures, organizes, and retrieves thoughts using AI agents. Built with Next.js 16, Prisma, Groq AI (Llama 3.3-70b), and Framer Motion.

## Features

### 🧠 Intelligent Capture
- **Zero-config input**: Just type your raw thought and hit save
- **AI processing**: Automatic title generation, summarization, tagging, and classification
- **Flexible types**: Notes, Links, Insights, and Files are auto-categorized
- **Priority scoring**: AI-powered importance ranking (1-100)

### 📊 Smart Dashboard
- **Responsive grid**: Adaptive layout (1-3 columns by screen size)
- **Real-time search**: Debounced filtering with smooth animations
- **Type filters**: Quick toggle between Notes, Links, Insights, Files
- **Sort options**: By priority or date
- **Motion & delight**: Staggered animations, hover effects, parallax elements

### 🤖 AI Conversational Query
- **Ask your brain**: Natural language queries against your knowledge base
- **RAG-powered**: Retrieval Augmented Generation for contextual answers
- **Source citations**: See which notes informed the response
- **Confidence scoring**: High, medium, low confidence indicators

### 🔐 Authentication
- **NextAuth v5**: Secure session-based authentication
- **User accounts**: Email/password registration and login
- **Protected routes**: Notes are private to their owner
- **Public sharing**: Toggle individual notes as public

### 🌐 Public Infrastructure
- **API endpoint**: `GET /api/public/brain` – Returns public notes as JSON
- **Query API**: `POST /api/public/brain/query` – Conversational AI queries
- **Embeddable widget**: `/embed` – Iframe-ready chat interface
- **CORS support**: Cross-origin requests enabled

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16 (App Router, React 19) |
| Styling | Tailwind CSS 4 + Shadcn/UI |
| Database | PostgreSQL + Prisma 7 |
| AI Engine | Groq (Llama 3.3-70b with fallbacks) |
| Auth | NextAuth v5 (Credentials provider) |
| Animations | Framer Motion 12 |
| Deployment | Vercel + Neon/Supabase |

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL database (Neon, Supabase, or local)
- Groq API key (free at [console.groq.com](https://console.groq.com))

### Installation

```bash
# Clone repository
git clone https://github.com/your-repo/cortex.git
cd cortex

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Seed with demo data
npx prisma db seed

# Start development server
npm run dev
```

### Environment Variables

```env
# Database (required)
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"

# Authentication (required)
AUTH_SECRET="generate-with-openssl-rand-base64-32"
AUTH_URL="http://localhost:3000"

# AI (required for full features)
GROQ_API_KEY="gsk_your_groq_api_key"
```

## API Reference

### Authentication

```http
POST /api/auth/register
Content-Type: application/json

{ "email": "user@example.com", "password": "password123", "name": "Your Name" }
```

### Create Note (Authenticated)

```http
POST /api/notes
Content-Type: application/json
Cookie: next-auth.session-token=<token>

{ "content": "Your raw thought here...", "isPublic": false }
```

### Get All Notes (Authenticated)

```http
GET /api/notes?search=keyword&type=NOTE&sort=priority
```

### Query Public Knowledge Base

```http
POST /api/public/brain/query
Content-Type: application/json

{ "query": "What do I know about React?" }
```

### Get Public Notes

```http
GET /api/public/brain
```

See [docs/API.md](docs/API.md) for complete API documentation.

## Embedding the Widget

```html
<iframe 
  src="https://your-domain.com/embed" 
  width="400" 
  height="600"
  title="Cortex Knowledge Widget"
></iframe>
```

## Documentation

- [API Reference](docs/API.md) – Complete API documentation
- [Deployment Guide](docs/DEPLOYMENT.md) – Production deployment instructions
- [Architecture](/docs) – In-app documentation page

## Scripts

```bash
npm run dev        # Start development server
npm run build      # Production build
npm run start      # Start production server
npm run lint       # Run ESLint
npm run seed       # Seed database with demo data
npm run db:push    # Push Prisma schema to database
npm run db:studio  # Open Prisma Studio
```

## Architecture

See `/docs` page for detailed architecture documentation covering:
- **Portable Architecture**: Export-ready, platform-agnostic design
- **Principles-Based UX**: 5 core UX principles (Instant Capture, Visual Hierarchy, Progressive Disclosure, Feedback Loops, Accessible Everywhere)
- **Agent Thinking**: AI-first approach with priority scoring algorithm
- **Infrastructure Mindset**: API-first, embeddable, rate-limited

## License

MIT
