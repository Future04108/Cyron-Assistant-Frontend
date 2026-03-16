import { Link } from 'react-router-dom';
import { FaDiscord, FaEnvelope, FaPhoneAlt } from 'react-icons/fa';
import { FaYoutube } from 'react-icons/fa';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-12 text-base">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Link
              to="/"
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800"
            >
              <img
                src="/img/cyron-2.png"
                alt="Cyron Assistant"
                className="h-11 w-11"
                style={{ borderRadius: '50%' }}
              />
            </Link>
            <div>
              <p className="text-xl font-semibold text-slate-100">
                Cyron Assistant
              </p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="uppercase text-slate-400 font-semibold tracking-wide mb-4 text-sm">Pages</h4>
          <ul className="space-y-3">
            <li>
              <Link to="/" className="text-slate-300 hover:text-emerald-400 transition text-base">Home</Link>
            </li>
            <li>
              <Link to="/premium" className="text-slate-300 hover:text-emerald-400 transition text-base">Premium</Link>
            </li>
            <li>
              <Link to="/dashboard" className="text-slate-300 hover:text-emerald-400 transition text-base">Dashboard</Link>
            </li>
            <li>
              <Link to="/docs" className="text-slate-300 hover:text-emerald-400 transition text-base">Docs</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="uppercase text-slate-400 font-semibold tracking-wide mb-4 text-sm">Contact</h4>
          <ul className="space-y-3">
            <li>
              <a
                href="mailto:support@cyron.ai"
                className="flex items-center gap-3 hover:text-emerald-400 transition text-base"
              >
                <FaEnvelope className="text-slate-400" size={18} /> support@cyron.ai
              </a>
            </li>
            <li>
              <a
                href="tel:+1234567890"
                className="flex items-center gap-3 hover:text-emerald-400 transition text-base"
              >
                <FaPhoneAlt className="text-slate-400" size={18} /> +1 (234) 567-890
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="uppercase text-slate-400 font-semibold tracking-wide mb-4 text-sm">Social</h4>
          <div className="flex flex-col gap-3">
            <a
              href="https://discord.gg/yourdiscord"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 hover:text-emerald-400 transition text-base"
            >
              <FaDiscord size={20} className="text-slate-400" /> Join our Discord
            </a>
            <a
              href="https://youtube.com/@cyronai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 hover:text-emerald-400 transition text-base"
            >
              <FaYoutube size={22} className="text-slate-400" /> YouTube
            </a>
          </div>
        </div>
      </div>

      <div className="w-full border-t border-slate-800 mt-2">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-center text-slate-500 py-6 text-sm">
            &copy; {new Date().getFullYear()} Cyron Assistant. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
