import { motion } from "framer-motion";

import { Button } from "../../components/ui/Button";

const EMBED_SWATCHES = ['#1ab7ef', '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export const EmbedSettingsTab = ({
    embedColor, setEmbedColor, isProOrBusiness,
    updateGuildPending, guildLoading,
    handleSaveEmbedColor,
}: {
    embedColor: string;
    setEmbedColor: (s: string) => void;
    isProOrBusiness: boolean;
    updateGuildPending: boolean;
    guildLoading: boolean;
    handleSaveEmbedColor: () => void;
}) => {
    return (
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
                        disabled={updateGuildPending || guildLoading}
                    >
                        {updateGuildPending ? 'Saving…' : 'Save color'}
                    </Button>
                )}
            </div>
        </motion.div>
    );
}