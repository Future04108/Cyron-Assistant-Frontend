import { useApp } from '../../context/AppContext';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { FaSun, FaMoon } from 'react-icons/fa';

interface TopNavProps {
  currentGuildName?: string | null;
}

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Premium', to: '/premium' },
  { label: 'Docs', to: '/docs' },
  { label: 'Dashboard', to: '/dashboard' }
];

export const TopNav = ({ currentGuildName }: TopNavProps) => {
  const { user, isAuthenticated, loginWithDiscord, logout } = useAuth();
  const location = useLocation();
  const { theme, toggleTheme } = useApp();

  // Theme persistence + `html.dark` are handled globally by AppProvider.

  const initials = user?.username
    ? user.username
        .split(' ')
        .map((p) => p[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'U';

  return (
    <header
      className={clsx(
        'sticky top-0 z-10 px-4 py-3 backdrop-blur-lg border-b transition-colors',
        theme === 'dark'
          ? 'border-slate-800 bg-slate-900/80'
          : 'border-slate-200 bg-white/80'
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-[170px]">
          <Link to="/" className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary">
            <img
              src="/img/cyron-2.png"
              alt="Cyron Assistant"
              className="h-8 w-8"
              style={{ borderRadius: '50%' }}
            />
          </Link>
          <div className="leading-tight hidden sm:block">
            <h1 className="text-base font-semibold tracking-tight">
              Cyron Assistant
            </h1>
          </div>
        </div>
        <nav className="flex-1 flex justify-center">
          <div className="flex items-center gap-3">
            {NAV_LINKS.filter((link) =>
              link.label === 'Dashboard' ? isAuthenticated : true
            ).map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                className={clsx(
                  'px-4 py-2 rounded text-base font-semibold',
                  location.pathname === to
                    ? (theme === 'dark'
                        ? 'text-primary'
                        : 'bg-sky-100 text-primary')
                    : (
                        theme === 'dark'
                          ? 'text-slate-300 hover:text-sky-200'
                          : 'text-slate-600 hover:text-sky-900'
                      )
                )}
                style={{ letterSpacing: '.01em' }}
              >
                {label}
              </Link>
            ))}
          </div>
        </nav>
        <div className="flex items-center gap-4 min-w-[170px] justify-end">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle light/dark mode"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            {theme === 'light' ? (
              <FaSun className="h-4 w-4" aria-hidden="true" />
            ) : (
              <FaMoon className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-base font-semibold text-primary">
                  {user?.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.username}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </div>
                <div className="hidden text-right text-sm sm:flex">
                  <span className="font-medium">{user?.username ?? 'User'}</span>
                </div>
              </div>
              <button
                onClick={logout}
                className={clsx(
                  'px-4 py-2 rounded text-base font-semibold transition-colors',
                  theme === 'dark'
                    ? 'text-slate-300 hover:text-sky-200'
                    : 'text-slate-600 hover:bg-sky-100 hover:text-primary'
                )}
                style={{ letterSpacing: '.01em' }}
              >
                Logout
              </button>
            </>
          ) : (
            <Button
              onClick={(e) => {
                e.preventDefault?.();
                loginWithDiscord();
              }}
              className="rounded-[10px] bg-sky-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-sky-700"
            >
              Login with Discord
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
