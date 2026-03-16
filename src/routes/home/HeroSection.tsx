import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBook, FaDiscord } from 'react-icons/fa';
import { PrimaryCtaButton } from '../../components/ui/PrimaryCtaButton';

interface HeroSectionProps {
  isAuthenticated: boolean;
  loginWithDiscord: () => void;
}

export const HeroSection = ({ isAuthenticated, loginWithDiscord }: HeroSectionProps) => {
  const primaryHref = isAuthenticated ? '/dashboard' : '#';
  const primaryLabel = isAuthenticated ? (
    <>Go to Dashboard</>
  ) : (
    <>
      <FaDiscord className="mr-2 -ml-1 inline-block" />
      Login with Discord
    </>
  );

  return (
    <section className="border-b border-slate-200 bg-gradient-to-br from-sky-50 via-white to-indigo-50">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-12 px-6 py-20 text-center md:flex-row md:items-center md:text-left">
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center rounded-full bg-sky-100 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700 drop-shadow-md">
            <FaDiscord className="mr-2" size={20} color="#5865F2" /> AI Ticket Bot for Discord
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl md:text-5xl drop-shadow-md">
            Turn Discord tickets into
            <span className="bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">
              {' '}
              instant, AI‑powered support
            </span>
            .
          </h1>
          <p className="max-w-xl text-sm text-slate-600 md:text-base">
            Cyron Assistant connects to your Discord server, understands your knowledge base, and helps
            you resolve tickets automatically while keeping full control over limits, behavior, and
            premium features.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-start">
            <PrimaryCtaButton
              to={primaryHref}
              wave
              onClick={
                isAuthenticated
                  ? undefined
                  : (e) => {
                      e.preventDefault();
                      loginWithDiscord();
                    }
              }
            >
              {primaryLabel}
            </PrimaryCtaButton>
            <Link
              to="/docs"
              className="inline-flex items-center justify-center rounded-[5px] border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
            >
              <FaBook className="mr-2" />
              Documentation
            </Link>
          </div>
          <p className="text-[11px] text-slate-500">
            No long setup. Invite the bot, pick channels, and start resolving tickets in minutes.
          </p>
        </div>
        <div className="flex-1">
          <motion.div
            className="mx-auto max-w-md rounded-3xl border border-sky-100 bg-white/80 p-4 shadow-xl shadow-sky-100"
            initial={{ opacity: 0, y: 32, scale: 0.87 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.48, ease: 'easeOut' }}
          >
            <div className="mb-3 flex items-center justify-between text-xs text-slate-500">
              <span>Preview</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium">
                Live dashboard
              </span>
            </div>
            <div className="h-40 rounded-2xl bg-gradient-to-br from-sky-50 via-white to-indigo-50 p-4 text-left text-xs text-slate-700">
              <p className="font-semibold text-slate-900 flex items-center">AI Ticket Bot in action</p>
              <p className="mt-2 leading-relaxed">
                <span className="flex items-center">
                  Auto‑respond to common questions using your knowledge base.
                </span>
                <br />
                <span className="flex items-center">
                  Escalate complex issues to human staff instantly.
                </span>
                <br />
                <span className="flex items-center">
                  Measure usage and stay in control with per‑server limits.
                </span>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};


