import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { ProblemSection } from "@/components/problem-section"
import { SocialProofSection } from "@/components/social-proof-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { MidPageCTA } from "@/components/mid-page-cta"
import { ExamplesSection } from "@/components/examples-section"
import { UpcomingSection } from "@/components/upcoming-section"
import { PricingSection } from "@/components/pricing-section"
import { FaqSection } from "@/components/faq-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0f1e]">
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <SocialProofSection />
      <HowItWorksSection />
      <MidPageCTA />
      <ExamplesSection />
      <PricingSection />
      <UpcomingSection />
      <FaqSection />
      <Footer />
    </main>
  )
}
