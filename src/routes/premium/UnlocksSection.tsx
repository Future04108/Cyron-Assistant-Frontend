import { motion } from 'framer-motion';
import { FaShieldAlt, FaGrinHearts, FaPalette } from 'react-icons/fa';

export const PremiumUnlocksSection = () => {
  return (
    <section className="border-b border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
            What Premium unlocks
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Beyond raw limits, Pro and Business plans add tools that make AI tickets trustworthy in a real
            support workflow.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <motion.div
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.18 }}
            transition={{ duration: 0.48, ease: 'easeOut', delay: 0.02 }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-600 flex items-center gap-2">
              <FaShieldAlt className="text-sky-600" /> Control
            </p>
            <p className="mt-2 text-sm text-slate-900">Guardrails that match your policies</p>
            <p className="mt-2 text-sm text-slate-600">
              Tune system prompts, tone, and escalation rules so the bot answers like a well‑trained staff
              member, and knows when to hand off to humans.
            </p>
          </motion.div>
          <motion.div
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.18 }}
            transition={{ duration: 0.48, ease: 'easeOut', delay: 0.13 }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600 flex items-center gap-2">
              <FaGrinHearts className="text-emerald-600" /> Clarity
            </p>
            <p className="mt-2 text-sm text-slate-900">Analytics your team actually uses</p>
            <p className="mt-2 text-sm text-slate-600">
              Track token usage, ticket volume, concurrency, and recent AI activity so you can spot
              spikes, abuse, or configuration issues early.
            </p>
          </motion.div>
          <motion.div
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.18 }}
            transition={{ duration: 0.48, ease: 'easeOut', delay: 0.24 }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600 flex items-center gap-2">
              <FaPalette className="text-indigo-600" /> Experience
            </p>
            <p className="mt-2 text-sm text-slate-900">A polished experience for members</p>
            <p className="mt-2 text-sm text-slate-600">
              Premium embeds, custom colors, and smarter ticket flows make your support area feel like
              part of your brand—not a generic bot.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};


