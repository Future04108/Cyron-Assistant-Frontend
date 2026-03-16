import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageTransition } from '../components/motion/PageTransition';

export const NotFound = () => {
  return (
    <PageTransition>
      <div className="flex min-h-screen items-center justify-center bg-bg-base px-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-soft"
        >
          <h1 className="text-2xl font-semibold">Page not found</h1>
          <p className="mt-2 text-sm text-text-muted">
            The page you are looking for doesn&apos;t exist or has been moved.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-soft transition hover:bg-primary/90"
          >
            Go to dashboard
          </Link>
        </motion.div>
      </div>
    </PageTransition>
  );
};

