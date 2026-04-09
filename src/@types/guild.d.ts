// Guild & usage domain (global)

interface Guild {
  id: number;
  name: string;
  plan: string;
  system_prompt: string;
  embed_color: string | null;
  // Optional fields commonly returned by guild list endpoints
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

type KnowledgeTemplateType =
  | 'general_knowledge'
  | 'problem_solution'
  | 'product_info'
  | 'behavior_rule';

interface KnowledgeEntry {
  id: string;
  guild_id: number;
  title: string;
  content: string;
  main_content?: string | null;
  additional_context?: string | null;
  behavior_notes?: string | null;
  template_type?: KnowledgeTemplateType | string;
  template_payload?: Record<string, unknown> | null;
  source?: string | null;
  created_at: string;
}

interface KnowledgeFormatResult {
  title: string;
  template_type: string;
  main_content: string;
  additional_context?: string | null;
  behavior_notes?: string | null;
  template_payload?: Record<string, unknown> | null;
  content_markdown: string;
}
