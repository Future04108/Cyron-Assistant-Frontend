import { FaSearch, FaServer } from 'react-icons/fa';

export const DashboardEmptyState = () => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
      <p className="text-sm font-semibold text-slate-900 flex items-center justify-center gap-2">
        <FaServer className="text-xl text-slate-300" />
        No servers found
      </p>
      <p className="mt-1 text-sm text-slate-600 flex items-center justify-center gap-1">
        <FaSearch className="text-xs" />
        Try a different search or filter.
      </p>
    </div>
  );
};


