import { TopNav } from '../../components/layout/TopNav';
import { Footer } from '../../components/layout/Footer';
import { PricingPlans } from '../../components/PricingPlans';
import { PageTransition } from '../../components/motion/PageTransition';
import { useAuth } from '../../hooks/useAuth';
import { PremiumHeroSection } from './HeroSection';
import { PremiumUnlocksSection } from './UnlocksSection';
import { PremiumFaqSection } from './FaqSection';
import { PremiumCtaSection } from './CtaSection';

export const Premium = () => {
  const { isAuthenticated, loginWithDiscord } = useAuth();

  return (
    <>
      <TopNav currentGuildName={null} />
      <PageTransition>
        <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-slate-50 text-slate-900">
          <PremiumHeroSection />
        <PricingPlans />
        <PremiumUnlocksSection />
        <PremiumFaqSection />
        <PremiumCtaSection isAuthenticated={isAuthenticated} loginWithDiscord={loginWithDiscord} />
        </div>
      </PageTransition>
      <Footer />
    </>
  );
};

