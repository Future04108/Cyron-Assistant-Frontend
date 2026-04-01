import { motion } from "framer-motion"
import { Loader } from '../../components/ui/Loader';
import { Button } from '../../components/ui/Button';

const entryChars = (entry: KnowledgeEntry) =>
    (entry.title?.length ?? 0) +
    (entry.main_content?.length ?? entry.content?.length ?? 0) +
    (entry.additional_context?.length ?? 0) +
    (entry.behavior_notes?.length ?? 0);

export const KnowledgeTab = ({
    knowledge,
    knowledgeLoading,
    knowledgeError,
    openCreateModal,
    openEditModal,
    handleDeleteKnowledge,
    deleteKnowledgePending,
    totalChars,
    maxChars,
    usageRatio,
    showUpgradeBanner,
    planLabel,
}: {
    knowledge: KnowledgeEntry[] | undefined;
    knowledgeLoading: boolean;
    knowledgeError: boolean;
    openCreateModal: () => void;
    openEditModal: (entry: KnowledgeEntry) => void;
    handleDeleteKnowledge: (entry: KnowledgeEntry) => void;
    deleteKnowledgePending: boolean;
    totalChars: number;
    maxChars: number;
    usageRatio: number;
    showUpgradeBanner: boolean;
    planLabel: string;
}) => {
    return (
        <motion.div
            key="knowledge"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
        >
            {/* Knowledge capacity bar + primary action */}
            <motion.div
                whileHover={{ y: -1 }}
                className="rounded-xl bg-white p-4 shadow-soft"
            >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-xs">
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-700">Knowledge capacity</span>
                        {knowledgeLoading && <Loader />}
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4">
                        <span
                            className={`font-mono ${usageRatio > 0.8 ? 'text-amber-500' : 'text-text-muted'
                                }`}
                        >
                            {totalChars.toLocaleString()} / {maxChars.toLocaleString()} chars
                        </span>
                        <Button
                            onClick={openCreateModal}
                            disabled={knowledgeLoading}
                            className="px-4 py-2 text-xs"
                        >
                            Add New Entry
                        </Button>
                    </div>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${usageRatio * 100}%` }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className={`h-full rounded-full bg-primary ${usageRatio > 0.8
                                ? 'bg-gradient-to-r from-amber-400 via-primary to-red-500'
                                : ''
                            }`}
                    />
                </div>
                <p className="mt-2 text-[11px] text-text-muted">
                    Entries are limited per plan. Longer documents are chunked
                    automatically but still count towards your total character budget.
                </p>
            </motion.div>

            {/* Upgrade banner */}
            {showUpgradeBanner && (
                <div className="flex flex-col justify-between gap-3 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-xs text-slate-800 shadow-soft sm:flex-row sm:items-center">
                    <div>
                        <p className="font-semibold">
                            You&apos;ve reached your knowledge capacity for the {planLabel} plan.
                        </p>
                        <p className="mt-1 text-[11px] text-text-muted">
                            Upgrade your plan to increase the total character limit and add
                            more documentation for Cyron Assistant.
                        </p>
                    </div>
                    <Button
                        type="button"
                        className="w-full px-4 py-2 text-xs sm:w-auto"
                        onClick={() => { }}
                    >
                        Upgrade plan
                    </Button>
                </div>
            )}

            <div className="rounded-xl bg-white p-4 shadow-soft">
                {knowledgeLoading && (
                    <div className="space-y-2">
                        {[...Array(3)].map((_, idx) => (
                            <div
                                key={idx}
                                className="h-14 animate-pulse rounded-lg bg-slate-100/80"
                            />
                        ))}
                    </div>
                )}
                {knowledgeError && !knowledgeLoading && (
                    <p className="text-sm text-red-500">
                        Failed to load knowledge entries. Please refresh the page.
                    </p>
                )}
                {!knowledgeLoading && !knowledgeError && knowledge && knowledge.length === 0 && (
                    <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
                        <h3 className="text-sm font-semibold">No knowledge entries yet</h3>
                        <p className="max-w-sm text-xs text-text-muted">
                            Add your first entry to teach Cyron Assistant about your
                            support hours, policies, onboarding steps, and more.
                        </p>
                        <Button onClick={openCreateModal} className="px-4 py-2 text-xs">
                            Add your first entry
                        </Button>
                    </div>
                )}

                {!knowledgeLoading && !knowledgeError && knowledge && knowledge.length > 0 && (
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
                                const mainContent = entry.main_content ?? entry.content;
                                const preview =
                                    (mainContent?.length ?? 0) > 160
                                        ? `${mainContent?.slice(0, 160)}…`
                                        : mainContent;
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
                                                onClick={() => handleDeleteKnowledge(entry)}
                                                disabled={deleteKnowledgePending}
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
        </motion.div>
    );
}