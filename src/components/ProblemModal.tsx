import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiSave } from 'react-icons/fi';

type Props = {
  isOpen: boolean;
  serverName: string;
  onClose: () => void;
  onSubmit: (data: { problem: string; solution: string }) => Promise<void> | void;
  isSubmitting?: boolean;
};

export const ProblemModal = ({
  isOpen,
  serverName,
  onClose,
  onSubmit,
  isSubmitting = false,
}: Props) => {
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');

  useEffect(() => {
    if (isOpen) {
      setProblem('');
      setSolution('');
    }
  }, [isOpen]);

  const canSave = problem.trim().length > 0 && solution.trim().length > 0;

  const handleSave = async () => {
    if (!canSave || isSubmitting) return;
    await onSubmit({ problem: problem.trim(), solution: solution.trim() });
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
            if (!isSubmitting) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.2 }}
            className="mx-4 w-full max-w-md rounded-2xl bg-zinc-900 p-6 shadow-2xl ring-1 ring-zinc-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between gap-3">
              <h3 className="text-lg font-semibold text-white">New Problem</h3>
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="rounded-full p-1 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="space-y-5">
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
                <input
                  type="text"
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  placeholder="Problem"
                  className="w-full border-b border-zinc-600 bg-transparent py-1 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-zinc-400"
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-medium text-emerald-400">Solution</label>
                <textarea
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                  placeholder=""
                  rows={5}
                  className="w-full border-b-2 border-emerald-500 bg-transparent py-1 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-emerald-400"
                />
              </div>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <button
                type="button"
                onClick={handleSave}
                disabled={!canSave || isSubmitting}
                className="inline-flex items-center gap-2 rounded-full bg-zinc-700 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-300 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FiSave className="h-3.5 w-3.5" />
                Save
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
