import { motion } from 'framer-motion';

import { Button } from '../../components/ui/Button';

const TONES: Tone[] = ['Professional', 'Friendly', 'Casual', 'Formal'];

export const AiSettingsTab = ({
  systemPrompt,
  setSystemPrompt,
  previewOpen,
  setPreviewOpen,
  handleSavePrompt,
  updateGuildPending,
  guildLoading,
  localTone,
  setLocalTone,
  testReply,
  setTestReply,
}: {
  systemPrompt: string;
  setSystemPrompt: (s: string) => void;
  previewOpen: boolean;
  setPreviewOpen: (b: boolean) => void;
  handleSavePrompt: () => void;
  updateGuildPending: boolean;
  guildLoading: boolean;
  localTone: Tone;
  setLocalTone: (t: Tone) => void;
  testReply: string | null;
  setTestReply: (t: string | null) => void;
}) => {
  return (
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
              disabled={updateGuildPending || guildLoading}
            >
              {updateGuildPending ? 'Saving…' : 'Save prompt'}
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
            value={localTone}
            onChange={(e) => setLocalTone(e.target.value as Tone)}
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
            onClick={() =>
              setTestReply(
                (localTone === 'Friendly'
                  ? 'Hey! Thanks for messaging. I’d love to help — can you tell me a bit more about what you’re running into?'
                  : localTone === 'Casual'
                    ? 'Sure thing! What’s going on? Share the details and we’ll figure it out.'
                    : localTone === 'Formal'
                      ? 'We acknowledge your inquiry. Please provide the relevant information so that we may proceed in accordance with our procedures.'
                      : 'Thank you for reaching out. I’d be happy to help you with that. Could you please provide a few more details so we can assist you effectively?') as string,
              )
            }
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
  );
}