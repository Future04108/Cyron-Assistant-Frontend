import { useLocation, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const tabs = [
  { id: 'overview', label: 'Overview', to: (id: string) => `/guilds/${id}` },
  {
    id: 'knowledge',
    label: 'Knowledge',
    to: (id: string) => `/guilds/${id}/knowledge`,
  },
  {
    id: 'settings',
    label: 'Settings',
    to: (id: string) => `/guilds/${id}/settings`,
  },
];

export const GuildSubnav = () => {
  const { guildId } = useParams<{ guildId?: string }>();
  const location = useLocation();

  if (!guildId) return null;

  const basePath = `/guilds/${guildId}`;
  let activeId: string = 'overview';

  if (location.pathname.startsWith(`${basePath}/knowledge`)) {
    activeId = 'knowledge';
  } else if (location.pathname.startsWith(`${basePath}/settings`)) {
    activeId = 'settings';
  } else if (location.pathname === basePath) {
    activeId = 'overview';
  }

  return (
    <div className="border-b border-slate-200 bg-white/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4">
        <nav className="flex gap-2 py-2 text-xs font-medium text-slate-600">
          {tabs.map((tab) => {
            const isActive = tab.id === activeId;
            return (
              <Link
                key={tab.id}
                to={tab.to(guildId)}
                className="relative inline-flex items-center rounded-full px-3 py-1"
              >
                {isActive && (
                  <motion.span
                    layoutId="guildSubnav"
                    className="absolute inset-0 rounded-full bg-primary/10"
                    style={{backgroundColor : 'rgb(26 183 239 / 27%)'}}
                    transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

