import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { TopNav } from '../../components/layout/TopNav';
import { Footer } from '../../components/layout/Footer';
import { PageTransition } from '../../components/motion/PageTransition';
import { useAuth } from '../../hooks/useAuth';
import { useApp } from '../../context/AppContext';
import { motion } from 'framer-motion';
import { FaCheck, FaLock, FaCreditCard, FaShieldAlt } from 'react-icons/fa';
import clsx from 'clsx';

type PlanType = 'pro' | 'business';

const ACCENT: Record<
  PlanType,
  { color: string; darkColor: string; bgColor: string; borderColor: string; darkAccent: string, checkColor: string }
> = {
  pro: {
    color: 'text-sky-200',
    darkColor: 'text-slate-700',
    bgColor: 'bg-sky-50',
    borderColor: 'border-sky-400',
    darkAccent: 'text-sky-300',
    checkColor: 'text-sky-600',
  },
  business: {
    color: 'text-emerald-100',
    darkColor: 'text-slate-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-300',
    darkAccent: 'text-emerald-300',
    checkColor: 'text-emerald-600',
  },
};

export const Payment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();
  const { theme, setSelectedPlan, selectedPlan, pricingPlans } = useApp();
  const rawPlanParam = searchParams.get('plan');
  const planParam: PlanType =
    rawPlanParam === 'pro' || rawPlanParam === 'business'
      ? rawPlanParam
      : 'pro';
  const effectivePlanFromUrl: PlanType =
    planParam === 'pro' && selectedPlan === 'business' ? 'business' : planParam;
  const [plan, setPlan] = useState<PlanType>(effectivePlanFromUrl);

  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    email: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  // Theme is provided globally by AppProvider.

  useEffect(() => {
    // Track which plan user is trying to pay for (global + local page state).
    setSelectedPlan(plan);
  }, [plan, setSelectedPlan]);

  useEffect(() => {
    // If something else updates the selected plan (e.g., PricingPlans click), reflect it here.
    if (selectedPlan === plan) return;
    if (selectedPlan === 'pro' || selectedPlan === 'business') {
      setPlan(selectedPlan);
    } else {
      // Fallback: treat any other value (e.g. 'free') as Pro for checkout.
      setPlan('pro');
    }
  }, [selectedPlan, plan]);

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      navigate('/premium', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

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

  const planData = pricingPlans.find((p) => p.id === plan);
  const accent = ACCENT[plan];
  const isDark = theme === 'dark';
  const summarySurface = isDark
    ? 'bg-slate-900/60 border-slate-800'
    : `${accent.bgColor} ${accent.borderColor}`;
  const formSurface = isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200';
  const headingText = isDark ? 'text-slate-100' : 'text-slate-900';
  const bodyText = isDark ? 'text-slate-300' : 'text-slate-600';
  const labelText = isDark ? 'text-slate-100' : 'text-slate-900';
  const inputBase = isDark
    ? 'bg-slate-800 text-slate-100 placeholder:text-slate-400 border-slate-700 focus:border-sky-400 focus:ring-sky-400'
    : 'bg-white text-slate-900 placeholder:text-slate-500 border-slate-300 focus:border-sky-500 focus:ring-sky-500';

  if (loading) {
    return (
      <>
        <TopNav currentGuildName={null} />
        <div className="flex min-h-[70vh] items-center justify-center text-slate-600">
          Loading checkout…
        </div>
        <Footer />
      </>
    );
  }

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
                    accent.borderColor,
                    isDark ? '' : accent.bgColor
                  )}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-6">
                    <p
                      className={clsx(
                        'text-sm font-semibold uppercase tracking-[0.2em]',
                        accent.checkColor
                      )}
                    >
                      {planData?.name ?? plan}
                    </p>
                    <div className="mt-4 flex items-end gap-2">
                      <p className={clsx('text-4xl font-semibold', headingText)}>
                        {planData?.priceLabel ?? ''}
                      </p>
                      <p className={clsx('mb-1 text-sm', isDark ? accent.color : accent.darkColor)}>
                        {planData?.priceSubLabel ?? ''}
                      </p>
                    </div>
                  </div>

                  <div className="mb-6">
                    {planData?.description && (
                      <p className={clsx('mb-4 text-sm', isDark ? accent.color : accent.darkColor)}>
                        {planData.description}
                      </p>
                    )}
                    <ul
                      className={clsx(
                        'mt-3 space-y-2.5 text-sm',
                        isDark ? accent.color : 'text-slate-700'
                      )}
                    >
                      {(planData?.features ?? []).map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5">
                          <span
                            className={clsx(
                              'mt-0.5 inline-flex h-5 w-5 items-center justify-center',
                              isDark ? accent.color : accent.checkColor
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

