import { Link } from 'react-router-dom';
import { FaDiscord, FaPlus, FaRobot, FaServer, FaTicketAlt } from 'react-icons/fa';

interface HeaderSectionProps {
  selectedGuild: Guild | null;
  stats: { total: number; botInstalled: number };
  isLoading: boolean;
  onAddBot: (guildId: string | number) => void;
}

export const DashboardHeaderSection = ({
  selectedGuild,
  stats,
  isLoading,
  onAddBot,
}: HeaderSectionProps) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-sky-50 to-indigo-50 p-8 shadow-soft sm:p-10">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 flex items-center gap-2">
            <FaDiscord className="inline text-indigo-500" />
            Your Discord Servers
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Manage your Discord servers with AI Ticket Bot.
          </p>
        </div>

        {selectedGuild && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-600 flex items-center gap-1">
              <FaServer className="text-slate-400" />
              Selected:
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-900">
              <span className="h-2 w-2 rounded-full bg-sky-500" />
              {selectedGuild.name}
            </span>
            {selectedGuild.has_bot ? (
              <Link
                to={`/guilds/${selectedGuild.id}/settings`}
                className="rounded-full bg-sky-600 px-3 py-1 text-xs font-semibold text-white shadow-sm transition hover:bg-sky-700 flex items-center gap-2"
              >
                <FaRobot className="text-xs" />
                Manage Server
              </Link>
            ) : (
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                onClick={() => onAddBot(selectedGuild.id)}
              >
                <FaPlus className="text-xs" />
                Add bot
              </button>
            )}
          </div>
        )}
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <FaServer className="text-base text-slate-400" />
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 m-0">
              Total servers
            </p>
          </div>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {isLoading ? '—' : stats.total}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <FaRobot className="text-base text-slate-400" />
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 m-0">
              Bot installed
            </p>
          </div>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {isLoading ? '—' : stats.botInstalled}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <FaTicketAlt className="text-base text-slate-400 " />
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 m-0">
              Active tickets
            </p>
          </div>
          <p className="mt-2 text-3xl font-semibold text-slate-900">-</p>
        </div>
      </div>
    </div>
  );
};


