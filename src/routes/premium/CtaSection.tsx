import { Link } from 'react-router-dom';
import { FaCogs, FaQuestionCircle } from 'react-icons/fa';

interface PremiumCtaSectionProps {
  isAuthenticated: boolean;
  loginWithDiscord: () => void;
}

export const PremiumCtaSection = ({
  isAuthenticated,
  loginWithDiscord,
}: PremiumCtaSectionProps) => {
  const primaryHref = isAuthenticated ? '/dashboard' : '#';

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="mt-10 flex flex-col items-center gap-3 text-center">
          <p className="text-sm text-slate-700">
            Ready to see how Cyron Assistant fits your server?
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to={primaryHref}
              className="inline-flex items-center justify-center rounded-full bg-sky-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-sky-500/40 transition hover:bg-sky-600"
              onClick={
                isAuthenticated
                  ? undefined
                  : (e) => {
                      e.preventDefault();
                      loginWithDiscord();
                    }
              }
            >
              <FaCogs className="mr-2" /> Create your dashboard
            </Link>
            <a
              href="mailto:support@example.com"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-100"
            >
              <FaQuestionCircle className="mr-2" /> Ask us anything
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};


