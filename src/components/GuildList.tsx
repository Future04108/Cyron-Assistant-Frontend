import { motion } from 'framer-motion';
import type { MouseEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation, useParams } from 'react-router-dom';
import { api } from '../lib/api';

interface Guild {
  id: string;
  name: string;
  icon_url?: string | null;
  plan?: 'free' | 'pro' | 'business' | string;
  has_bot?: boolean;
}

async function fetchGuilds(): Promise<Guild[]> {
  const res = await api.get<Guild[]>('/guilds');
  return res.data;
}

const BOT_INVITE_BASE_URL =
  import.meta.env.VITE_DISCORD_BOT_INVITE_URL ??
  'https://discord.com/oauth2/authorize?client_id=1473403672086970459&permissions=8&integration_type=0&scope=applications.commands+bot';

export const GuildList = () => {
  const { data: guilds, isLoading, isError } = useQuery({
    queryKey: ['guilds'],
    queryFn: fetchGuilds,
  });
  const location = useLocation();
  const params = useParams<{ guildId?: string }>();

  return (
    <div className="flex h-full flex-col px-3 py-4" style={{width: '100%'}}>
      <p className="mb-3 px-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted">
        Servers
      </p>

      <div className="flex-1 space-y-1 overflow-y-auto pr-1">
        {isLoading && (
          <p className="text-xs text-text-muted">Loading servers...</p>
        )}
        {isError && !isLoading && (
          <p className="text-xs text-red-500">
            Failed to load servers. Please retry.
          </p>
        )}
        {!isLoading &&
          !isError &&
          guilds?.map((guild, index) => {
            const basePathMatch = location.pathname.startsWith(
              `/guilds/${guild.id}`,
            );
            const rootSelected =
              !params.guildId && location.pathname === '/' && index === 0;
            const isActive = basePathMatch || rootSelected;

            const handleAddBot = (e: MouseEvent) => {
              e.preventDefault();
              e.stopPropagation();
              const url = `${BOT_INVITE_BASE_URL}&guild_id=${guild.id}&disable_guild_select=true`;
              window.open(url, '_blank', 'noopener,noreferrer');
            };

            return (
              <motion.button
                key={guild.id}
                type="button"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.04 }}
                style={{width: '100%' , textAlign: 'left'}}
              >
                <Link
                  to={`/guilds/${guild.id}`}
                  className={`flex items-center gap-3 rounded-lg px-2 py-2 text-xs transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary shadow-sm'
                      : 'text-text-muted hover:bg-slate-100/80 hover:text-text-primary'
                  }`}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
                    {guild.icon_url ? (
                      <img
                        src={guild.icon_url}
                        alt={guild.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      (guild.name[0] ?? '?').toUpperCase()
                    )}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <span className="truncate text-[11px] font-medium">
                      {guild.name}
                    </span>
                    {guild.plan && (
                      <span className="mt-0.5 inline-flex w-fit rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium capitalize text-slate-600">
                        {guild.plan}
                      </span>
                    )}
                  </div>
                  <div className="ml-1 flex items-center">
                    {guild.has_bot ? (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                        Bot installed
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleAddBot}
                        className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary hover:bg-primary/20"
                      >
                        Add bot to server
                      </button>
                    )}
                  </div>
                </Link>
              </motion.button>
            );
          })}
      </div>
    </div>
  );
};

