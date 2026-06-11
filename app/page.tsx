import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { ProblemSection } from "@/components/problem-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { MidPageCTA } from "@/components/mid-page-cta"
import { ExamplesSection } from "@/components/examples-section"
import { UpcomingSection } from "@/components/upcoming-section"
import { PricingSection } from "@/components/pricing-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <HowItWorksSection />
      <MidPageCTA />
      <ExamplesSection />
      <PricingSection />
      <UpcomingSection />
      <Footer />
    </main>
  )
}
