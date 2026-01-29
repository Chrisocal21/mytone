import { D1Database } from "@cloudflare/workers-types";

// For Next.js development, we'll use a SQLite-compatible approach
// In production with Cloudflare Pages, this will connect to D1

export interface Database {
  prepare(query: string): PreparedStatement;
  exec(query: string): Promise<void>;
}

export interface PreparedStatement {
  bind(...values: any[]): PreparedStatement;
  first<T = unknown>(): Promise<T | null>;
  all<T = unknown>(): Promise<{ results: T[] }>;
  run(): Promise<{ success: boolean }>;
}

// Temporary in-memory storage for development
// This will be replaced with actual D1 connection in production
class InMemoryDatabase implements Database {
  private sessions: Map<string, any> = new Map();
  private users: Map<string, any> = new Map();
  private profiles: Map<string, any> = new Map();

  constructor() {
    // Initialize with default user
    const userId = "user_chris";
    this.users.set(userId, {
      id: userId,
      email: "chris@example.com",
      name: "Chris O'Connell",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      onboarding_completed: true,
      learning_progress_score: 0,
    });

    this.profiles.set("profile_chris", {
      id: "profile_chris",
      user_id: userId,
      communication_style: "Direct & Concise",
      formality_level: "Professional but Friendly",
      explanation_preference: "Brief & To-the-point",
      role_context: "Product Manager",
      signature_style: "Cheers,\nChris O'Connell",
      preferred_phrases: "[]",
      avoided_phrases: "[]",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }

  prepare(query: string): PreparedStatement {
    return new InMemoryPreparedStatement(query, this);
  }

  async exec(query: string): Promise<void> {
    // Basic exec support for schema initialization
    console.log("Executing query:", query);
  }

  _getSessions() {
    return this.sessions;
  }

  _getUsers() {
    return this.users;
  }

  _getProfiles() {
    return this.profiles;
  }
}

class InMemoryPreparedStatement implements PreparedStatement {
  private boundValues: any[] = [];

  constructor(
    private query: string,
    private db: InMemoryDatabase
  ) {}

  bind(...values: any[]): PreparedStatement {
    this.boundValues = values;
    return this;
  }

  async first<T = unknown>(): Promise<T | null> {
    const result = await this.all<T>();
    return result.results[0] || null;
  }

  async all<T = unknown>(): Promise<{ results: T[] }> {
    // Simple query parsing for development
    const query = this.query.toLowerCase();

    if (query.includes("select") && query.includes("user_profiles")) {
      const profiles = Array.from(this.db._getProfiles().values());
      return { results: profiles as T[] };
    }

    if (query.includes("select") && query.includes("users")) {
      const users = Array.from(this.db._getUsers().values());
      return { results: users as T[] };
    }

    if (query.includes("select") && query.includes("writing_sessions")) {
      const sessions = Array.from(this.db._getSessions().values());
      return { results: sessions as T[] };
    }

    return { results: [] };
  }

  async run(): Promise<{ success: boolean }> {
    const query = this.query.toLowerCase();

    if (query.includes("insert into writing_sessions")) {
      const sessionId = this.boundValues[0];
      const session = {
        id: sessionId,
        user_id: this.boundValues[1],
        mode: this.boundValues[2],
        content_type: this.boundValues[3],
        original_input: this.boundValues[4],
        ai_output: this.boundValues[5],
        final_output: this.boundValues[6],
        processing_time: this.boundValues[7],
        token_usage_input: this.boundValues[8],
        token_usage_output: this.boundValues[9],
        token_usage_total: this.boundValues[10],
        session_metadata: this.boundValues[11],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      this.db._getSessions().set(sessionId, session);
      return { success: true };
    }

    if (query.includes("update writing_sessions")) {
      const sessionId = this.boundValues[1]; // Last parameter is typically the ID
      const existing = this.db._getSessions().get(sessionId);
      if (existing) {
        existing.final_output = this.boundValues[0];
        existing.updated_at = new Date().toISOString();
      }
      return { success: true };
    }

    return { success: true };
  }
}

// Global database instance
let dbInstance: Database | null = null;

export function getDatabase(): Database {
  if (!dbInstance) {
    // In development, use in-memory database
    // In production with Cloudflare, this would connect to D1
    dbInstance = new InMemoryDatabase();
  }
  return dbInstance;
}

// Helper to get user profile
export async function getUserProfile(userId: string) {
  const db = getDatabase();
  const profile = await db
    .prepare("SELECT * FROM user_profiles WHERE user_id = ?")
    .bind(userId)
    .first();

  return profile;
}

// Helper to save session
export async function saveSession(session: {
  id: string;
  userId: string;
  mode: string;
  contentType: string;
  originalInput: string;
  aiOutput: string;
  finalOutput?: string;
  processingTime: number;
  tokenUsage: {
    input: number;
    output: number;
    total: number;
  };
}) {
  const db = getDatabase();
  
  await db
    .prepare(
      `INSERT INTO writing_sessions (
        id, user_id, mode, content_type, original_input, ai_output, 
        final_output, processing_time, token_usage_input, 
        token_usage_output, token_usage_total, session_metadata
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      session.id,
      session.userId,
      session.mode,
      session.contentType,
      session.originalInput,
      session.aiOutput,
      session.finalOutput || null,
      session.processingTime,
      session.tokenUsage.input,
      session.tokenUsage.output,
      session.tokenUsage.total,
      "{}"
    )
    .run();

  return session.id;
}

// Helper to update session with final output
export async function updateSessionFinalOutput(
  sessionId: string,
  finalOutput: string
) {
  const db = getDatabase();
  
  await db
    .prepare("UPDATE writing_sessions SET final_output = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
    .bind(finalOutput, sessionId)
    .run();
}
