import { Link, useLocation, useParams } from 'react-router-dom';
import {
  FaBook,
  FaRobot,
  FaPalette,
  FaChartLine,
  FaServer,
} from 'react-icons/fa';

type Tab = {
  id: string;
  label: string;
  to: (id: string) => string;
  icon: React.ReactNode;
};

type Section = {
  id: string;
  label: string;
  tabs: Tab[];
};

const sections: Section[] = [
  {
    id: 'management',
    label: 'Management',
    tabs: [
      {
        id: 'knowledge',
        label: 'Knowledge',
        to: (id: string) => `/guilds/${id}/knowledge`,
        icon: <FaBook className="mr-2 w-4 h-4" />,
      },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    tabs: [
      {
        id: 'ai-settings',
        label: 'AI Settings',
        to: (id: string) => `/guilds/${id}/settings`,
        icon: <FaRobot className="mr-2 w-4 h-4" />,
      },
      {
        id: 'embed-customization',
        label: 'Embed Customization',
        to: (id: string) => `/guilds/${id}/embed-customization`,
        icon: <FaPalette className="mr-2 w-4 h-4" />,
      },
      {
        id: 'usage-analytics',
        label: 'Usage Analytics',
        to: (id: string) => `/guilds/${id}/usage-analytics`,
        icon: <FaChartLine className="mr-2 w-4 h-4" />,
      },
    ],
  }
];
type GuildSidebarNavProps = {
  guild?: Guild | null;
};

export const GuildSidebarNav = ({ guild }: GuildSidebarNavProps) => {
  const { guildId } = useParams<{ guildId?: string }>();
  const location = useLocation();

  if (!guildId) return null;

  const planLabel = (() => {
    const p = (guild?.plan ?? 'free').toLowerCase();
    if (p === 'business') return 'Business plan';
    if (p === 'pro') return 'Pro plan';
    return 'Free plan';
  })();

  return (
    <aside className="hidden w-64 min-h-[800px] flex-shrink-0 rounded-3xl border border-slate-200 bg-white/90 px-4 py-5 text-sm text-slate-800 shadow-sm md:block">
      <div className="mb-5 px-1">
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-slate-50 text-slate-600">
            <FaServer className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">
              {guild?.name ?? 'Server'}
            </p>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              {planLabel}
            </p>
          </div>
        </div>
      </div>
      <nav className="space-y-4">
        {sections.map((section) => (
          <div key={section.id}>
            <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              {section.label}
            </p>
            <div className="space-y-1">
              {section.tabs.map((tab) => {
                const target = tab.to(guildId);
                const isActive = location.pathname.startsWith(target);

                return (
                  <Link
                    key={tab.id}
                    to={target}
                    className={[
                      'flex items-center rounded-xl px-3 py-2 text-xs font-medium transition-colors',
                      isActive
                        ? 'bg-sky-50 text-sky-700 border border-sky-200'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                    ].join(' ')}
                  >
                    {tab.icon}
                    {tab.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
};