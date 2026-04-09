import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiSave } from 'react-icons/fi';
import { RichTextEditor, htmlToPlainText } from './RichTextEditor';

export type KnowledgeSubmitPayload = {
  title: string;
  source?: string;
  contentHtml: string;
  persistMode: 'pipeline' | 'structured';
  structured?: {
    main_content: string;
    template_type: string;
    template_payload?: Record<string, unknown> | null;
    additional_context?: string | null;
    behavior_notes?: string | null;
    content_markdown: string;
  };
};

type Props = {
  isOpen: boolean;
  mode: 'create' | 'edit';
  serverName: string;
  guildId: string | undefined;
  initialTitle?: string;
  initialSource?: string;
  initialContentHtml?: string;
  initialTemplateType?: string;
  onClose: () => void;
  onSubmit: (data: KnowledgeSubmitPayload) => Promise<void> | void;
  onAutoFormat: (args: {
    raw_text: string;
    template_type: string;
    title_hint: string;
  }) => Promise<KnowledgeFormatResult>;
  isSubmitting?: boolean;
};

const TEMPLATE_OPTIONS: { id: string; label: string; disabled?: boolean }[] = [
  { id: 'problem_solution', label: 'Problem / Solution' },
  { id: 'general_knowledge', label: 'General Knowledge' },
  { id: 'product_info', label: 'Product Info', disabled: true },
  { id: 'behavior_rule', label: 'Behavior Rule', disabled: true },
];

export const KnowledgeModal = ({
  isOpen,
  mode,
  serverName,
  guildId,
  initialTitle = '',
  initialSource = '',
  initialContentHtml = '',
  initialTemplateType = 'general_knowledge',
  onClose,
  onSubmit,
  onAutoFormat,
  isSubmitting = false,
}: Props) => {
  const [name, setName] = useState(initialTitle);
  const [source, setSource] = useState(initialSource);
  const [contentHtml, setContentHtml] = useState(initialContentHtml);
  const [structured, setStructured] = useState<KnowledgeSubmitPayload['structured'] | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('problem_solution');
  const [formatting, setFormatting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(initialTitle);
      setSource(initialSource);
      setContentHtml(initialContentHtml || '');
      setStructured(null);
      setPickerOpen(false);
      setSelectedTemplate(
        initialTemplateType === 'problem_solution' ? 'problem_solution' : 'problem_solution',
      );
    }
  }, [isOpen, initialTitle, initialSource, initialContentHtml, initialTemplateType]);

  const plainLen =
    name.length + source.length + htmlToPlainText(contentHtml).length;
  const overLimit = plainLen > 6000;

  const canSave =
    name.trim().length > 0 &&
    htmlToPlainText(contentHtml).trim().length > 0 &&
    !overLimit &&
    !isSubmitting;

  const handleAutoFormatClick = () => {
    const raw = htmlToPlainText(contentHtml).trim();
    if (!raw.length) return;
    setPickerOpen(true);
  };

  const runFormat = async () => {
    const raw = htmlToPlainText(contentHtml).trim();
    if (!raw.length || !guildId) return;
    setFormatting(true);
    try {
      const result = await onAutoFormat({
        raw_text: raw,
        template_type: selectedTemplate,
        title_hint: name.trim(),
      });
      setName(result.title || name);
      const md = result.content_markdown || result.main_content;
      const lines = md.split('\n').filter((l) => l.length > 0);
      const safeHtml =
        lines.length > 0
          ? lines.map((line) => `<p>${line.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`).join('')
          : `<p>${md.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`;
      setContentHtml(safeHtml);
      setStructured({
        main_content: result.main_content,
        template_type: result.template_type,
        template_payload: result.template_payload ?? null,
        additional_context: result.additional_context ?? null,
        behavior_notes: result.behavior_notes ?? null,
        content_markdown: result.content_markdown,
      });
      setPickerOpen(false);
    } finally {
      setFormatting(false);
    }
  };

  const handleSave = async () => {
    if (!canSave) return;
    const payload: KnowledgeSubmitPayload = {
      title: name.trim(),
      source: source.trim() || undefined,
      contentHtml,
      persistMode: structured ? 'structured' : 'pipeline',
      structured: structured ?? undefined,
    };
    await onSubmit(payload);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            if (!isSubmitting && !formatting) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            className="mx-4 flex max-h-[90vh] w-full max-w-xl flex-col rounded-2xl bg-zinc-900 shadow-2xl ring-1 ring-zinc-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 border-b border-zinc-800 px-6 py-4">
              <h3 className="text-lg font-semibold text-white">
                {mode === 'create' ? 'New Knowledge' : 'Edit Knowledge'}
              </h3>
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="rounded-full p-1 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
              >
                ✕
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                    Server
                  </label>
                  <div className="flex items-center border-b border-zinc-600 pb-1 text-sm text-white">
                    <span className="flex-1">{serverName || '—'}</span>
                    <span className="text-zinc-600">▾</span>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-[11px] text-zinc-400">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border-b border-zinc-600 bg-transparent py-1 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-zinc-400"
                    placeholder="Name"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[11px] text-zinc-400">Source</label>
                  <input
                    type="text"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="w-full border-b border-zinc-600 bg-transparent py-1 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-zinc-400"
                    placeholder="Optional"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[11px] text-zinc-400">Content</label>
                  <RichTextEditor
                    key={`${isOpen}-${mode}-${initialTitle}`}
                    value={contentHtml}
                    onChange={setContentHtml}
                    disabled={isSubmitting || formatting}
                    placeholder="Paste or write knowledge…"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 border-t border-zinc-800 px-6 py-4">
              <button
                type="button"
                onClick={handleSave}
                disabled={!canSave}
                className="inline-flex items-center gap-2 rounded-full bg-zinc-700 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-300 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FiSave className="h-3.5 w-3.5" />
                Save
              </button>
              <button
                type="button"
                onClick={handleAutoFormatClick}
                disabled={isSubmitting || formatting || htmlToPlainText(contentHtml).trim().length < 3}
                className="rounded-full border-2 border-emerald-500 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-emerald-400 hover:bg-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Auto format
              </button>
            </div>
          </motion.div>

          <AnimatePresence>
            {pickerOpen && (
              <motion.div
                className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => !formatting && setPickerOpen(false)}
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="mx-4 w-full max-w-sm rounded-xl bg-zinc-900 p-5 ring-1 ring-zinc-600"
                  onClick={(e) => e.stopPropagation()}
                >
                  <p className="mb-3 text-sm font-medium text-white">Choose template</p>
                  <div className="space-y-2">
                    {TEMPLATE_OPTIONS.map((t) => (
                      <label
                        key={t.id}
                        className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                          selectedTemplate === t.id
                            ? 'border-emerald-500 bg-emerald-500/10 text-white'
                            : 'border-zinc-700 text-zinc-300'
                        } ${t.disabled ? 'cursor-not-allowed opacity-50' : ''}`}
                      >
                        <input
                          type="radio"
                          name="tpl"
                          className="accent-emerald-500"
                          checked={selectedTemplate === t.id}
                          disabled={t.disabled}
                          onChange={() => setSelectedTemplate(t.id)}
                        />
                        {t.label}
                      </label>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      type="button"
                      className="rounded-lg px-3 py-1.5 text-xs text-zinc-400 hover:bg-zinc-800"
                      onClick={() => setPickerOpen(false)}
                      disabled={formatting}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
                      onClick={() => void runFormat()}
                      disabled={formatting}
                    >
                      {formatting ? 'Formatting…' : 'Apply'}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
