import { FaEnvelope, FaQuestionCircle } from 'react-icons/fa';

export const ContactSection = () => {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col items-center justify-between gap-6 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-8 text-center md:flex-row md:text-left">
          <div>
            <h2 className="flex items-center text-xl font-semibold text-slate-900">
              <FaQuestionCircle className="mr-2" />
              Have questions or need a custom plan?
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Reach out and we&apos;ll help you design the right setup for your team and community.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 md:items-end">
            <a
              href="mailto:support@example.com"
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              <FaEnvelope className="mr-2" />
              Contact support
            </a>
            <p className="text-[11px] text-slate-500">
              Or join our Discord server to talk with the team.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};


