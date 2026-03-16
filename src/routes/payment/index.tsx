import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { TopNav } from '../../components/layout/TopNav';
import { Footer } from '../../components/layout/Footer';
import { PageTransition } from '../../components/motion/PageTransition';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion';
import { FaCheck, FaLock, FaCreditCard, FaShieldAlt } from 'react-icons/fa';
import clsx from 'clsx';

type PlanType = 'free' | 'pro' | 'business';

interface PlanDetails {
  name: string;
  price: string;
  period: string;
  features: string[];
  color: string;
  bgColor: string;
  borderColor: string;
}

const PLAN_DETAILS: Record<PlanType, PlanDetails> = {
  free: {
    name: 'Free',
    price: '$0',
    period: 'month',
    features: [
      'Core AI ticket replies',
      'Limited monthly tokens & tickets',
      'Basic knowledge base & canned replies',
      'Community support via Discord',
    ],
    color: 'text-slate-700',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-200',
  },
  pro: {
    name: 'Pro',
    price: '$9',
    period: 'month',
    features: [
      '5-10× Free token & ticket limits',
      'Priority AI models & faster responses',
      'Customizable ticket embeds & branding',
      'Fine‑grained concurrency & rate limits',
      'Usage analytics with export‑ready charts',
      'Email support with 24-48h response',
    ],
    color: 'text-sky-700',
    bgColor: 'bg-sky-50',
    borderColor: 'border-sky-200',
  },
  business: {
    name: 'Business',
    price: 'Custom',
    period: 'pricing',
    features: [
      'Custom token, ticket, and concurrency limits',
      'Dedicated onboarding & configuration with your team',
      'Priority incident response & uptime SLAs',
      'Advanced audit logs & compliance‑friendly controls',
      'Roadmap input & early access to new features',
      'Regular success check‑ins and optimization reviews',
    ],
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
  },
};

export const Payment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const planParam = (searchParams.get('plan') || 'pro') as PlanType;
  const [plan, setPlan] = useState<PlanType>(planParam);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light';
    const stored = window.localStorage.getItem('theme');
    return stored === 'dark' ? 'dark' : 'light';
  });

  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    email: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  // Keep this page synced with the app theme toggle (TopNav writes to localStorage + emits `themechange`).
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const applyThemeFromStorage = () => {
      const stored = window.localStorage.getItem('theme');
      const nextTheme: 'light' | 'dark' = stored === 'dark' ? 'dark' : 'light';
      setTheme(nextTheme);
      document.documentElement.classList.toggle('dark', nextTheme === 'dark');
    };

    applyThemeFromStorage();
    window.addEventListener('themechange', applyThemeFromStorage);
    window.addEventListener('storage', applyThemeFromStorage);
    return () => {
      window.removeEventListener('themechange', applyThemeFromStorage);
      window.removeEventListener('storage', applyThemeFromStorage);
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/premium', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const groups = cleaned.match(/.{1,4}/g) || [];
    return groups.join(' ').slice(0, 19);
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length < 16) {
      newErrors.cardNumber = 'Please enter a valid card number';
    }

    if (!formData.expiryDate || !/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
    }

    if (!formData.cvv || formData.cvv.length < 3) {
      newErrors.cvv = 'Please enter a valid CVV';
    }

    if (!formData.cardholderName || formData.cardholderName.length < 2) {
      newErrors.cardholderName = 'Please enter cardholder name';
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      // In a real app, you would call your payment API here
      // For now, redirect to dashboard with success message
      navigate('/dashboard?payment=success', { replace: true });
    }, 2000);
  };

  const planDetails = PLAN_DETAILS[plan];
  const isDark = theme === 'dark';
  const summarySurface = isDark
    ? 'bg-slate-900/60 border-slate-800'
    : `${planDetails.bgColor} ${planDetails.borderColor}`;
  const formSurface = isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200';
  const headingText = isDark ? 'text-slate-100' : 'text-slate-900';
  const bodyText = isDark ? 'text-slate-300' : 'text-slate-600';
  const labelText = isDark ? 'text-slate-100' : 'text-slate-900';
  const inputBase = isDark
    ? 'bg-slate-800 text-slate-100 placeholder:text-slate-400 border-slate-700 focus:border-sky-400 focus:ring-sky-400'
    : 'bg-white text-slate-900 placeholder:text-slate-500 border-slate-300 focus:border-sky-500 focus:ring-sky-500';

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <TopNav currentGuildName={null} />
      <PageTransition>
        <div
          className={
            theme === 'dark'
              ? 'min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900'
              : 'min-h-screen bg-gradient-to-b from-sky-50 via-white to-slate-50'
          }
        >
          <div className="mx-auto max-w-6xl px-6 py-12">
            <div className="mb-8 text-center">
              <h1
                className={
                  theme === 'dark'
                    ? `text-3xl font-semibold tracking-tight ${headingText}`
                    : `text-3xl font-semibold tracking-tight ${headingText}`
                }
              >
                Complete your purchase
              </h1>
              <p
                className={
                  theme === 'dark'
                    ? `mt-2 text-base ${bodyText}`
                    : `mt-2 text-base ${bodyText}`
                }
              >
                Secure checkout powered by industry-standard encryption
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              {/* Plan Summary */}
              <div className="lg:col-span-1">
                <motion.div
                  className={clsx(
                    'rounded-3xl border p-8 shadow-sm',
                    summarySurface
                  )}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-6">
                    <p
                      className={clsx(
                        'text-sm font-semibold uppercase tracking-[0.2em]',
                        isDark
                          ? plan === 'pro'
                            ? 'text-sky-300'
                            : plan === 'business'
                              ? 'text-emerald-300'
                              : 'text-slate-200'
                          : planDetails.color
                      )}
                    >
                      {planDetails.name}
                    </p>
                    <div className="mt-4 flex items-end gap-2">
                      <p className={clsx('text-4xl font-semibold', headingText)}>
                        {planDetails.price}
                      </p>
                      <p className={clsx('mb-1 text-sm', bodyText)}>
                        /{planDetails.period}
                      </p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <p
                      className={clsx(
                        'text-sm font-medium',
                        isDark ? 'text-slate-200' : 'text-slate-700'
                      )}
                    >
                      Plan includes:
                    </p>
                    <ul
                      className={clsx(
                        'mt-3 space-y-2.5 text-sm',
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      )}
                    >
                      {planDetails.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5">
                          <span
                            className={clsx(
                              'mt-0.5 inline-flex h-5 w-5 items-center justify-center',
                              isDark ? 'text-sky-400' : 'text-sky-600'
                            )}
                          >
                            <FaCheck className="h-3.5 w-3.5" />
                          </span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => navigate('/premium')}
                    className={clsx(
                      'w-full text-sm font-medium',
                      isDark
                        ? 'text-sky-300 hover:text-sky-200'
                        : 'text-sky-600 hover:text-sky-700'
                    )}
                  >
                    ← Change plan
                  </button>
                </motion.div>
              </div>

              {/* Payment Form */}
              <div className="lg:col-span-2">
                <motion.div
                  className={clsx('rounded-3xl border p-8 shadow-sm', formSurface)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email */}
                    <div>
                      <label
                        htmlFor="email"
                        className={clsx('block text-sm font-semibold', labelText)}
                      >
                        Email address
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={clsx(
                          'mt-2 w-full rounded-lg border px-4 py-3 text-sm transition',
                          errors.email
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : inputBase
                        )}
                        placeholder="your@email.com"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>

                    {/* Card Number */}
                    <div>
                      <label
                        htmlFor="cardNumber"
                        className={clsx('block text-sm font-semibold', labelText)}
                      >
                        Card number
                      </label>
                      <div className="relative mt-2">
                        <FaCreditCard
                          className={clsx(
                            'absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2',
                            isDark ? 'text-slate-500' : 'text-slate-400'
                          )}
                        />
                        <input
                          type="text"
                          id="cardNumber"
                          value={formData.cardNumber}
                          onChange={(e) =>
                            handleInputChange('cardNumber', formatCardNumber(e.target.value))
                          }
                          className={clsx(
                            'w-full rounded-lg border px-4 py-3 pl-12 text-sm transition',
                            errors.cardNumber
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                              : inputBase
                          )}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                        />
                      </div>
                      {errors.cardNumber && (
                        <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
                      )}
                    </div>

                    {/* Cardholder Name */}
                    <div>
                      <label
                        htmlFor="cardholderName"
                        className={clsx('block text-sm font-semibold', labelText)}
                      >
                        Cardholder name
                      </label>
                      <input
                        type="text"
                        id="cardholderName"
                        value={formData.cardholderName}
                        onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                        className={clsx(
                          'mt-2 w-full rounded-lg border px-4 py-3 text-sm transition',
                          errors.cardholderName
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : inputBase
                        )}
                        placeholder="John Doe"
                      />
                      {errors.cardholderName && (
                        <p className="mt-1 text-sm text-red-600">{errors.cardholderName}</p>
                      )}
                    </div>

                    {/* Expiry and CVV */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="expiryDate"
                          className={clsx('block text-sm font-semibold', labelText)}
                        >
                          Expiry date
                        </label>
                        <input
                          type="text"
                          id="expiryDate"
                          value={formData.expiryDate}
                          onChange={(e) =>
                            handleInputChange('expiryDate', formatExpiryDate(e.target.value))
                          }
                          className={clsx(
                            'mt-2 w-full rounded-lg border px-4 py-3 text-sm transition',
                            errors.expiryDate
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                              : inputBase
                          )}
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                        {errors.expiryDate && (
                          <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="cvv"
                          className={clsx('block text-sm font-semibold', labelText)}
                        >
                          CVV
                        </label>
                        <input
                          type="text"
                          id="cvv"
                          value={formData.cvv}
                          onChange={(e) =>
                            handleInputChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))
                          }
                          className={clsx(
                            'mt-2 w-full rounded-lg border px-4 py-3 text-sm transition',
                            errors.cvv
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                              : inputBase
                          )}
                          placeholder="123"
                          maxLength={4}
                        />
                        {errors.cvv && (
                          <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>
                        )}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={isProcessing}
                        className={clsx(
                          'flex w-full items-center justify-center gap-2 rounded-full bg-sky-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-sky-500/40 transition',
                          isProcessing
                            ? 'cursor-not-allowed opacity-70'
                            : 'hover:bg-sky-700'
                        )}
                      >
                        {isProcessing ? (
                          <>
                            <svg
                              className="h-5 w-5 animate-spin"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            Processing...
                          </>
                        ) : (
                          <>
                            <FaLock className="h-4 w-4" />
                            Complete payment
                          </>
                        )}
                      </button>
                      <p className={clsx('mt-3 text-center text-xs', isDark ? 'text-slate-400' : 'text-slate-500')}>
                        By completing this purchase, you agree to our Terms of Service and Privacy Policy.
                        Your payment is secure and encrypted.
                      </p>
                    </div>
                  </form>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
      <Footer />
    </>
  );
};

