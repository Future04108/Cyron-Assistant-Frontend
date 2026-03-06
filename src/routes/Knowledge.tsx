import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../lib/api';
import { Button } from '../components/ui/Button';
import { Loader } from '../components/ui/Loader';
import { KnowledgeModal } from '../components/KnowledgeModal';

interface KnowledgeEntry {
  id: string;
  guild_id: number;
  title: string;
  content: string;
  created_at: string;
}

interface Guild {
  id: string | number;
  name: string;
  plan?: 'free' | 'pro' | 'business' | string;
}

const PLAN_CHAR_LIMITS: Record<string, number> = {
  free: 20000,
  pro: 50000,
  business: 100000,
};

async function fetchGuild(guildId: string): Promise<Guild> {
  const res = await api.get<Guild>(`/guilds/${guildId}`);
  return res.data;
}

async function fetchKnowledge(guildId: string): Promise<KnowledgeEntry[]> {
  const res = await api.get<KnowledgeEntry[]>(`/guilds/${guildId}/knowledge`);
  return res.data;
}

const entryChars = (entry: KnowledgeEntry) =>
  (entry.title?.length ?? 0) + (entry.content?.length ?? 0);

export const Knowledge = () => {
  const params = useParams<{ guildId?: string }>();
  const guildId = params.guildId;
  const queryClient = useQueryClient();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingEntry, setEditingEntry] = useState<KnowledgeEntry | null>(null);
  const [toast, setToast] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const {
    data: guild,
    isLoading: guildLoading,
    isError: guildError,
  } = useQuery({
    queryKey: ['guild', guildId],
    queryFn: () => fetchGuild(guildId as string),
    enabled: !!guildId,
  });

  const {
    data: knowledge,
    isLoading: knowledgeLoading,
    isError: knowledgeError,
  } = useQuery({
    queryKey: ['knowledge', guildId],
    queryFn: () => fetchKnowledge(guildId as string),
    enabled: !!guildId,
  });

  const totalChars =
    knowledge?.reduce((sum, entry) => sum + entryChars(entry), 0) ?? 0;

  const planKey = (guild?.plan ?? 'free').toString().toLowerCase();
  const maxChars = PLAN_CHAR_LIMITS[planKey] ?? PLAN_CHAR_LIMITS.free;
  const usageRatio = Math.min(totalChars / maxChars, 1);

  const createMutation = useMutation({
    mutationFn: (payload: { title: string; content: string }) =>
      api.post(`/guilds/${guildId}/knowledge`, payload),
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

  const updateMutation = useMutation({
    mutationFn: (payload: { id: string; title: string; content: string }) =>
      api.put(`/guilds/${guildId}/knowledge/${payload.id}`, {
        title: payload.title,
        content: payload.content,
      }),
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

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      api.delete(`/guilds/${guildId}/knowledge/${id}`),
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

  const handleSubmitModal = async (data: { title: string; content: string }) => {
    if (!guildId) return;
    if (modalMode === 'create') {
      await createMutation.mutateAsync(data);
    } else if (editingEntry) {
      await updateMutation.mutateAsync({
        id: editingEntry.id,
        ...data,
      });
    }
  };

  const handleDelete = (entry: KnowledgeEntry) => {
    // Simple confirmation for now
    const ok = window.confirm(
      `Delete knowledge entry "${entry.title}"? This cannot be undone.`,
    );
    if (!ok) return;
    deleteMutation.mutate(entry.id);
  };

  const isLoading = guildLoading || knowledgeLoading;
  const hasError = guildError || knowledgeError;

  const showUpgradeBanner = totalChars >= maxChars;

  const planLabel =
    planKey === 'pro'
      ? 'Pro'
      : planKey === 'business'
        ? 'Business'
        : 'Free';

  if (!guildId) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="space-y-4"
      >
        <div className="flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-primary/5 via-white to-purple-50 px-6 py-12 text-center shadow-soft">
          <div className="mb-6 h-20 w-20 rounded-full bg-primary/10">
            <div className="h-full w-full rounded-full bg-[radial-gradient(circle_at_30%_20%,#1ab7ef,transparent_60%),radial-gradient(circle_at_70%_80%,#6366f1,transparent_55%)] opacity-80" />
          </div>
          <h2 className="text-lg font-semibold tracking-tight">
            Select a server to manage knowledge
          </h2>
          <p className="mt-2 max-w-md text-sm text-text-muted">
            Choose one of your Discord servers from the left to edit the
            knowledge base that powers Cyron Assistant.
          </p>
        </div>
      </motion.section>
    );
  }

  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="space-y-4"
      >
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Knowledge</h2>
            <p className="text-sm text-text-muted">
              Manage knowledge entries that power Cyron Assistant for this
              server.
            </p>
            {guild && (
              <p className="mt-1 text-xs text-text-muted">
                <span className="font-medium">{guild.name}</span> ·{' '}
                <span className="capitalize">{planLabel} plan</span>
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isLoading && <Loader />}
            <Button onClick={openCreateModal} disabled={isLoading}>
              Add New Entry
            </Button>
          </div>
        </header>

        {/* Usage progress */}
        <div className="rounded-xl bg-white p-4 shadow-soft">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-slate-700">
              Knowledge capacity
            </span>
            <span
              className={`font-mono ${
                usageRatio > 0.8 ? 'text-amber-500' : 'text-text-muted'
              }`}
            >
              {totalChars.toLocaleString()} / {maxChars.toLocaleString()} chars
            </span>
          </div>
          <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${usageRatio * 100}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className={`h-full rounded-full bg-primary ${
                usageRatio > 0.8
                  ? 'bg-gradient-to-r from-amber-400 via-primary to-red-500'
                  : ''
              }`}
            />
          </div>
          <p className="mt-2 text-[11px] text-text-muted">
            Entries are limited per plan. Longer documents are chunked
            automatically but still count towards your total character budget.
          </p>
        </div>

        {/* Upgrade banner */}
        {showUpgradeBanner && (
          <div className="flex flex-col justify-between gap-3 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-xs text-slate-800 shadow-soft sm:flex-row sm:items-center">
            <div>
              <p className="font-semibold">
                You&apos;ve reached your knowledge capacity for the{' '}
                {planLabel} plan.
              </p>
              <p className="mt-1 text-[11px] text-text-muted">
                Upgrade your plan to increase the total character limit and add
                more documentation for Cyron Assistant.
              </p>
            </div>
            <Button
              type="button"
              className="w-full px-4 py-2 text-xs sm:w-auto"
              onClick={() => {
                // Placeholder: future billing / upgrade flow
              }}
            >
              Upgrade plan
            </Button>
          </div>
        )}

        {/* List */}
        <div className="rounded-xl bg-white p-4 shadow-soft">
          {hasError && !isLoading && (
            <p className="text-sm text-red-500">
              Failed to load knowledge entries. Please refresh the page.
            </p>
          )}
          {!isLoading && !hasError && knowledge && knowledge.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
              <h3 className="text-sm font-semibold">
                No knowledge entries yet
              </h3>
              <p className="max-w-sm text-xs text-text-muted">
                Add your first entry to teach Cyron Assistant about your
                support hours, policies, onboarding steps, and more.
              </p>
              <Button onClick={openCreateModal} className="px-4 py-2 text-xs">
                Add your first entry
              </Button>
            </div>
          )}

          {!isLoading && !hasError && knowledge && knowledge.length > 0 && (
            <div className="space-y-2">
              <div className="hidden grid-cols-[2fr,3fr,100px,150px,120px] gap-3 px-2 pb-1 text-[11px] font-medium text-slate-500 md:grid">
                <span>Title</span>
                <span>Preview</span>
                <span className="text-right">Chars</span>
                <span>Created</span>
                <span className="text-right">Actions</span>
              </div>
              <div className="space-y-2">
                {knowledge.map((entry) => {
                  const chars = entryChars(entry);
                  const preview =
                    entry.content.length > 160
                      ? `${entry.content.slice(0, 160)}…`
                      : entry.content;

                  return (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{
                        y: -1,
                        boxShadow: '0 10px 30px rgba(15,23,42,0.08)',
                      }}
                      className="rounded-lg border border-slate-100 bg-white px-3 py-3 text-xs transition-colors md:grid md:grid-cols-[2fr,3fr,100px,150px,120px] md:items-center md:gap-3"
                    >
                      <div className="mb-2 md:mb-0">
                        <p className="font-semibold text-slate-800">
                          {entry.title || 'Untitled'}
                        </p>
                      </div>
                      <div className="mb-2 text-[11px] text-text-muted md:mb-0">
                        {preview || <span className="italic">No content</span>}
                      </div>
                      <div className="mb-2 text-right font-mono text-[11px] text-slate-700 md:mb-0">
                        {chars.toLocaleString()}
                      </div>
                      <div className="mb-2 text-[11px] text-text-muted md:mb-0">
                        {new Date(entry.created_at).toLocaleString()}
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          className="px-2 py-1 text-[11px]"
                          onClick={() => openEditModal(entry)}
                        >
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          className="px-2 py-1 text-[11px] text-red-500 hover:bg-red-50"
                          onClick={() => handleDelete(entry)}
                          disabled={deleteMutation.isPending}
                        >
                          Delete
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </motion.section>

      {/* Modal */}
      <KnowledgeModal
        isOpen={modalOpen}
        mode={modalMode}
        initialTitle={editingEntry?.title ?? ''}
        initialContent={editingEntry?.content ?? ''}
        onClose={() => {
          if (createMutation.isPending || updateMutation.isPending) return;
          setModalOpen(false);
          setEditingEntry(null);
        }}
        onSubmit={handleSubmitModal}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.2 }}
            className={`fixed bottom-4 right-4 z-50 rounded-lg px-4 py-2 text-xs shadow-lg ${
              toast.type === 'success'
                ? 'bg-slate-900 text-white'
                : 'bg-red-600 text-white'
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

