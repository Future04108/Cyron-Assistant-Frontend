import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';

interface TopNavProps {
  currentGuildName?: string | null;
}

export const TopNav = ({ currentGuildName }: TopNavProps) => {
  const { user, logout } = useAuth();

  const initials = user?.username
    ? user.username
        .split(' ')
        .map((p) => p[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'U';

  const guildLabel =
    currentGuildName && currentGuildName.trim().length > 0
      ? currentGuildName
      : 'Select a server to manage';

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 sm:flex">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-white shadow-sm">
              <img src="../public/img/cyron-2.png" alt="Cyron Assistant" className="h-8 w-8" style={{borderRadius: '50%'}} />
            </div>
            <div className="leading-tight">
              <h1 className="text-sm font-semibold tracking-tight">
                Cyron Assistant
              </h1>
              <p className="text-[11px] text-text-muted">
                Multi-tenant AI ticket bot dashboard
              </p>
            </div>
          </div>
          <div className="h-8 border-l border-slate-200 sm:block" />
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-text-primary">
              {guildLabel}
            </span>
            <span className="text-[11px] text-text-muted">
              Manage knowledge, usage and ticket settings.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
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
            <div className="hidden flex-col text-right text-xs sm:flex">
              <span className="font-medium">{user?.username ?? 'User'}</span>
              <span className="text-text-muted">logged in</span>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={logout}
            className="text-xs font-medium"
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

