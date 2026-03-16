import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import { FaCheck } from 'react-icons/fa';

const FREE_FEATURES = [
  'Core AI ticket replies',
  'Limited monthly tokens & tickets',
  'Basic knowledge base & canned replies',
  'Community support via Discord',
] as const;

const PRO_FEATURES = [
  '5-10× Free token & ticket limits',
  'Priority AI models & faster responses',
  'Customizable ticket embeds & branding',
  'Fine‑grained concurrency & rate limits',
  'Usage analytics with export‑ready charts',
  'Email support with 24-48h response',
] as const;

const BUSINESS_FEATURES = [
  'Custom token, ticket, and concurrency limits',
  'Dedicated onboarding & configuration with your team',
  'Priority incident response & uptime SLAs',
  'Advanced audit logs & compliance‑friendly controls',
  'Roadmap input & early access to new features',
  'Regular success check‑ins and optimization reviews',
] as const;

export const PricingPlans = () => {
  const { isAuthenticated, loginWithDiscord } = useAuth();

  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-12 text-center md:text-left md:gap-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-500">
              Premium plans
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
              Simple pricing for every Discord server
            </h2>
            <p className="mt-3 max-w-xl text-base text-slate-600">
              Start on Free, then upgrade to Pro or Business when your community, team, or product
              needs more consistent AI coverage.
            </p>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <motion.div
            className="relative flex flex-col justify-between rounded-3xl border border-slate-200 bg-slate-50 p-9 shadow-sm"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.05 }}
          >
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-700">
                Free
              </p>
              <div className="mt-4 flex items-end gap-2">
                <p className="mt-4 text-4xl font-semibold text-slate-900">$0</p>
                <p className="mt-1 text-sm text-slate-500"> / month</p>
              </div>
              <p className="mt-4 text-base text-slate-700">
                Perfect for getting started with basic ticket management and AI replies.
              </p>
              <ul className="mt-5 space-y-2.5 text-sm text-slate-700">
                {FREE_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center text-sky-600">
                      <FaCheck className="h-3.5 w-3.5" />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6">
              <Link
                to={isAuthenticated ? '/dashboard' : '#'}
                className="inline-flex w-full items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
                onClick={
                  isAuthenticated
                    ? undefined
                    : (e) => {
                        e.preventDefault();
                        loginWithDiscord();
                      }
                }
              >
                Get started free
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="relative flex flex-col justify-between rounded-3xl border border-sky-400 bg-sky-50 p-9 shadow-soft"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.17 }}
          >
            <div className="absolute right-5 top-5 rounded-full bg-sky-500/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">
              Most popular
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">
                Pro
              </p>
              <div className="mt-4 flex items-end gap-2">
                <p className="mt-4 text-4xl font-semibold text-slate-900">$9</p>
                <p className="mt-1 text-sm text-slate-600"> / month</p>
              </div>
              <p className="mt-4 text-base text-slate-800">
                For serious support teams that want reliable AI coverage with human oversight.
              </p>
              <ul className="mt-5 space-y-2.5 text-sm text-slate-800">
                {PRO_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center text-sky-600">
                      <FaCheck className="h-3.5 w-3.5" />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6">
              <Link
                to={isAuthenticated ? '/payment?plan=pro' : '#'}
                className="inline-flex w-full items-center justify-center rounded-full bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-sky-500/40 transition hover:bg-sky-600"
                onClick={
                  isAuthenticated
                    ? undefined
                    : (e) => {
                        e.preventDefault();
                        loginWithDiscord();
                      }
                }
              >
                Start Pro trial
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="relative flex flex-col justify-between rounded-3xl border border-emerald-300 bg-emerald-50 p-9 shadow-sm"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.29 }}
          >
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
                Business
              </p>
              <div className="mt-4 flex items-end gap-2">
                <p className="text-4xl font-semibold text-slate-900">$20</p>
                <p className="text-sm text-slate-600">custom pricing</p>
              </div>
              <p className="mt-4 text-base text-slate-800">
                For large communities, scaled support teams, and SaaS products that need guaranteed
                performance and closer partnership.
              </p>
              <ul className="mt-5 space-y-2.5 text-sm text-slate-800">
                {BUSINESS_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center text-sky-600">
                      <FaCheck className="h-3.5 w-3.5" />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6">
              <a
                href="mailto:support@example.com"
                className="inline-flex w-full items-center justify-center rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-500/40 transition hover:bg-emerald-600"
              >
                Contact sales
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};