// Global/shared application types

// Guild & usage domain
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

interface KnowledgeEntry {
  id: string;
  guild_id: number;
  title: string;
  content: string;
  created_at: string;
}

// Settings / UI domain
const TONES = ['Professional', 'Friendly', 'Casual', 'Formal'] as const;
type Tone = (typeof TONES)[number];

interface ActivityRow {
  id: string;
  timestamp: string;
  tokens: number;
  preview: string;
}

interface ToastMessage {
  type: 'success' | 'error';
  message: string;
}

interface UseSettingsResult {
  guildId?: string;
  view: 'ai' | 'knowledge' | 'embed' | 'usage';
  guild?: Guild;
  guildLoading: boolean;
  guildError: boolean;
  usage?: UsageStats;
  usageLoading: boolean;
  knowledge?: KnowledgeEntry[];
  knowledgeLoading: boolean;
  knowledgeError: boolean;
  systemPrompt: string;
  setSystemPrompt: (value: string) => void;
  tone: Tone;
  setTone: (value: Tone) => void;
  previewOpen: boolean;
  setPreviewOpen: (value: boolean) => void;
  testReply: string | null;
  setTestReply: (value: string | null) => void;
  embedColor: string;
  setEmbedColor: (value: string) => void;
  toast: ToastMessage | null;
  setToast: (value: ToastMessage | null) => void;
  modalOpen: boolean;
  setModalOpen: (value: boolean) => void;
  modalMode: 'create' | 'edit';
  setModalMode: (value: 'create' | 'edit') => void;
  editingEntry: KnowledgeEntry | null;
  setEditingEntry: (value: KnowledgeEntry | null) => void;
  handleSavePrompt: () => void;
  handleSaveEmbedColor: () => void;
  openCreateModal: () => void;
  openEditModal: (entry: KnowledgeEntry) => void;
  handleSubmitKnowledge: (data: { title: string; content: string }) => Promise<void>;
  handleDeleteKnowledge: (entry: KnowledgeEntry) => void;
  createKnowledgePending: boolean;
  updateKnowledgePending: boolean;
  deleteKnowledgePending: boolean;
  updateGuildPending: boolean;
  totalChars: number;
  maxChars: number;
  usageRatio: number;
  showUpgradeBanner: boolean;
  planLabel: string;
  isProOrBusiness: boolean;
  chartData: { date: string; tokens: number }[];
  recentActivity: ActivityRow[];
}