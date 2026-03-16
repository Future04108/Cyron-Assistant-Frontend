import { motion } from 'framer-motion';
import { FaChartBar, FaRobot, FaSlidersH } from 'react-icons/fa';

export const FeaturesSection = () => {
  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10 text-center">
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
            Everything you need to support your community
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Powerful tools for server owners, support teams, and communities of any size.
          </p>
        </div>
        <motion.div
          className="grid gap-6 md:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12 } },
          }}
        >
          <motion.div
            className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
            variants={{
              hidden: { opacity: 0, y: 32 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.48, ease: 'easeOut' }}
            whileInView="visible"
            initial="hidden"
            viewport={{ once: true, amount: 0.4 }}
          >
            <h3 className="flex items-center text-sm font-semibold text-sky-600">
              <FaRobot className="mr-2" />
              AI‑powered ticket replies
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Automatically answer repetitive questions with responses based on your own documentation,
              FAQ, and previous tickets.
            </p>
          </motion.div>

          <motion.div
            className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
            variants={{
              hidden: { opacity: 0, y: 32 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.48, ease: 'easeOut' }}
            whileInView="visible"
            initial="hidden"
            viewport={{ once: true, amount: 0.4 }}
          >
            <h3 className="flex items-center text-sm font-semibold text-emerald-600">
              <FaSlidersH className="mr-2" />
              Fine‑grained control
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Configure channels, categories, rate limits, and escalation rules per server so the bot fits
              your existing workflows.
            </p>
          </motion.div>

          <motion.div
            className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
            variants={{
              hidden: { opacity: 0, y: 32 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.48, ease: 'easeOut' }}
            whileInView="visible"
            initial="hidden"
            viewport={{ once: true, amount: 0.4 }}
          >
            <h3 className="flex items-center text-sm font-semibold text-indigo-600">
              <FaChartBar className="mr-2" />
              Insightful usage dashboard
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Track tickets, token usage, and AI sessions so you always know how much value the bot is
              delivering.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};


