// Guild & usage domain (module exports for explicit imports)

interface Guild {
  id: number;
  name: string;
  plan: string;
  system_prompt: string;
  embed_color: string | null;
  icon_url?: string | null;
  has_bot?: boolean;
}

interface UsageStats {
  guild_id: number;
  plan: string;
  monthly_tokens_used: number;
  monthly_tokens_limit: number;
  daily_ticket_count: number;
  daily_ticket_limit: number;
  concurrent_ai_sessions: number;
  concurrent_limit: number;
}

interface KnowledgeEntry {
  id: string;
  guild_id: number;
  title: string;
  content: string;
  created_at: string;
}


