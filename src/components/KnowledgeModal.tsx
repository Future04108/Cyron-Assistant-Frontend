import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from './ui/Button';

interface KnowledgeModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  initialTitle?: string;
  initialContent?: string;
  onClose: () => void;
  onSubmit: (data: { title: string; content: string }) => Promise<void> | void;
  isSubmitting?: boolean;
}

export const KnowledgeModal = ({
  isOpen,
  mode,
  initialTitle = '',
  initialContent = '',
  onClose,
  onSubmit,
  isSubmitting = false,
}: KnowledgeModalProps) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);

  useEffect(() => {
    if (isOpen) {
      setTitle(initialTitle);
      setContent(initialContent);
    }
  }, [isOpen, initialTitle, initialContent]);

  const charCount = title.length + content.length;
  const nearLimit = charCount >= 5600 && charCount <= 6000;
  const overLimit = charCount > 6000;

  const counterClass = overLimit
    ? 'text-red-500'
    : nearLimit
      ? 'text-amber-500'
      : 'text-text-muted';

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim() || overLimit || isSubmitting) return;
    await onSubmit({ title: title.trim(), content: content.trim() });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold">
                  {mode === 'create' ? 'Add Knowledge Entry' : 'Edit Knowledge Entry'}
                </h3>
                <p className="mt-1 text-xs text-text-muted">
                  Provide a clear title and detailed content. Longer docs will be
                  chunked automatically by the backend.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-1 text-xs text-text-muted hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-primary/40 focus:bg-white focus:ring"
                  placeholder="e.g. Support hours, refund policy, onboarding guide"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Content
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[180px] w-full resize-y rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-primary/40 focus:bg-white focus:ring"
                  placeholder="Write the knowledge article content here. You can paste FAQs, guides, or policies."
                />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs">
              <span className={counterClass}>
                {charCount.toLocaleString()} / 6,000 characters
              </span>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-3 py-1 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={
                    isSubmitting || overLimit || !title.trim() || !content.trim()
                  }
                  className="px-4 py-1 text-xs"
                >
                  {isSubmitting
                    ? mode === 'create'
                      ? 'Creating...'
                      : 'Saving...'
                    : mode === 'create'
                      ? 'Create entry'
                      : 'Save changes'}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

