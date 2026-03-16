import { AnimatePresence, motion } from "framer-motion";

export const ToastAlert = ({ toast }: { toast: { type: string; message: string } | null }) => {
    return (
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className={`fixed bottom-4 right-4 z-50 rounded-lg px-4 py-2 text-xs shadow-lg ${
              toast.type === 'success' ? 'bg-slate-900 text-white' : 'bg-red-600 text-white'
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }