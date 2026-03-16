import { TopNav } from '../../components/layout/TopNav';
import { Footer } from '../../components/layout/Footer';
import { PricingPlans } from '../../components/PricingPlans';
import { useAuth } from '../../hooks/useAuth';
import { PageTransition } from '../../components/motion/PageTransition';
import { HeroSection } from './HeroSection';
import { StatsSection } from './StatsSection';
import { FeaturesSection } from './FeaturesSection';
import { ReviewsSection } from './ReviewsSection';
import { FaqSection } from './FaqSection';
import { ContactSection } from './ContactSection';

export const Home = () => {
  const { isAuthenticated, loginWithDiscord } = useAuth();

  return (
    <>
      <TopNav currentGuildName={null} />
      <PageTransition>
        <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-slate-50">
          <HeroSection isAuthenticated={isAuthenticated} loginWithDiscord={loginWithDiscord} />
          <StatsSection />
          <FeaturesSection />
          <PricingPlans />
          <ReviewsSection />
          <FaqSection />
          <ContactSection />
        </div>
      </PageTransition>
      <Footer />
    </>
  );
};