# Cortex API Documentation

> AI-Powered Second Brain API

## Overview

Cortex provides a RESTful API for managing notes with AI-powered analysis, plus public endpoints for querying your knowledge base.

**Base URL:** `https://your-domain.com/api`

## Authentication

### Session-Based Authentication

All authenticated endpoints require a valid session from NextAuth.js.

```http
Cookie: next-auth.session-token=<session-token>
```

### Login

```http
POST /api/auth/signin
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "your-password"
}
```

### Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "your-password",
  "name": "Your Name"           // optional
}
```

#### Response (201 Created)

```json
{
  "message": "Account created successfully",
  "user": {
    "id": "clx123...",
    "email": "user@example.com",
    "name": "Your Name"
  }
}
```

#### Errors

| Status | Description |
|--------|-------------|
| 400 | Missing email or password, or password < 6 chars |
| 409 | User already exists |
| 503 | Database not configured |

---

## Notes API (Authenticated)

All `/api/notes/*` endpoints require authentication.

### Create Note

```http
POST /api/notes
Content-Type: application/json
```

#### Request Body (Note Mode)

```json
{
  "content": "Your thought or note content here...",
  "isPublic": false
}
```

#### Request Body (Link Mode)

```json
{
  "url": "https://example.com/article",
  "description": "Optional description of the link"
}
```

#### Request Body (File Mode)

```json
{
  "fileName": "document.pdf",
  "fileType": "application/pdf",
  "description": "Notes about this file"
}
```

#### Response (201 Created)

```json
{
  "note": {
    "id": "clx456...",
    "title": "AI-Generated Title",
    "content": "Original content...",
    "type": "NOTE",
    "tags": ["tag1", "tag2", "tag3"],
    "summary": "AI-generated one-sentence summary.",
    "priority": 75,
    "isPublic": false,
    "createdAt": "2026-02-08T12:00:00.000Z",
    "updatedAt": "2026-02-08T12:00:00.000Z"
  }
}
```

#### AI-Enriched Fields

| Field | Description |
|-------|-------------|
| `title` | Auto-generated title (max 8 words) |
| `summary` | One-sentence summary |
| `tags` | 2-5 relevant tags |
| `type` | NOTE, LINK, INSIGHT, or FILE |
| `priority` | 1-100 score based on importance |

### List Notes

```http
GET /api/notes?search=keyword&type=NOTE&sort=priority
```

#### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `search` | string | Search in title, content, summary, tags |
| `type` | string | Filter by type: NOTE, LINK, INSIGHT, FILE |
| `sort` | string | Sort by: `priority` (desc), `date` (desc) |

#### Response (200 OK)

```json
{
  "notes": [
    {
      "id": "clx456...",
      "title": "Note Title",
      "content": "Content...",
      "type": "NOTE",
      "tags": ["tag1", "tag2"],
      "summary": "Summary...",
      "priority": 75,
      "isPublic": false,
      "createdAt": "2026-02-08T12:00:00.000Z"
    }
  ]
}
```

### Get Single Note

```http
GET /api/notes/:id
```

#### Response (200 OK)

```json
{
  "note": {
    "id": "clx456...",
    "title": "Note Title",
    "content": "Full content...",
    "type": "NOTE",
    "tags": ["tag1", "tag2"],
    "summary": "Summary...",
    "priority": 75,
    "sourceUrl": null,
    "fileName": null,
    "fileType": null,
    "isPublic": false,
    "createdAt": "2026-02-08T12:00:00.000Z",
    "updatedAt": "2026-02-08T12:00:00.000Z"
  }
}
```

### Delete Note

```http
DELETE /api/notes/:id
```

#### Response (200 OK)

```json
{
  "message": "Note deleted"
}
```

### Toggle Public Visibility

```http
PATCH /api/notes/:id
```

#### Response (200 OK)

```json
{
  "note": {
    "id": "clx456...",
    "isPublic": true
  }
}
```

---

## Public API (No Authentication)

These endpoints are publicly accessible with CORS support.

### Get Public Notes

```http
GET /api/public/brain
```

#### Response (200 OK)

```json
{
  "notes": [
    {
      "id": "clx789...",
      "title": "Public Note",
      "summary": "This is a public note summary.",
      "type": "INSIGHT",
      "tags": ["public", "shared"],
      "createdAt": "2026-02-08T12:00:00.000Z"
    }
  ],
  "total": 10
}
```

### Query Knowledge Base

Conversational AI query using RAG (Retrieval Augmented Generation).

```http
POST /api/public/brain/query
Content-Type: application/json

{
  "query": "What do I know about AI and productivity?"
}
```

#### Response (200 OK)

```json
{
  "answer": "Based on your knowledge base, you have several insights about AI and productivity...",
  "sources": [
    {
      "id": "clx789...",
      "title": "AI and Productivity",
      "summary": "Using AI tools to enhance workflow..."
    }
  ],
  "confidence": "high"
}
```

#### Confidence Levels

| Level | Description |
|-------|-------------|
| `high` | Strong matches found in knowledge base |
| `medium` | Partial matches, some inference |
| `low` | Limited context, response may be general |

### CORS Preflight

```http
OPTIONS /api/public/brain/query
```

Returns appropriate CORS headers for cross-origin requests.

---

## Rate Limiting

All endpoints are rate-limited to prevent abuse.

| Endpoint Type | Limit | Window |
|--------------|-------|--------|
| Standard reads | 60 requests | 1 minute |
| AI operations | 10 requests | 1 minute |
| Public API | 30 requests | 1 minute |
| Create operations | 20 requests | 1 minute |

### Rate Limit Headers

```http
X-RateLimit-Remaining: 55
X-RateLimit-Reset: 1707400000
Retry-After: 30
```

---

## Error Responses

### Standard Error Format

```json
{
  "error": "Error message here",
  "details": "Additional context (optional)"
}
```

### HTTP Status Codes

| Status | Description |
|--------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized |
| 404 | Not Found |
| 409 | Conflict (duplicate) |
| 429 | Rate Limit Exceeded |
| 500 | Server Error |
| 503 | Service Unavailable (database not configured) |

---

## Note Types

| Type | Description | Priority Range |
|------|-------------|----------------|
| `NOTE` | General thought or note | 50-70 |
| `LINK` | Saved URL with description | 50-65 |
| `INSIGHT` | Important realization or discovery | 70-95 |
| `FILE` | File reference with metadata | 50-72 |

---

## Priority Scoring Algorithm

Notes are automatically scored 1-100 based on content analysis:

| Keywords | Score |
|----------|-------|
| urgent, emergency, deadline, asap | 95 (Critical) |
| important, essential, must, decision | 80 (High) |
| breakthrough, aha, learned, revelation | 78 (Insight) |
| todo, implement, build, fix | 70 (Actionable) |
| study, research, explore | 68 (Learning) |
| concept, vision, strategy | 65 (Ideas) |
| note, remember, bookmark | 50 (Reference) |

### Bonuses

- +5 for content > 100 words
- +5 for content > 200 words
- +3 for questions (contains "?")
- +3 for lists (contains bullet points)

---

## Embeddable Widget

Embed Cortex queries in any website:

```html
<iframe
  src="https://your-domain.com/embed"
  width="400"
  height="600"
  frameborder="0"
  title="Cortex Knowledge Widget"
></iframe>
```

The embed page provides a chat interface for querying your public knowledge base.

---

## Examples

### cURL Examples

**Create a note:**

```bash
curl -X POST https://your-domain.com/api/notes \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_TOKEN" \
  -d '{"content": "Important insight about AI development"}'
```

**Query public knowledge:**

```bash
curl -X POST https://your-domain.com/api/public/brain/query \
  -H "Content-Type: application/json" \
  -d '{"query": "What do I know about productivity?"}'
```

### JavaScript Examples

**Fetch public notes:**

```javascript
const response = await fetch('https://your-domain.com/api/public/brain');
const { notes } = await response.json();
console.log(notes);
```

**Query knowledge base:**

```javascript
const response = await fetch('https://your-domain.com/api/public/brain/query', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: 'What are my key insights?' })
});
const { answer, sources, confidence } = await response.json();
console.log(answer);
```

---

## SDK & Libraries

Coming soon:
- JavaScript/TypeScript SDK
- Python client library
- CLI tool for terminal-based note capture

---

## Support

- GitHub Issues: [github.com/your-repo/cortex/issues](https://github.com/your-repo/cortex/issues)
- Documentation: [github.com/your-repo/cortex/wiki](https://github.com/your-repo/cortex/wiki)
