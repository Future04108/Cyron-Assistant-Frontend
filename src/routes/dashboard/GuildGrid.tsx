import { Link } from 'react-router-dom';
import { FaCheckCircle, FaPlus, FaRobot, FaServer } from 'react-icons/fa';

interface GuildGridProps {
  guilds: Guild[];
  activeGuildId?: string;
  onAddBot: (guildId: string | number) => void;
}

export const DashboardGuildGrid = ({
  guilds,
  activeGuildId,
  onAddBot,
}: GuildGridProps) => {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {guilds.map((guild) => {
        const active = String(guild.id) === activeGuildId;
        return (
          <div
            key={guild.id}
            className={[
              'group rounded-2xl border bg-white p-5 shadow-sm transition',
              'hover:-translate-y-0.5 hover:shadow-md',
              active ? 'border-sky-200 ring-2 ring-sky-200/60' : 'border-slate-200',
            ].join(' ')}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-sm font-semibold text-slate-700">
                  {guild.icon_url ? (
                    <img
                      src={guild.icon_url}
                      alt={guild.name}
                      className="h-12 w-12 rounded-2xl object-cover"
                    />
                  ) : (
                    <FaServer className="text-lg text-slate-400" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900 flex items-center gap-1">
                    {guild.name}{' '}
                    {active && (
                      <FaCheckCircle className="ml-2 text-emerald-500 text-xs" />
                    )}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    {guild.plan && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold capitalize text-slate-700">
                        {guild.plan === 'pro' && (
                          <FaRobot className="text-[10px] text-sky-400" />
                        )}
                        {guild.plan === 'business' && (
                          <FaRobot className="text-[10px] text-violet-600" />
                        )}
                        {guild.plan === 'free' && (
                          <FaServer className="text-[10px] text-slate-400" />
                        )}
                        {guild.plan}
                      </span>
                    )}
                    {guild.has_bot ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                        <FaCheckCircle className="text-[10px] text-emerald-500" />
                        Bot installed
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4">
              {guild.has_bot ? (
                <Link
                  to={`/guilds/${guild.id}/settings`}
                  className="flex w-full items-center justify-center rounded-xl bg-sky-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-sky-700 gap-2"
                >
                  <FaRobot className="text-xs" />
                  Manage server
                </Link>
              ) : (
                <button
                  type="button"
                  className="flex w-full items-center justify-center rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 gap-2"
                  onClick={() => onAddBot(guild.id)}
                >
                  <FaPlus className="text-xs" />
                  Add bot
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};


