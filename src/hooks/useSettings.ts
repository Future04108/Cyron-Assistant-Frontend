import { useEffect, useMemo, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  guildService
} from '../services/guildService';

const PLAN_CHAR_LIMITS: Record<string, number> = {
  free: 20000,
  pro: 50000,
  business: 100000,
};

const TONE_SAMPLE_REPLIES: Record<Tone, string> = {
  Professional:
    'Thank you for reaching out. I’d be happy to help you with that. Could you please provide a few more details so we can assist you effectively?',
  Friendly:
    'Hey! Thanks for messaging. I’d love to help — can you tell me a bit more about what you’re running into?',
  Casual: 'Sure thing! What’s going on? Share the details and we’ll figure it out.',
  Formal:
    'We acknowledge your inquiry. Please provide the relevant information so that we may proceed in accordance with our procedures.',
};

const entryChars = (entry: KnowledgeEntry) =>
  (entry.title?.length ?? 0) + (entry.content?.length ?? 0);

function mockDailyTokenData(monthlyUsed: number): { date: string; tokens: number }[] {
  const days = 7;
  const now = new Date();
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (days - 1 - i));
    const label = d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
    const tokens =
      i === days - 1
        ? monthlyUsed % 10000
        : Math.floor((monthlyUsed / days) * (0.7 + Math.random() * 0.6));
    return { date: label, tokens };
  });
}

function mockRecentActivity(): ActivityRow[] {
  return [
    {
      id: '1',
      timestamp: new Date().toISOString(),
      tokens: 120,
      preview: 'How do I reset my password?',
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      tokens: 85,
      preview: 'Refund policy question',
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      tokens: 210,
      preview: 'Account linking issue',
    },
    {
      id: '4',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      tokens: 95,
      preview: 'Billing inquiry',
    },
    {
      id: '5',
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      tokens: 150,
      preview: 'Feature request',
    },
  ];
}

export const useSettings = (): UseSettingsResult => {
  const params = useParams<{ guildId?: string }>();
  const guildId = params.guildId;
  const location = useLocation();
  const queryClient = useQueryClient();

  const [systemPrompt, setSystemPrompt] = useState('');
  const [tone, setTone] = useState<Tone>('Professional');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [testReply, setTestReply] = useState<string | null>(null);
  const [embedColor, setEmbedColor] = useState('#1ab7ef');
  const [toast, setToast] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingEntry, setEditingEntry] = useState<KnowledgeEntry | null>(null);

  const view = useMemo(() => {
    const path = location.pathname;
    if (path.includes('/knowledge')) return 'knowledge' as const;
    if (path.includes('/embed-customization')) return 'embed' as const;
    if (path.includes('/usage-analytics')) return 'usage' as const;
    return 'ai' as const;
  }, [location.pathname]);

  const {
    data: guild,
    isLoading: guildLoading,
    isError: guildError,
  } = useQuery({
    queryKey: ['guild', guildId],
    queryFn: () => guildService.fetchGuild(guildId!),
    enabled: !!guildId,
  });

  const {
    data: usage,
    isLoading: usageLoading,
  } = useQuery({
    queryKey: ['usage', guildId],
    queryFn: () => guildService.fetchUsage(guildId!),
    enabled: !!guildId && view === 'usage',
  });

  const {
    data: knowledge,
    isLoading: knowledgeLoading,
    isError: knowledgeError,
  } = useQuery({
    queryKey: ['knowledge', guildId],
    queryFn: () => guildService.fetchKnowledge(guildId!),
    enabled: !!guildId && view === 'knowledge',
  });

  useEffect(() => {
    if (guild) {
      setSystemPrompt(guild.system_prompt ?? '');
      setEmbedColor(
        guild.embed_color && /^#[0-9A-Fa-f]{6}$/.test(guild.embed_color)
          ? guild.embed_color
          : '#1ab7ef',
      );
    }
  }, [guild]);

  useEffect(() => {
    setTestReply(null);
    setModalOpen(false);
    setEditingEntry(null);
  }, [view]);

  const updateGuildMutation = useMutation({
    mutationFn: (payload: { system_prompt?: string; embed_color?: string }) =>
      guildService.updateGuild(guildId!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guild', guildId] });
      setToast({ type: 'success', message: 'Settings saved.' });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.detail ?? 'Failed to save. Please try again.';
      setToast({ type: 'error', message: msg });
    },
  });

  const createKnowledgeMutation = useMutation({
    mutationFn: (payload: { title: string; content: string }) =>
      guildService.createKnowledge(guildId!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge', guildId] });
      setToast({ type: 'success', message: 'Knowledge entry created.' });
      setModalOpen(false);
      setEditingEntry(null);
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.detail ??
        'Failed to create knowledge entry. Please try again.';
      setToast({ type: 'error', message: msg });
    },
  });

  const updateKnowledgeMutation = useMutation({
    mutationFn: (payload: { id: string; title: string; content: string }) =>
      guildService.updateKnowledge(guildId!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge', guildId] });
      setToast({ type: 'success', message: 'Knowledge entry updated.' });
      setModalOpen(false);
      setEditingEntry(null);
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.detail ??
        'Failed to update knowledge entry. Please try again.';
      setToast({ type: 'error', message: msg });
    },
  });

  const deleteKnowledgeMutation = useMutation({
    mutationFn: (id: string) => guildService.deleteKnowledge(guildId!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge', guildId] });
      setToast({ type: 'success', message: 'Knowledge entry deleted.' });
    },
    onError: () => {
      setToast({
        type: 'error',
        message: 'Failed to delete knowledge entry. Please try again.',
      });
    },
  });

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const handleSavePrompt = () => {
    if (!guildId) return;
    updateGuildMutation.mutate({ system_prompt: systemPrompt });
  };

  const handleSaveEmbedColor = () => {
    if (!guildId) return;
    if (!/^#[0-9A-Fa-f]{6}$/.test(embedColor)) {
      setToast({
        type: 'error',
        message: 'Please enter a valid hex color (e.g. #1ab7ef).',
      });
      return;
    }
    updateGuildMutation.mutate({ embed_color: embedColor });
  };

  const openCreateModal = () => {
    setModalMode('create');
    setEditingEntry(null);
    setModalOpen(true);
  };

  const openEditModal = (entry: KnowledgeEntry) => {
    setModalMode('edit');
    setEditingEntry(entry);
    setModalOpen(true);
  };

  const handleSubmitKnowledge = async (data: { title: string; content: string }) => {
    if (!guildId) return;
    if (modalMode === 'create') {
      await createKnowledgeMutation.mutateAsync(data);
    } else if (editingEntry) {
      await updateKnowledgeMutation.mutateAsync({
        id: editingEntry.id,
        ...data,
      });
    }
  };

  const handleDeleteKnowledge = (entry: KnowledgeEntry) => {
    const ok = window.confirm(
      `Delete knowledge entry "${entry.title}"? This cannot be undone.`,
    );
    if (!ok) return;
    deleteKnowledgeMutation.mutate(entry.id);
  };

  const totalChars = knowledge?.reduce((sum, entry) => sum + entryChars(entry), 0) ?? 0;
  const planKey = (guild?.plan ?? 'free').toString().toLowerCase();
  const maxChars = PLAN_CHAR_LIMITS[planKey] ?? PLAN_CHAR_LIMITS.free;
  const usageRatio = Math.min(totalChars / maxChars, 1);
  const showUpgradeBanner = totalChars >= maxChars;
  const planLabel =
    planKey === 'pro' ? 'Pro' : planKey === 'business' ? 'Business' : 'Free';

  const isProOrBusiness =
    !!guild && ['pro', 'business'].includes((guild.plan ?? 'free').toLowerCase());

  const chartData = usage ? mockDailyTokenData(usage.monthly_tokens_used) : [];
  const recentActivity = mockRecentActivity();

  return {
    guildId,
    view,
    guild,
    guildLoading,
    guildError: !!guildError,
    usage,
    usageLoading,
    knowledge,
    knowledgeLoading,
    knowledgeError: !!knowledgeError,
    systemPrompt,
    setSystemPrompt,
    tone,
    setTone,
    previewOpen,
    setPreviewOpen,
    testReply,
    setTestReply: (value) => setTestReply(value),
    embedColor,
    setEmbedColor,
    toast,
    setToast,
    modalOpen,
    setModalOpen,
    modalMode,
    setModalMode,
    editingEntry,
    setEditingEntry,
    handleSavePrompt,
    handleSaveEmbedColor,
    openCreateModal,
    openEditModal,
    handleSubmitKnowledge,
    handleDeleteKnowledge,
    createKnowledgePending: createKnowledgeMutation.isPending,
    updateKnowledgePending: updateKnowledgeMutation.isPending,
    deleteKnowledgePending: deleteKnowledgeMutation.isPending,
    updateGuildPending: updateGuildMutation.isPending,
    totalChars,
    maxChars,
    usageRatio,
    showUpgradeBanner,
    planLabel,
    isProOrBusiness,
    chartData,
    recentActivity,
  };
};


