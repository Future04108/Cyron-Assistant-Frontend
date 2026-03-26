import { AnimatePresence, motion } from "framer-motion";

import { Button } from "../../components/ui/Button";
import { useApp } from "../../context/AppContext";

export const SystemPromptPreviewModal = ({
    previewOpen, setPreviewOpen, systemPrompt,
  }: {
    previewOpen: boolean;
    setPreviewOpen: (b: boolean) => void;
    systemPrompt: string;
  }) => {
    const { theme } = useApp();
    const isDark = theme === 'dark';

    return (
      <AnimatePresence>
        {previewOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={() => setPreviewOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              onClick={(e) => e.stopPropagation()}
              className={
                [
                  "max-h-[80vh] w-full max-w-lg overflow-auto rounded-2xl p-6 shadow-xl",
                  isDark ? "bg-slate-900/95 border border-slate-700 text-slate-50" : "bg-white text-slate-900",
                ].join(" ")
              }
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-base font-semibold">
                  System prompt preview
                </h3>
                <button
                  type="button"
                  onClick={() => setPreviewOpen(false)}
                  className={
                    [
                      "rounded-full p-1",
                      isDark
                        ? "text-slate-400 hover:bg-slate-800"
                        : "text-text-muted hover:bg-slate-100",
                    ].join(" ")
                  }
                >
                  ✕
                </button>
              </div>
              <pre
                className={
                  [
                    "mt-3 whitespace-pre-wrap rounded-lg p-3 text-sm",
                    isDark
                      ? "bg-slate-900/80 text-slate-100 border border-slate-700"
                      : "bg-slate-50 text-slate-800",
                  ].join(" ")
                }
              >
                {systemPrompt || '(Empty)'}
              </pre>
              <Button type="button" variant="ghost" className="mt-4" onClick={() => setPreviewOpen(false)}>
                Close
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }