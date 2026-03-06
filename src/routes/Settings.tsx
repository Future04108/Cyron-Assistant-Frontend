import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { api } from '../lib/api';
import { Button } from '../components/ui/Button';
import { Loader } from '../components/ui/Loader';

const TONES = ['Professional', 'Friendly', 'Casual', 'Formal'] as const;
type Tone = (typeof TONES)[number];

const EMBED_SWATCHES = ['#1ab7ef', '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

interface Guild {
  id: number;
  name: string;
  plan: string;
  system_prompt: string;
  embed_color: string | null;
}

interface UsageStats {
  guild_id: number;
  plan: string;
  monthly_tokens_used: number;
  monthly_tokens_limit: number;
  daily_ticket_count: number;
  daily_ticket_limit: number;
  concurrent_ai_sessions: number;
  concurrent_limit: number;
}

async function fetchGuild(guildId: string): Promise<Guild> {
  const res = await api.get<Guild>(`/guilds/${guildId}`);
  return res.data;
}

async function fetchUsage(guildId: string): Promise<UsageStats> {
  const res = await api.get<UsageStats>(`/guilds/${guildId}/usage`);
  return res.data;
}

// Mock 7-day token usage for chart (backend could later provide GET /guilds/:id/usage/history)
function mockDailyTokenData(monthlyUsed: number): { date: string; tokens: number }[] {
  const days = 7;
  const now = new Date();
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (days - 1 - i));
    const label = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    const tokens = i === days - 1 ? monthlyUsed % 10000 : Math.floor((monthlyUsed / days) * (0.7 + Math.random() * 0.6));
    return { date: label, tokens };
  });
}

// Mock recent activity (backend could later provide GET /guilds/:id/usage/logs?limit=5)
interface ActivityRow {
  id: string;
  timestamp: string;
  tokens: number;
  preview: string;
}
function mockRecentActivity(): ActivityRow[] {
  return [
    { id: '1', timestamp: new Date().toISOString(), tokens: 120, preview: 'How do I reset my password?' },
    { id: '2', timestamp: new Date(Date.now() - 3600000).toISOString(), tokens: 85, preview: 'Refund policy question' },
    { id: '3', timestamp: new Date(Date.now() - 7200000).toISOString(), tokens: 210, preview: 'Account linking issue' },
    { id: '4', timestamp: new Date(Date.now() - 86400000).toISOString(), tokens: 95, preview: 'Billing inquiry' },
    { id: '5', timestamp: new Date(Date.now() - 172800000).toISOString(), tokens: 150, preview: 'Feature request' },
  ];
}

const TONE_SAMPLE_REPLIES: Record<Tone, string> = {
  Professional: 'Thank you for reaching out. I’d be happy to help you with that. Could you please provide a few more details so we can assist you effectively?',
  Friendly: 'Hey! Thanks for messaging. I’d love to help — can you tell me a bit more about what you’re running into?',
  Casual: 'Sure thing! What’s going on? Share the details and we’ll figure it out.',
  Formal: 'We acknowledge your inquiry. Please provide the relevant information so that we may proceed in accordance with our procedures.',
};

const tabLabels = ['AI Settings', 'Embed Customization', 'Usage Analytics'] as const;
type TabId = 'ai' | 'embed' | 'usage';

export const Settings = () => {
  const params = useParams<{ guildId?: string }>();
  const guildId = params.guildId;
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<TabId>('ai');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [tone, setTone] = useState<Tone>('Professional');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [testReply, setTestReply] = useState<string | null>(null);
  const [embedColor, setEmbedColor] = useState('#1ab7ef');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const { data: guild, isLoading: guildLoading, isError: guildError } = useQuery({
    queryKey: ['guild', guildId],
    queryFn: () => fetchGuild(guildId!),
    enabled: !!guildId,
  });

  const { data: usage, isLoading: usageLoading } = useQuery({
    queryKey: ['usage', guildId],
    queryFn: () => fetchUsage(guildId!),
    enabled: !!guildId && activeTab === 'usage',
  });

  useEffect(() => {
    if (guild) {
      setSystemPrompt(guild.system_prompt ?? '');
      setEmbedColor(guild.embed_color && /^#[0-9A-Fa-f]{6}$/.test(guild.embed_color) ? guild.embed_color : '#1ab7ef');
    }
  }, [guild]);

  const updateGuildMutation = useMutation({
    mutationFn: (payload: { system_prompt?: string; embed_color?: string }) =>
      api.patch(`/guilds/${guildId}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guild', guildId] });
      setToast({ type: 'success', message: 'Settings saved.' });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.detail ?? 'Failed to save. Please try again.';
      setToast({ type: 'error', message: msg });
    },
  });

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const handleSavePrompt = () => {
    if (!guildId) return;
    updateGuildMutation.mutate({ system_prompt: systemPrompt });
  };

  const handleSaveEmbedColor = () => {
    if (!guildId) return;
    if (!/^#[0-9A-Fa-f]{6}$/.test(embedColor)) {
      setToast({ type: 'error', message: 'Please enter a valid hex color (e.g. #1ab7ef).' });
      return;
    }
    updateGuildMutation.mutate({ embed_color: embedColor });
  };

  const isProOrBusiness = guild && ['pro', 'business'].includes((guild.plan ?? 'free').toLowerCase());

  if (!guildId) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-primary/5 via-white to-purple-50 px-6 py-12 text-center shadow-soft"
      >
        <h2 className="text-lg font-semibold tracking-tight">Select a server</h2>
        <p className="mt-2 max-w-md text-sm text-text-muted">
          Choose a server from the sidebar to manage AI settings, embed color, and usage.
        </p>
      </motion.section>
    );
  }

  if (guildError || (!guildLoading && !guild)) {
    return (
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl bg-white p-6 shadow-soft">
        <p className="text-sm text-red-500">Failed to load guild. Please refresh the page.</p>
      </motion.section>
    );
  }

  const chartData = usage ? mockDailyTokenData(usage.monthly_tokens_used) : [];
  const recentActivity = mockRecentActivity();

  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="space-y-6"
      >
        <header>
          <h2 className="text-lg font-semibold tracking-tight">Settings</h2>
          <p className="text-sm text-text-muted">
            Configure AI behavior, embed appearance, and view usage for this server.
          </p>
          {guild && (
            <p className="mt-1 text-xs text-text-muted">
              <span className="font-medium">{guild.name}</span> ·{' '}
              <span className="capitalize">{(guild.plan ?? 'free').toLowerCase()} plan</span>
            </p>
          )}
        </header>

        {/* Tabs */}
        <div className="flex gap-1 rounded-xl bg-slate-100/80 p-1">
          {(['ai', 'embed', 'usage'] as const).map((tab, i) => (
            <motion.button
              key={tab}
              type="button"
              onClick={() => {
                setActiveTab(tab);
                setTestReply(null);
              }}
              className={`relative flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                activeTab === tab ? 'text-slate-800' : 'text-slate-500 hover:text-slate-700'
              }`}
              initial={false}
            >
              {activeTab === tab && (
                <motion.span
                  layoutId="settingsTab"
                  className="absolute inset-0 rounded-lg bg-white shadow-sm"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                  style={{ zIndex: 0 }}
                />
              )}
              <span className="relative z-10">{tabLabels[i]}</span>
            </motion.button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          {activeTab === 'ai' && (
            <motion.div
              key="ai"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="rounded-xl bg-white p-4 shadow-soft">
                <div className="mb-3 flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">System prompt</label>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-xs"
                      onClick={() => setPreviewOpen(true)}
                    >
                      Live preview
                    </Button>
                    <Button
                      type="button"
                      className="text-xs"
                      onClick={handleSavePrompt}
                      disabled={updateGuildMutation.isPending || guildLoading}
                    >
                      {updateGuildMutation.isPending ? 'Saving…' : 'Save prompt'}
                    </Button>
                  </div>
                </div>
                <textarea
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  className="min-h-[160px] w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-primary/40 focus:bg-white focus:ring"
                  placeholder="e.g. You are a helpful support assistant for..."
                />
                <div className="mt-3">
                  <label className="mb-1 block text-xs font-medium text-slate-600">Tone</label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value as Tone)}
                    className="w-full max-w-xs rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-primary/40 focus:bg-white focus:ring"
                  >
                    {TONES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mt-3">
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-xs"
                    onClick={() => setTestReply(TONE_SAMPLE_REPLIES[tone])}
                  >
                    Test prompt
                  </Button>
                  {testReply && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-2 rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm text-slate-700"
                    >
                      <p className="text-xs font-medium text-primary">Sample AI reply (simulation)</p>
                      <p className="mt-1">{testReply}</p>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'embed' && (
            <motion.div
              key="embed"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {!isProOrBusiness && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
                >
                  <span className="text-lg">🔒</span>
                  <div>
                    <p className="font-semibold">Pro / Business only</p>
                    <p className="text-xs text-amber-700">
                      Embed color customization is available on Pro and Business plans.
                    </p>
                  </div>
                </motion.div>
              )}
              <div className="rounded-xl bg-white p-4 shadow-soft">
                <label className="mb-2 block text-xs font-semibold text-slate-700">Embed color</label>
                <div className="flex flex-wrap items-center gap-3">
                  <input
                    type="color"
                    value={embedColor}
                    onChange={(e) => setEmbedColor(e.target.value)}
                    className="h-10 w-14 cursor-pointer rounded-lg border border-slate-200"
                    disabled={!isProOrBusiness}
                  />
                  <input
                    type="text"
                    value={embedColor}
                    onChange={(e) => setEmbedColor(e.target.value)}
                    className="w-24 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 font-mono text-sm outline-none ring-primary/40 focus:bg-white focus:ring"
                    placeholder="#1ab7ef"
                    disabled={!isProOrBusiness}
                  />
                </div>
                <p className="mt-2 text-xs text-text-muted">Swatches</p>
                <div className="mt-1 flex gap-2">
                  {EMBED_SWATCHES.map((hex) => (
                    <button
                      key={hex}
                      type="button"
                      onClick={() => isProOrBusiness && setEmbedColor(hex)}
                      disabled={!isProOrBusiness}
                      className="h-8 w-8 rounded-lg border-2 border-slate-200 transition hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary"
                      style={{
                        backgroundColor: hex,
                        borderColor: embedColor === hex ? 'var(--tw-ring-color, #1ab7ef)' : undefined,
                        boxShadow: embedColor === hex ? '0 0 0 2px #1ab7ef' : undefined,
                      }}
                      title={hex}
                    />
                  ))}
                </div>
                <p className="mt-3 text-xs font-medium text-slate-600">Live preview</p>
                <div
                  className="mt-2 rounded-lg border border-slate-200 p-3"
                  style={{ borderLeftWidth: '4px', borderLeftColor: embedColor }}
                >
                  <p className="text-sm font-semibold text-slate-800">Cyron Assistant</p>
                  <p className="mt-0.5 text-xs text-text-muted">
                    Ticket #123 · Opened by User · Use this channel to get AI-powered support.
                  </p>
                  <p className="mt-2 text-[11px] text-text-muted">Preview — color applies to all ticket embeds.</p>
                </div>
                {isProOrBusiness && (
                  <Button
                    type="button"
                    className="mt-4"
                    onClick={handleSaveEmbedColor}
                    disabled={updateGuildMutation.isPending || guildLoading}
                  >
                    {updateGuildMutation.isPending ? 'Saving…' : 'Save color'}
                  </Button>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'usage' && (
            <motion.div
              key="usage"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {usageLoading && (
                <div className="flex items-center gap-2 text-sm text-text-muted">
                  <Loader /> Loading usage…
                </div>
              )}
              {usage && !usageLoading && (
                <>
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
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="rounded-xl bg-white p-4 shadow-soft"
                  >
                    <p className="mb-3 text-sm font-semibold text-slate-700">Token usage (last 7 days)</p>
                    <p className="mb-2 text-xs text-text-muted">Sample distribution — backend can provide real time series later.</p>
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
                            contentStyle={{ fontSize: 12, borderRadius: 8 }}
                            formatter={(value: number) => [value.toLocaleString(), 'Tokens']}
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

                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="rounded-xl bg-white p-4 shadow-soft"
                  >
                    <p className="mb-3 text-sm font-semibold text-slate-700">Recent activity (last 5 AI calls)</p>
                    <p className="mb-2 text-xs text-text-muted">Sample data — backend can provide real usage logs later.</p>
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
          )}
        </AnimatePresence>
      </motion.section>

      {/* Live preview modal */}
      <AnimatePresence>
        {previewOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={() => setPreviewOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[80vh] w-full max-w-lg overflow-auto rounded-2xl bg-white p-6 shadow-xl"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-base font-semibold">System prompt preview</h3>
                <button
                  type="button"
                  onClick={() => setPreviewOpen(false)}
                  className="rounded-full p-1 text-text-muted hover:bg-slate-100"
                >
                  ✕
                </button>
              </div>
              <pre className="mt-3 whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-sm text-slate-800">
                {systemPrompt || '(Empty)'}
              </pre>
              <Button type="button" variant="ghost" className="mt-4" onClick={() => setPreviewOpen(false)}>
                Close
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className={`fixed bottom-4 right-4 z-50 rounded-lg px-4 py-2 text-xs shadow-lg ${
              toast.type === 'success' ? 'bg-slate-900 text-white' : 'bg-red-600 text-white'
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
