# Database Setup Guide

## Current Implementation

mytone uses an **in-memory database** for development. This means:
- ✅ No setup required to start using the app
- ✅ Sessions are stored during runtime
- ✅ User profiles are pre-configured
- ⚠️ Data is cleared when the dev server restarts

## Database Structure

### Tables
1. **users** - User accounts
2. **user_profiles** - Communication preferences and patterns
3. **writing_sessions** - All processing sessions with input/output
4. **learning_patterns** - Learned user preferences
5. **edit_analytics** - Detailed edit tracking for learning

### Pre-configured User
- **User ID**: `user_chris`
- **Name**: Chris O'Connell
- **Profile**: Direct & Concise, Professional but Friendly
- **Signature**: Cheers, Chris O'Connell

## Production Setup (Cloudflare D1)

When ready to deploy with persistent storage:

### 1. Create D1 Database
```bash
# Install Wrangler globally
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Create production database
wrangler d1 create mytone-db

# Create development database
wrangler d1 create mytone-db-dev
```

### 2. Update wrangler.toml
Copy the database IDs from the output and update `wrangler.toml`:
```toml
[[d1_databases]]
binding = "DB"
database_name = "mytone-db"
database_id = "YOUR_PRODUCTION_DATABASE_ID"

[env.development]
[[env.development.d1_databases]]
binding = "DB"
database_name = "mytone-db-dev"
database_id = "YOUR_DEV_DATABASE_ID"
```

### 3. Initialize Schema
```bash
# Production
wrangler d1 execute mytone-db --file=./db/schema.sql
wrangler d1 execute mytone-db --file=./db/seed.sql

# Development
wrangler d1 execute mytone-db-dev --file=./db/schema.sql
wrangler d1 execute mytone-db-dev --file=./db/seed.sql
```

### 4. Update Database Connection
Replace the in-memory database in `lib/database.ts` with actual D1 connection:
```typescript
// Use process.env.DB or Cloudflare binding
export function getDatabase(): D1Database {
  // Access D1 from Cloudflare Pages/Workers context
  return globalThis.DB;
}
```

## Querying Data

### View Sessions
```bash
# Local (while dev server is running, sessions are in memory)

# Production
wrangler d1 execute mytone-db --command="SELECT * FROM writing_sessions ORDER BY created_at DESC LIMIT 10"
```

### View User Profile
```bash
wrangler d1 execute mytone-db --command="SELECT * FROM user_profiles WHERE user_id = 'user_chris'"
```

## Development Notes

- Current in-memory implementation is sufficient for MVP development
- All database functions are abstracted in `lib/database.ts`
- Easy migration path to D1 when ready for production
- No data persistence between dev server restarts (intentional for now)
