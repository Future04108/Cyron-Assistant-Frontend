import { motion } from 'framer-motion';
import { FaQuestionCircle } from 'react-icons/fa';

export const FaqSection = () => {
  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
            Frequently asked questions
          </h2>
          <p className="mt-3 text-base text-slate-600 max-w-2xl mx-auto">
            Answers to a few things people usually ask before connecting Cyron Assistant to their Discord
            server.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <motion.div
            className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm"
            initial={{ opacity: 0, x: -48 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.48, ease: 'easeOut', delay: 0.06 }}
          >
            <p className="mb-2 flex items-center font-semibold text-slate-900">
              <FaQuestionCircle className="mr-2 text-sky-500" />
              Do I need to change how my tickets work today?
            </p>
            <p className="text-slate-600">
              No. Cyron Assistant sits on top of your existing channels and ticket flows. You decide
              which channels it can answer in and when to escalate to staff.
            </p>
          </motion.div>

          <motion.div
            className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm"
            initial={{ opacity: 0, x: -48 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.48, ease: 'easeOut', delay: 0.02 }}
          >
            <p className="mb-2 flex items-center font-semibold text-slate-900">
              <FaQuestionCircle className="mr-2 text-sky-500" />
              How does the bot learn our knowledge base?
            </p>
            <p className="text-slate-600">
              You can sync docs, FAQs, and canned replies from the dashboard. The bot only answers from
              that approved knowledge-no random internet browsing.
            </p>
          </motion.div>

          <motion.div
            className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm"
            initial={{ opacity: 0, x: 48 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.48, ease: 'easeOut', delay: 0.02 }}
          >
            <p className="mb-2 flex items-center font-semibold text-slate-900">
              <FaQuestionCircle className="mr-2 text-sky-500" />
              Can we limit how many AI replies we use per month?
            </p>
            <p className="text-slate-600">
              Yes. Plans include clear token and ticket limits, and you can configure per‑server caps so
              usage never surprises your team.
            </p>
          </motion.div>

          <motion.div
            className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm"
            initial={{ opacity: 0, x: 48 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.48, ease: 'easeOut', delay: 0.06 }}
          >
            <p className="mb-2 flex items-center font-semibold text-slate-900">
              <FaQuestionCircle className="mr-2 text-sky-500" />
              What happens if we remove the bot from Discord?
            </p>
            <p className="text-slate-600">
              The dashboard will stop sending AI replies, but your existing ticket channels continue
              working as normal with human staff only.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};


