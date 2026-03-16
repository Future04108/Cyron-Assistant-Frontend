import { motion } from 'framer-motion';
import { FaQuoteLeft, FaQuoteRight, FaStar } from 'react-icons/fa';
import { useApp } from '../../context/AppContext';

export const ReviewsSection = () => {
  const { reviews } = useApp();
  return (
    <section className="border-b border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
            Teams already shipping better support
          </h2>
          <p className="mt-3 text-base text-slate-600 max-w-2xl mx-auto">
            A few words from early Discord communities using Cyron Assistant to keep tickets flowing
            without burning out staff.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {reviews.map((review, idx) => (
            <motion.div
              className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              key={review.id ?? idx}
              initial={{ opacity: 0, y: 36, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.48, ease: 'easeOut', delay: idx * 0.06 }}
            >
              <div className="mb-3 flex items-center gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FaStar key={i} className="h-4 w-4" />
                ))}
              </div>
              <p className="text-sm text-slate-700 flex-1">
                <i>
                  <span className="inline align-text-top flex">
                    <FaQuoteLeft size={12} className="mr-1" />
                    {typeof review.textParts[0] === 'object'
                      ? review.textParts[0].left
                      : review.textParts[0]}
                  </span>
                  {typeof review.textParts[1] === 'string' && review.textParts[1]}
                  {typeof review.textParts[0] === 'object' && (
                    <span className="inline align-text-bottom flex">
                      {review.textParts[0].right}
                      <FaQuoteRight size={12} className="ml-1" />
                    </span>
                  )}
                  {typeof review.textParts[1] === 'string' &&
                    typeof review.textParts[0] === 'object' &&
                    null}
                  {typeof review.textParts[1] !== 'string' &&
                    typeof review.textParts[1] === 'object' && (
                      <span className="inline align-text-bottom flex">
                        {review.textParts[1].right}
                        <FaQuoteRight size={12} className="ml-1" />
                      </span>
                    )}
                </i>
              </p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                {review.reviewer}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};


