import { FaSearch } from 'react-icons/fa';

interface FiltersSectionProps {
  query: string;
  filter: 'all' | 'installed' | 'uninstalled';
  onQueryChange: (value: string) => void;
  onFilterChange: (value: 'all' | 'installed' | 'uninstalled') => void;
  onReset: () => void;
}

export const DashboardFiltersSection = ({
  query,
  filter,
  onQueryChange,
  onFilterChange,
  onReset,
}: FiltersSectionProps) => {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
        <span className="text-slate-400">
          <FaSearch />
        </span>
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search servers..."
          className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
        />
      </div>

      <div className="flex items-center gap-3">
        <select
          value={filter}
          onChange={(e) =>
            onFilterChange(e.target.value as 'all' | 'installed' | 'uninstalled')
          }
          className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-900 shadow-sm focus:outline-none"
        >
          <option value="all">All Servers</option>
          <option value="installed">Installed</option>
          <option value="uninstalled">Uninstalled</option>
        </select>

        <button
          type="button"
          onClick={onReset}
          className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          Reset
        </button>
      </div>
    </div>
  );
};


