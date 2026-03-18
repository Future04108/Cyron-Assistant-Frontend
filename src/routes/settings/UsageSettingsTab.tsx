import { motion } from "framer-motion";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

import { Loader } from "../../components/ui/Loader";
import { useApp } from "../../context/AppContext";

export const UsageTab = ({
    usage,
    usageLoading,
    usageError,
    historyLoading,
    historyError,
    logsLoading,
    logsError,
    chartData,
    recentActivity,
}: {
    usage: any;
    usageLoading: boolean;
    usageError: boolean;
    historyLoading: boolean;
    historyError: boolean;
    logsLoading: boolean;
    logsError: boolean;
    chartData: any[];
    recentActivity: any[];
}) => {
    const { theme } = useApp();
    const isDark = theme === 'dark';

    return (
        <motion.div
            key="usage"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
        >
            {(usageLoading || historyLoading || logsLoading) && (
                <div className="flex items-center gap-2 text-sm text-text-muted">
                    <Loader /> Loading usage…
                </div>
            )}
            {(usageError || historyError || logsError) && (
                <p className="text-sm text-red-500">
                    Failed to load usage analytics. Please refresh the page.
                </p>
            )}
            {usage && !usageLoading && !usageError && (
                <>
                    {/* Usage summary (tokens, tickets, sessions) */}
                    <div className="grid gap-4 md:grid-cols-3">
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 }}
                            className="rounded-xl bg-white p-4 shadow-soft"
                        >
                            <p className="text-xs font-medium text-text-muted">Monthly tokens</p>
                            <p className="mt-1 text-2xl font-semibold text-primary">
                                {usage.monthly_tokens_used.toLocaleString()} / {usage.monthly_tokens_limit.toLocaleString()}
                            </p>
                            <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{
                                        width: `${Math.min(100, (usage.monthly_tokens_used / usage.monthly_tokens_limit) * 100)}%`,
                                    }}
                                    transition={{ duration: 0.4, ease: 'easeOut' }}
                                    className="h-full rounded-full bg-primary"
                                />
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="rounded-xl bg-white p-4 shadow-soft"
                        >
                            <p className="text-xs font-medium text-text-muted">Tickets today</p>
                            <p className="mt-1 text-2xl font-semibold text-primary">
                                {usage.daily_ticket_count} / {usage.daily_ticket_limit}
                            </p>
                            <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{
                                        width: `${Math.min(100, (usage.daily_ticket_count / usage.daily_ticket_limit) * 100)}%`,
                                    }}
                                    transition={{ duration: 0.4, ease: 'easeOut' }}
                                    className="h-full rounded-full bg-primary"
                                />
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="rounded-xl bg-white p-4 shadow-soft"
                        >
                            <p className="text-xs font-medium text-text-muted">Concurrent sessions</p>
                            <p className="mt-1 text-2xl font-semibold text-primary">
                                {usage.concurrent_ai_sessions} / {usage.concurrent_limit}
                            </p>
                            <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{
                                        width: `${Math.min(100, (usage.concurrent_ai_sessions / usage.concurrent_limit) * 100)}%`,
                                    }}
                                    transition={{ duration: 0.4, ease: 'easeOut' }}
                                    className="h-full rounded-full bg-primary"
                                />
                            </div>
                        </motion.div>
                    </div>
                    {/* AreaChart */}
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="rounded-xl bg-white p-4 shadow-soft"
                    >
                        <p className="mb-3 text-sm font-semibold text-slate-700">Token usage (last 7 days)</p>
                        <p className="mb-2 text-xs text-text-muted">
                            Daily token usage aggregated from live usage logs.
                        </p>
                        <div className="h-48 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="tokenGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#1ab7ef" stopOpacity={0.4} />
                                            <stop offset="100%" stopColor="#1ab7ef" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                                    <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" />
                                    <Tooltip
                                        contentStyle={{
                                            fontSize: 12,
                                            borderRadius: 12,
                                            border: isDark ? '1px solid rgba(148,163,184,0.22)' : '1px solid rgba(148,163,184,0.35)',
                                            backgroundColor: isDark ? 'rgba(15, 23, 42, 0.92)' : 'rgba(255, 255, 255, 0.98)',
                                            color: isDark ? '#e2e8f0' : '#0f172a',
                                            boxShadow: isDark
                                                ? '0 18px 45px rgba(0, 0, 0, 0.55)'
                                                : '0 18px 45px rgba(15, 23, 42, 0.12)',
                                        }}
                                        labelStyle={{
                                            color: isDark ? '#cbd5e1' : '#334155',
                                            fontWeight: 600,
                                        }}
                                        itemStyle={{
                                            color: isDark ? '#e2e8f0' : '#0f172a',
                                        }}
                                        cursor={{
                                            stroke: isDark ? 'rgba(148,163,184,0.35)' : 'rgba(148,163,184,0.45)',
                                            strokeWidth: 1,
                                        }}
                                        formatter={(value) => [
                                            (typeof value === 'number' ? value : Number(value ?? 0)).toLocaleString(),
                                            'Tokens',
                                        ]}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="tokens"
                                        stroke="#1ab7ef"
                                        strokeWidth={2}
                                        fill="url(#tokenGradient)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                    {/* Recent activity table */}
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        className="rounded-xl bg-white p-4 shadow-soft"
                    >
                        <p className="mb-3 text-sm font-semibold text-slate-700">
                            Recent activity (last 10 AI calls)
                        </p>
                        <p className="mb-2 text-xs text-text-muted">
                            Live data from recent AI responses for this server.
                        </p>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="border-b border-slate-200 text-slate-500">
                                        <th className="pb-2 pr-2 font-medium">Time</th>
                                        <th className="pb-2 pr-2 font-medium">Tokens</th>
                                        <th className="pb-2 font-medium">Preview</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentActivity.map((row) => (
                                        <tr key={row.id} className="border-b border-slate-100">
                                            <td className="py-2 pr-2 text-text-muted">
                                                {new Date(row.timestamp).toLocaleString()}
                                            </td>
                                            <td className="py-2 pr-2 font-mono text-primary">{row.tokens}</td>
                                            <td className="py-2 truncate max-w-[200px]">{row.preview}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </>
            )}
        </motion.div>
    );
}