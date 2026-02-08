# Cortex Deployment Guide

> Complete guide to deploying Cortex – AI Second Brain

## Prerequisites

- Node.js 20 or later
- npm or pnpm
- PostgreSQL database (Neon, Supabase, or self-hosted)
- Groq API key for AI features
- Vercel account (recommended) or other Node.js hosting

---

## Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/your-repo/cortex.git
cd cortex
npm install
```

### 2. Configure Environment

Create `.env.local` in the root directory:

```env
# Database (required)
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"

# Authentication (required)
AUTH_SECRET="your-32-char-random-secret"
AUTH_URL="http://localhost:3000"

# AI (required for full features)
GROQ_API_KEY="gsk_your_groq_api_key"
```

### 3. Initialize Database

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Seed with demo data
npx prisma db seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `AUTH_SECRET` | ✅ | Random secret for session encryption |
| `AUTH_URL` | ✅ | Your application URL |
| `GROQ_API_KEY` | ✅ | API key from Groq Console |

### Generate AUTH_SECRET

```bash
# Unix/Mac
openssl rand -base64 32

# PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }) -as [byte[]])
```

---

## Database Setup

### Option 1: Neon (Recommended)

1. Create account at [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string from Dashboard
4. Add to `.env.local`:

```env
DATABASE_URL="postgresql://user:pass@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require"
```

### Option 2: Supabase

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings → Database
4. Copy connection string (use "Transaction" mode for serverless)

```env
DATABASE_URL="postgresql://postgres:pass@db.xxx.supabase.co:5432/postgres"
```

### Option 3: Railway

1. Create account at [railway.app](https://railway.app)
2. Add PostgreSQL to project
3. Copy connection string from Variables

### Option 4: Local PostgreSQL

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/cortex"
```

---

## Groq API Setup

1. Visit [console.groq.com](https://console.groq.com)
2. Create account or sign in
3. Go to API Keys section
4. Create new API key
5. Add to `.env.local`:

```env
GROQ_API_KEY="gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

### Supported Models

Cortex uses these models in order of preference:

1. `llama-3.3-70b-versatile` (primary)
2. `llama-3.1-8b-instant` (fallback)
3. `mixtral-8x7b-32768` (backup)

---

## Vercel Deployment

### Automatic (Recommended)

1. Push code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Import your repository
4. Configure environment variables:
   - `DATABASE_URL`
   - `AUTH_SECRET`
   - `AUTH_URL` (your Vercel domain, e.g., `https://cortex.vercel.app`)
   - `GROQ_API_KEY`
5. Deploy

### Manual (Vercel CLI)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Set environment variables
vercel env add DATABASE_URL
vercel env add AUTH_SECRET
vercel env add AUTH_URL
vercel env add GROQ_API_KEY
```

### Build Settings

- **Framework**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

---

## CI/CD Pipeline

The included GitHub Actions workflow (`.github/workflows/ci.yml`) provides:

1. **Code Quality**: Linting and type checking
2. **Build**: Verify production build succeeds
3. **Security**: npm audit for vulnerabilities
4. **Deploy**: Automatic Vercel deployment on main branch
5. **Health Check**: Post-deployment API verification

### Required Secrets

Add these to GitHub repository secrets:

| Secret | Description |
|--------|-------------|
| `VERCEL_TOKEN` | Vercel API token |
| `VERCEL_ORG_ID` | Your Vercel organization ID |
| `VERCEL_PROJECT_ID` | Your Vercel project ID |
| `PRODUCTION_URL` | Deployed URL for health checks |

---

## Database Migrations

### Development

```bash
# Push schema changes (development)
npx prisma db push

# View database in browser
npx prisma studio
```

### Production

```bash
# Create migration
npx prisma migrate dev --name description

# Apply migration to production
npx prisma migrate deploy
```

---

## Seeding Data

### Demo Data

```bash
# Seed with sample notes
npm run seed

# Or directly
npx prisma db seed
```

This creates:
- Demo user (demo@cortex.ai / demo123)
- 10 sample notes with various types and priorities

---

## Monitoring & Observability

### Recommended Services

| Service | Purpose |
|---------|---------|
| [Sentry](https://sentry.io) | Error tracking |
| [Vercel Analytics](https://vercel.com/analytics) | Performance monitoring |
| [Axiom](https://axiom.co) | Log aggregation |
| [Better Uptime](https://betteruptime.com) | Uptime monitoring |

### Health Check Endpoint

```bash
curl https://your-domain.com/api/public/brain
```

Should return 200 OK with public notes array.

---

## Troubleshooting

### Database Connection Error

```
Error: Can't reach database server
```

**Solutions:**
1. Verify DATABASE_URL is correct
2. Check database is running and accessible
3. For Neon, ensure connection pooling is enabled
4. Allow IP in database firewall settings

### Authentication Error

```
Error: AUTH_SECRET is missing
```

**Solutions:**
1. Ensure AUTH_SECRET is set in environment
2. For Vercel, add environment variable in dashboard
3. Redeploy after adding variables

### AI Processing Fails

```
Error: Groq API error
```

**Solutions:**
1. Verify GROQ_API_KEY is valid
2. Check Groq rate limits
3. Notes still save with fallback metadata

### Build Fails

```
Error: Prisma generate failed
```

**Solutions:**
1. Run `npx prisma generate` before build
2. Ensure @prisma/client is in dependencies
3. Check prisma/schema.prisma syntax

---

## Performance Tuning

### Database

- Enable connection pooling (Neon/Supabase)
- Use read replicas for high traffic
- Add indexes for frequent queries

### Caching

- Consider Redis for session caching
- Cache public notes list
- Implement stale-while-revalidate

### Edge Optimization

- Use Vercel Edge Functions for public API
- Enable Vercel Edge Config for settings
- CDN for static assets

---

## Security Checklist

- [ ] AUTH_SECRET is random and secure
- [ ] DATABASE_URL uses SSL
- [ ] GROQ_API_KEY is not exposed in client code
- [ ] Rate limiting is configured
- [ ] CORS headers are proper for public API
- [ ] All authenticated routes check session
- [ ] Password hashing uses bcrypt with 12 rounds

---

## Backup Strategy

### Database Backups

| Provider | Backup Method |
|----------|---------------|
| Neon | Automatic point-in-time recovery |
| Supabase | Daily backups + point-in-time |
| Railway | Automatic daily backups |

### Data Export

```bash
# Export all data as JSON
pg_dump -Fc $DATABASE_URL > backup.dump

# Import backup
pg_restore -d $DATABASE_URL backup.dump
```

---

## Scaling Considerations

### Horizontal Scaling

- Vercel handles auto-scaling
- Database connection pooling essential
- Consider read replicas for high read load

### Rate Limiting Adjustment

Edit `src/lib/rate-limit.ts` for custom limits:

```typescript
const limiter = createRateLimiter({
  max: 100,        // requests
  windowMs: 60000, // per minute
});
```

### AI Cost Management

- Monitor Groq usage in console
- Implement caching for repeated queries
- Consider fallback to cheaper models

---

## Support

- **Issues**: GitHub Issues
- **Documentation**: `/docs` folder
- **API Reference**: `docs/API.md`
