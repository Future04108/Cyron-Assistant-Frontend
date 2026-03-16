import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const AppContext = createContext<AppContextValue | undefined>(undefined);

const LS_THEME_KEY = 'theme';
const LS_SELECTED_PLAN_KEY = 'selected_plan';

const DEFAULT_PRICING_PLANS: readonly PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    priceLabel: '$0',
    priceSubLabel: '/ month',
    description: 'Perfect for getting started with basic ticket management and AI replies.',
    features: [
      'Core AI ticket replies',
      'Limited monthly tokens & tickets',
      'Basic knowledge base & canned replies',
      'Community support via Discord',
    ],
    variant: 'neutral',
    ctaLabel: 'Get started free',
  },
  {
    id: 'pro',
    name: 'Pro',
    priceLabel: '$9',
    priceSubLabel: '/ month',
    description: 'For serious support teams that want reliable AI coverage with human oversight.',
    features: [
      '5-10× Free token & ticket limits',
      'Priority AI models & faster responses',
      'Customizable ticket embeds & branding',
      'Fine‑grained concurrency & rate limits',
      'Usage analytics with export‑ready charts',
      'Email support with 24-48h response',
    ],
    variant: 'primary',
    ctaLabel: 'Start Pro trial',
  },
  {
    id: 'business',
    name: 'Business',
    priceLabel: '$20',
    priceSubLabel: '/ month',
    description:
      'Highest-tier plan for mission-critical communities, SaaS products, and scaled support teams that require  rapid SLAs, and holistic control over all AI-enabled ticket handling.',
    features: [
      '10× Pro plan limits for tokens, tickets, and concurrency',
      'Priority access to the fastest AI models and shortest response queue times',
      'Dedicated onboarding, account manager, and configuration with your team',
      'Advanced audit logs, security controls, and SSO/SAML support',
      'Role-based access for multiple admins and support staff',
      'SLA-backed prioritzed incident response & uptime guarantees'
    ],
    variant: 'success',
    ctaLabel: 'Start Business trial',
  },
];

const DEFAULT_STATS: readonly StatCard[] = [
  {
    id: 'servers',
    label: 'Servers',
    value: 2735,
    helper: 'Discord servers using our bot',
    color: 'sky',
  },
  {
    id: 'tickets',
    label: 'Tickets handled',
    value: 143769,
    helper: 'Tickets resolved automatically',
    color: 'emerald',
  },
  {
    id: 'ai-servers',
    label: 'AI‑enabled servers',
    value: 253,
    helper: 'Servers with automation switched on',
    color: 'indigo',
  },
  {
    id: 'response',
    label: 'Avg response time',
    value: 4,
    suffix: 's',
    helper: 'Lightning‑fast AI ticket replies',
    color: 'amber',
  },
];

const DEFAULT_REVIEWS: readonly Review[] = [
  {
    id: 'review-1',
    textParts: [
      { left: 'We went from waking up to a wall of', right: 'even sees them.' },
      'unanswered tickets to most common questions being answered before a mod',
    ],
    reviewer: 'Community manager, SaaS server',
  },
  {
    id: 'review-2',
    textParts: [
      { left: 'Our staff still handles edge cases, but', right: '70% of the ticket volume.' },
      'Cyron Assistant quietly takes care of 60 -',
    ],
    reviewer: 'Head of support, gaming community',
  },
  {
    id: 'review-3',
    textParts: [
      { left: 'Setup was faster than expected. Once we', right: 'adding another reliable staff member.' },
      'tuned the prompts and limits, it felt like',
    ],
    reviewer: 'Server owner, premium Discord',
  },
];

const DEFAULT_HOME_FAQS: readonly FaqItem[] = [
  {
    id: 'home-faq-1',
    question: 'Do I need to change how my tickets work today?',
    answer:
      'No. Cyron Assistant sits on top of your existing channels and ticket flows. You decide which channels it can answer in and when to escalate to staff.',
  },
  {
    id: 'home-faq-2',
    question: 'How does the bot learn our knowledge base?',
    answer:
      'You can sync docs, FAQs, and canned replies from the dashboard. The bot only answers from that approved knowledge-no random internet browsing.',
  },
  {
    id: 'home-faq-3',
    question: 'Can we limit how many AI replies we use per month?',
    answer:
      'Yes. Plans include clear token and ticket limits, and you can configure per‑server caps so usage never surprises your team.',
  },
  {
    id: 'home-faq-4',
    question: 'What happens if we remove the bot from Discord?',
    answer:
      'The dashboard will stop sending AI replies, but your existing ticket channels continue working as normal with human staff only.',
  },
];

const DEFAULT_PREMIUM_FAQS: readonly FaqItem[] = [
  {
    id: 'premium-faq-1',
    question: 'Can I run Free on some servers and Pro on others?',
    answer:
      'Yes. Plans are applied per Discord server. Many teams start with Free on side‑servers and upgrade only their main community once the team is comfortable.',
  },
  {
    id: 'premium-faq-2',
    question: 'What happens if I hit my monthly token or ticket limit?',
    answer:
      "Cyron Assistant will gracefully fall back to human‑only tickets instead of failing mid‑conversation. You'll see clear warnings in the dashboard before limits are reached.",
  },
  {
    id: 'premium-faq-3',
    question: 'Can I cancel or downgrade at any time?',
    answer:
      'Absolutely. You can switch between Free and Pro month‑to‑month, and Business plans are handled via invoice with clear terms.',
  },
  {
    id: 'premium-faq-4',
    question: 'How do you handle data and privacy?',
    answer:
      'We only store the minimum required ticket and knowledge data to operate the bot, and you can delete knowledge or logs at any time from your dashboard.',
  },
];

function readThemeFromStorage(): ThemeMode {
  if (typeof window === 'undefined') return 'light';
  const stored = window.localStorage.getItem(LS_THEME_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}

function readSelectedPlanFromStorage(): PlanType {
  if (typeof window === 'undefined') return 'pro';
  const stored = window.localStorage.getItem(LS_SELECTED_PLAN_KEY);
  return stored === 'free' || stored === 'pro' || stored === 'business' ? stored : 'pro';
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => readThemeFromStorage());
  const [selectedPlan, setSelectedPlanState] = useState<PlanType>(() => readSelectedPlanFromStorage());

  useEffect(() => {
    if (typeof document === 'undefined' || typeof window === 'undefined') return;
    document.documentElement.classList.toggle('dark', theme === 'dark');
    window.localStorage.setItem(LS_THEME_KEY, theme);
    window.dispatchEvent(new Event('themechange'));
  }, [theme]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(LS_SELECTED_PLAN_KEY, selectedPlan);
  }, [selectedPlan]);

  const setTheme = useCallback((t: ThemeMode) => setThemeState(t), []);
  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const setSelectedPlan = useCallback((plan: PlanType) => {
    setSelectedPlanState(plan);
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      theme,
      setTheme,
      toggleTheme,
      selectedPlan,
      setSelectedPlan,
      pricingPlans: DEFAULT_PRICING_PLANS,
      stats: DEFAULT_STATS,
      reviews: DEFAULT_REVIEWS,
      homeFaqs: DEFAULT_HOME_FAQS,
      premiumFaqs: DEFAULT_PREMIUM_FAQS,
    }),
    [selectedPlan, setSelectedPlan, setTheme, theme, toggleTheme]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}


