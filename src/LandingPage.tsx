import { useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

// UI Components
import { ParticlesBackground } from './components/landing/ui';

// Sections
import {
  Navigation,
  HeroSection,
  StatsSection,
  LogoCarouselSection,
  PainPointsSection,
  WhyChooseUsSection,
  ProcessSection,
  DemoPreviewSection,
  FeaturesSection,
  IntegrationsSection,
  ComparisonSection,
  MetricsSection,
  CaseStudiesSection,
  TeamSection,
  RoadmapSection,
  SecuritySection,
  MobileAppSection,
  TestimonialsSection,
  WebinarsSection,
  BlogSection,
  PricingSection,
  FAQSection,
  NewsletterSection,
  FinalCTASection,
  Footer,
  ChatWidget,
} from './components/landing/sections';

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-theme-primary text-theme-primary overflow-x-hidden">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-amber-600 origin-left z-[100]"
        style={{ scaleX }}
      />

      {/* Particles Background */}
      <ParticlesBackground />

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-[200px] animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-blue-500/3 rounded-full blur-[250px]" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[150px]" />
      </div>

      {/* Grid Pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(var(--grid-color)_1px,transparent_1px),linear-gradient(90deg,var(--grid-color)_1px,transparent_1px)] bg-[size:80px_80px] pointer-events-none z-0" />

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Section */}
        <HeroSection />

        {/* Stats Section */}
        <StatsSection />

        {/* Logo Carousel */}
        <LogoCarouselSection />

        {/* Pain Points */}
        <PainPointsSection />

        {/* Why Choose Us */}
        <WhyChooseUsSection />

        {/* Process */}
        <ProcessSection />

        {/* Demo Preview */}
        <DemoPreviewSection />

        {/* Features Grid */}
        <FeaturesSection />

        {/* Integrations */}
        <IntegrationsSection />

        {/* Comparison */}
        <ComparisonSection />

        {/* Metrics */}
        <MetricsSection />

        {/* Case Studies */}
        <CaseStudiesSection />

        {/* Team */}
        <TeamSection />

        {/* Roadmap */}
        <RoadmapSection />

        {/* Security */}
        <SecuritySection />

        {/* Mobile App */}
        <MobileAppSection />

        {/* Testimonials */}
        <TestimonialsSection />

        {/* Webinars */}
        <WebinarsSection />

        {/* Blog */}
        <BlogSection />

        {/* Pricing */}
        <PricingSection />

        {/* FAQ */}
        <FAQSection />

        {/* Newsletter */}
        <NewsletterSection />

        {/* Final CTA */}
        <FinalCTASection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Chat Widget */}
      <ChatWidget />

      {/* Back to Top */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: typeof window !== 'undefined' && window.scrollY > 500 ? 1 : 0 
        }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-24 right-6 z-40 w-12 h-12 bg-theme-tertiary text-theme-primary rounded-full flex items-center justify-center shadow-xl hover:bg-theme-hover transition-colors"
      >
        <ArrowUp className="w-5 h-5" />
      </motion.button>
    </div>
  );
}
