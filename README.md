# Cortex – AI Second Brain

A beautifully intelligent knowledge management system that captures, organizes, and retrieves thoughts using AI agents. Built with Next.js, Prisma, Google Gemini, and Framer Motion.

## Features

### 🧠 Intelligent Capture
- **Zero-config input**: Just type your raw thought and hit save
- **AI processing**: Automatic title generation, summarization, tagging, and classification
- **Flexible types**: Notes, Links, and Insights are auto-categorized

### 📊 Smart Dashboard
- **Masonry grid**: Pinterest-style layout with smooth animations
- **Real-time search**: Debounced filtering that shuffles the grid smoothly
- **Type filters**: Quick toggle between Notes, Links, and Insights
- **Motion & delight**: Staggered animations, hover effects, parallax elements

### 🤖 AI Conversational Query
- **Ask your brain**: Natural language queries against your knowledge base
- **RAG-powered**: Retrieval Augmented Generation for contextual answers
- **Source citations**: See which notes informed the response

### 🌐 Public Infrastructure
- **API endpoint**: `GET /api/public/brain` – Returns your public notes as JSON
- **Query API**: `POST /api/public/brain/query` – Conversational AI queries
- **Embeddable widget**: `/embed` – Iframe-ready chat interface

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14+ (App Router) |
| Styling | Tailwind CSS + Shadcn/UI |
| Database | PostgreSQL + Prisma ORM |
| AI Engine | Google Gemini (gemini-2.0-flash) |
| Animations | Framer Motion |
| Deployment | Vercel + Neon/Supabase |

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (Neon, Supabase, or local)
- Google Gemini API key (free at [aistudio.google.com](https://aistudio.google.com/apikey))

### Installation

```bash
# Install dependencies
npm install

# Setup environment variables (edit .env)
# DATABASE_URL="postgresql://user:password@host:5432/cortex?sslmode=require"
# GEMINI_API_KEY="your-gemini-api-key"

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Start development server
npm run dev
```

## API Reference

### Create Note
```http
POST /api/notes
Content-Type: application/json

{ "content": "Your raw thought here...", "isPublic": false }
```

### Get All Notes
```http
GET /api/notes?q=search&type=NOTE
```

### Query Knowledge Base
```http
POST /api/public/brain/query
Content-Type: application/json

{ "question": "What do I know about React?" }
```

### Public Notes
```http
GET /api/public/brain
```

## Embedding the Widget

```html
<iframe src="https://your-domain.com/embed" width="400" height="500"></iframe>
```

## Architecture

See `/docs` page for detailed architecture documentation covering:
- Portable Architecture
- Principles-Based UX
- Agent Thinking
- Infrastructure Mindset

## License

MIT
