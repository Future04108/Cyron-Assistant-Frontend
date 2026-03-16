import { motion } from 'framer-motion';
import { FaClock, FaRobot, FaServer, FaTicketAlt } from 'react-icons/fa';
import CountUp from '../../components/animation/countUp';

export const StatsSection = () => {
  return (
    <section className="border-b border-slate-200 bg-gradient-to-br from-sky-50 via-white to-indigo-50 text-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
            The best Discord ticket bot with AI‑powered support
          </h2>
          <p className="mt-3 text-base text-slate-600 max-w-3xl mx-auto">
            Looking for a reliable ticket bot for your Discord server? Cyron Assistant combines AI ticket
            replies, custom panels, and tight staff workflows so your members always get a fast, accurate
            response-even when your team is offline.
          </p>
        </div>

        <motion.div
          className="mt-10 grid gap-5 md:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.28 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.13 } },
          }}
        >
          <motion.div
            className="rounded-2xl border border-sky-200 bg-white px-5 py-6 shadow-lg text-center"
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          >
            <p className="flex items-center text-xs font-medium uppercase tracking-[0.18em] text-sky-600">
              <span className="mr-2">
                <FaServer />
              </span>
              Servers
            </p>
            <p className="mt-3 text-3xl font-semibold text-sky-600 drop-shadow">
              <CountUp end={2735} />
            </p>
            <p className="mt-1 text-[11px] text-sky-600">Discord servers using our bot</p>
          </motion.div>

          <motion.div
            className="rounded-2xl border border-cyan-200 bg-white px-5 py-6 shadow-lg text-center"
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          >
            <p className="flex items-center text-xs font-medium uppercase tracking-[0.18em] text-emerald-600">
              <span className="mr-2">
                <FaTicketAlt />
              </span>
              Tickets handled
            </p>
            <p className="mt-3 text-3xl font-semibold text-emerald-600 drop-shadow">
              <CountUp end={143769} />
            </p>
            <p className="mt-1 text-[11px] text-emerald-600">Tickets resolved automatically</p>
          </motion.div>

          <motion.div
            className="rounded-2xl border border-indigo-200 bg-white px-5 py-6 shadow-lg text-center"
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          >
            <p className="flex items-center text-xs font-medium uppercase tracking-[0.18em] text-indigo-600">
              <span className="mr-2">
                <FaRobot />
              </span>
              AI‑enabled servers
            </p>
            <p className="mt-3 text-3xl font-semibold text-indigo-600 drop-shadow">
              <CountUp end={253} />
            </p>
            <p className="mt-1 text-[11px] text-indigo-600">Servers with automation switched on</p>
          </motion.div>

          <motion.div
            className="rounded-2xl border border-amber-200 bg-white px-5 py-6 shadow-lg text-center"
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          >
            <p className="flex items-center text-xs font-medium uppercase tracking-[0.18em] text-amber-600">
              <span className="mr-2">
                <FaClock />
              </span>
              Avg response time
            </p>
            <p className="mt-3 text-3xl font-semibold text-amber-600 drop-shadow">
              <CountUp end={4} />s
            </p>
            <p className="mt-1 text-[11px] text-amber-700">Lightning‑fast AI ticket replies</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};


