import { motion } from 'framer-motion';
import { FaQuestionCircle } from 'react-icons/fa';

export const PremiumFaqSection = () => {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
            Frequently asked questions
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            A few details about billing, limits, and how upgrading works.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <motion.div
            className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm"
            initial={{ opacity: 0, x: -48 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.48, ease: 'easeOut', delay: 0.1 }}
          >
            <p className="mb-2 flex items-center font-semibold text-slate-900">
              <FaQuestionCircle className="mr-2 text-sky-500" />
              Can I run Free on some servers and Pro on others?
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Yes. Plans are applied per Discord server. Many teams start with Free on side‑servers and
              upgrade only their main community once the team is comfortable.
            </p>
          </motion.div>
          <motion.div
            className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm"
            initial={{ opacity: 0, x: -48 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.48, ease: 'easeOut', delay: 0.04 }}
          >
            <p className="mb-2 flex items-center font-semibold text-slate-900">
              <FaQuestionCircle className="mr-2 text-sky-500" />
              What happens if I hit my monthly token or ticket limit?
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Cyron Assistant will gracefully fall back to human‑only tickets instead of failing mid‑
              conversation. You&apos;ll see clear warnings in the dashboard before limits are reached.
            </p>
          </motion.div>
          <motion.div
            className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm"
            initial={{ opacity: 0, x: 48 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.48, ease: 'easeOut', delay: 0.04 }}
          >
            <p className="mb-2 flex items-center font-semibold text-slate-900">
              <FaQuestionCircle className="mr-2 text-sky-500" />
              Can I cancel or downgrade at any time?
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Absolutely. You can switch between Free and Pro month‑to‑month, and Business plans are
              handled via invoice with clear terms.
            </p>
          </motion.div>
          <motion.div
            className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm"
            initial={{ opacity: 0, x: 48 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.48, ease: 'easeOut', delay: 0.1 }}
          >
            <p className="mb-2 flex items-center font-semibold text-slate-900">
              <FaQuestionCircle className="mr-2 text-sky-500" />
              How do you handle data and privacy?
            </p>
            <p className="mt-2 text-sm text-slate-600">
              We only store the minimum required ticket and knowledge data to operate the bot, and you can
              delete knowledge or logs at any time from your dashboard.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};


