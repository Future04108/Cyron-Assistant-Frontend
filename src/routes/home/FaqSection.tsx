import { motion } from 'framer-motion';
import { FaQuestionCircle } from 'react-icons/fa';
import { useApp } from '../../context/AppContext';

export const FaqSection = () => {
  const { homeFaqs } = useApp();
  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
            Frequently asked questions
          </h2>
          <p className="mt-3 text-base text-slate-600 max-w-2xl mx-auto">
            Answers to a few things people usually ask before connecting Cyron Assistant to their Discord
            server.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {homeFaqs.map((item, idx) => (
            <motion.div
              key={item.id}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm"
              initial={{ opacity: 0, x: idx % 2 === 0 ? -48 : 48 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.48,
                ease: 'easeOut',
                delay: idx % 2 === 0 ? 0.06 : 0.02,
              }}
            >
              <p className="mb-2 flex items-center font-semibold text-slate-900">
                <FaQuestionCircle className="mr-2 text-sky-500" />
                {item.question}
              </p>
              <p className="text-slate-600">{item.answer}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};


