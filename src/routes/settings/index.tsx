import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { KnowledgeModal } from '../../components/KnowledgeModal';
import { useSettings } from '../../hooks/useSettings';

import { KnowledgeTab } from './KnowledgeTab';
import { AiSettingsTab } from './AiSettingsTab';
import { EmbedSettingsTab } from './EmbedSettingsTab';
import { UsageTab } from './UsageSettingsTab';
import { SystemPromptPreviewModal } from './SystemPromptPreviewModal';
import { ToastAlert } from './ToastAlert';

const TAB_TITLES: Record<string, string> = {
  ai: 'AI Settings',
  knowledge: 'Knowledge Base',
  embed: 'Embed Customization',
  usage: 'Usage Analytics',
};

const TAB_DESCRIPTIONS: Record<string, string> = {
  ai: 'Configure Cyron Assistant\'s default behavior with a custom system prompt and tone.',
  knowledge: 'Manage knowledge entries to teach Cyron Assistant about your products, policies, and workflows.',
  embed: 'Customize the color and appearance of support ticket embeds for your server.',
  usage: 'View recent AI activity, usage, and plan statistics for your server.',
};

export const Settings = () => {
  const [localTone, setLocalTone] = useState<Tone>('Professional');
  const {
    guildId,
    view,
    guild,
    guildLoading,
    guildError,
    usage,
    usageLoading,
    knowledge,
    knowledgeLoading,
    knowledgeError,
    systemPrompt,
    setSystemPrompt,
    previewOpen,
    setPreviewOpen,
    testReply,
    setTestReply,
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
    createKnowledgePending,
    updateKnowledgePending,
    deleteKnowledgePending,
    updateGuildPending,
    totalChars,
    maxChars,
    usageRatio,
    showUpgradeBanner,
    planLabel,
    isProOrBusiness,
    chartData,
    recentActivity,
  } = useSettings();

  if (!guildId) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-primary/5 via-white to-purple-50 px-6 py-12 text-center shadow-soft"
      >
        <h2 className="text-lg font-semibold tracking-tight">Select a server</h2>
        <p className="mt-2 max-w-md text-sm text-text-muted">
          Choose a server from the sidebar to manage AI settings, embed color, and usage.
        </p>
      </motion.section>
    );
  }

  if (guildError || (!guildLoading && !guild)) {
    return (
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-xl bg-white p-6 shadow-soft"
      >
        <p className="text-sm text-red-500">Failed to load guild. Please refresh the page.</p>
      </motion.section>
    );
  }

  const headerTitle = TAB_TITLES[view] || 'Settings';
  const headerDescription =
    TAB_DESCRIPTIONS[view] ||
    'Configure AI behavior, manage knowledge base, customize embeds, and view usage for this server.';

  return (
    <>
      <div className="flex items-center gap-2 mb-2">
        <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 border border-slate-200">
          JOB&nbsp;·&nbsp;free plan
        </span>
      </div>
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="space-y-6"
      >
        <header>
          <h2 className="text-lg font-semibold tracking-tight">{headerTitle}</h2>
          <p className="text-sm text-text-muted">{headerDescription}</p>
        </header>

        <AnimatePresence mode="wait">
          {view === 'ai' && (
            <AiSettingsTab
              systemPrompt={systemPrompt}
              setSystemPrompt={setSystemPrompt}
              previewOpen={previewOpen}
              setPreviewOpen={setPreviewOpen}
              handleSavePrompt={handleSavePrompt}
              updateGuildPending={updateGuildPending}
              guildLoading={guildLoading}
              localTone={localTone}
              setLocalTone={setLocalTone}
              testReply={testReply}
              setTestReply={setTestReply}
            />
          )}

          {view === 'embed' && (
            <EmbedSettingsTab
              embedColor={embedColor}
              setEmbedColor={setEmbedColor}
              isProOrBusiness={isProOrBusiness}
              updateGuildPending={updateGuildPending}
              guildLoading={guildLoading}
              handleSaveEmbedColor={handleSaveEmbedColor}
            />
          )}

          {view === 'usage' && (
            <UsageTab
              usage={usage}
              usageLoading={usageLoading}
              chartData={chartData}
              recentActivity={recentActivity}
            />
          )}

          {view === 'knowledge' && (
            <KnowledgeTab
              knowledge={knowledge}
              knowledgeLoading={knowledgeLoading}
              knowledgeError={knowledgeError}
              openCreateModal={openCreateModal}
              openEditModal={openEditModal}
              handleDeleteKnowledge={handleDeleteKnowledge}
              deleteKnowledgePending={deleteKnowledgePending}
              totalChars={totalChars}
              maxChars={maxChars}
              usageRatio={usageRatio}
              showUpgradeBanner={showUpgradeBanner}
              planLabel={planLabel}
            />
          )}
        </AnimatePresence>
      </motion.section>

      <SystemPromptPreviewModal
        previewOpen={previewOpen}
        setPreviewOpen={setPreviewOpen}
        systemPrompt={systemPrompt}
      />

      <KnowledgeModal
        isOpen={modalOpen}
        mode={modalMode}
        initialTitle={editingEntry?.title ?? ''}
        initialContent={editingEntry?.content ?? ''}
        onClose={() => {
          if (createKnowledgePending || updateKnowledgePending) return;
          setModalOpen(false);
          setEditingEntry(null);
        }}
        onSubmit={handleSubmitKnowledge}
        isSubmitting={createKnowledgePending || updateKnowledgePending}
      />

      <ToastAlert toast={toast} />
    </>
  );
};
