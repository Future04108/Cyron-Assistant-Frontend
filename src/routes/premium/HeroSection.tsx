import { motion } from 'framer-motion';
import {
  FaUsers,
  FaShieldAlt,
  FaSlidersH,
  FaLifeRing,
  FaCogs,
  FaUserShield,
} from 'react-icons/fa';

export const PremiumHeroSection = () => {
  return (
    <section className="border-b border-slate-200 bg-gradient-to-br from-sky-50 via-white to-sky-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-20 md:flex-row md:items-center">
        <div className="flex-1 space-y-5">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl md:text-5xl drop-shadow-md">
            Scale Discord support with
            <span className="bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500 bg-clip-text text-transparent">
              {' '}
              predictable AI costs
            </span>
            .
          </h1>
          <p className="max-w-xl text-sm text-slate-600 md:text-base">
            Cyron Assistant turns every ticket into a structured AI workflow. Premium plans unlock higher
            limits, faster responses, richer analytics, and controls that keep your staff in the loop.
          </p>
        </div>

        <div className="flex-1">
          <motion.div
            className="grid gap-5 rounded-3xl border border-sky-100 bg-white p-6 shadow-soft sm:grid-cols-2"
            initial={{ opacity: 0, scale: 0.87 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.48, ease: 'easeOut' }}
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 flex items-center gap-2">
                <FaUsers className="inline-block text-sky-500" /> Designed for
              </p>
              <p className="mt-2 text-lg font-semibold text-sky-600 flex items-center gap-2">
                <FaLifeRing className="inline-block" /> growing communities
              </p>
              <p className="mt-1 text-xs text-slate-600">
                From small premium Discords to large public servers with dedicated staff.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 flex items-center gap-2">
                <FaCogs className="inline-block text-indigo-500" /> Built‑in
              </p>
              <ul className="mt-2 space-y-1 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <FaShieldAlt className="text-sky-500" />
                  AI ticket replies with safety controls
                </li>
                <li className="flex items-center gap-2">
                  <FaSlidersH className="text-teal-600" />
                  Per‑server usage & concurrency limits
                </li>
                <li className="flex items-center gap-2">
                  <FaUserShield className="text-emerald-500" />
                  Team‑friendly escalation workflows
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};


