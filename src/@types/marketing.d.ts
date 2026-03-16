// Marketing / landing page domain (module)

type ThemeMode = 'light' | 'dark';
type PlanType = 'free' | 'pro' | 'business';

interface PricingPlan {
  id: PlanType;
  name: string;
  priceLabel: string;
  priceSubLabel: string;
  description: string;
  features: readonly string[];
  variant: 'neutral' | 'primary' | 'success';
  ctaLabel: string;
}

interface StatCard {
  id: string;
  label: string;
  value: number;
  suffix?: string;
  helper: string;
  color: 'sky' | 'emerald' | 'indigo' | 'amber';
}

interface Review {
  id: string;
  textParts: Array<string | { left: string; right: string }>;
  reviewer: string;
}

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface AppContextValue {
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
  toggleTheme: () => void;

  selectedPlan: PlanType;
  setSelectedPlan: (plan: PlanType) => void;

  pricingPlans: readonly PricingPlan[];
  stats: readonly StatCard[];
  reviews: readonly Review[];
  homeFaqs: readonly FaqItem[];
  premiumFaqs: readonly FaqItem[];
}


