import { motion } from 'framer-motion';
import { FaQuestionCircle } from 'react-icons/fa';
import { useApp } from '../../context/AppContext';

export const PremiumFaqSection = () => {
  const { premiumFaqs } = useApp();
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
            Frequently asked questions
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            A few details about billing, limits, and how upgrading works.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {premiumFaqs.map((item, idx) => (
            <motion.div
              key={item.id}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm"
              initial={{ opacity: 0, x: idx % 2 === 0 ? -48 : 48 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.48, ease: 'easeOut', delay: idx % 2 === 0 ? 0.1 : 0.04 }}
            >
              <p className="mb-2 flex items-center font-semibold text-slate-900">
                <FaQuestionCircle className="mr-2 text-sky-500" />
                {item.question}
              </p>
              <p className="mt-2 text-sm text-slate-600">{item.answer}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};


