// Settings / UI domain (global)

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
  usageError: boolean;
  historyLoading: boolean;
  historyError: boolean;
  logsLoading: boolean;
  logsError: boolean;
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
  openProblemModal: () => void;
  problemModalOpen: boolean;
  setProblemModalOpen: (value: boolean) => void;
  openEditModal: (entry: KnowledgeEntry) => void;
  handleSubmitKnowledge: (
    data: import('../components/KnowledgeModal').KnowledgeSubmitPayload,
  ) => Promise<void>;
  handleAutoFormat: (args: {
    raw_text: string;
    template_type: string;
    title_hint: string;
  }) => Promise<KnowledgeFormatResult>;
  handleSubmitProblem: (data: { problem: string; solution: string }) => Promise<void>;
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


