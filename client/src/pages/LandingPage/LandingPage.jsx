import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import HeroSection from "../../components/landing/HeroSection";
import HowItWorksSection from "../../components/landing/HowItWorksSection";
import BenefitsSection from "../../components/landing/BenefitsSection";
import ReviewsSection from "../../components/landing/ReviewsSection";
import CTASection from "../../components/landing/CTASection";

export default function LandingPage() {
  return (
    <div className="flex min-h-svh flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <HowItWorksSection />
        <BenefitsSection />
        <ReviewsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
