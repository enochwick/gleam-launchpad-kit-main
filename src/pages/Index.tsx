import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { Marquee } from "@/components/landing/Marquee";
import { GuidedTour } from "@/components/landing/GuidedTour";
import { Problems } from "@/components/landing/Problems";
import { Features } from "@/components/landing/Features";
import { Stakeholders } from "@/components/landing/Stakeholders";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Walkthroughs } from "@/components/landing/Walkthroughs";
import { MediaShowcase } from "@/components/landing/MediaShowcase";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";
import { ChatWidget } from "@/components/chat/ChatWidget";

const Index = () => {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Nav />
      <Hero />
      <Marquee />
      <GuidedTour />
      <Problems />
      <Features />
      <Stakeholders />
      <HowItWorks />
      <Walkthroughs />
      <MediaShowcase />
      <CTA />
      <Footer />
      <ChatWidget />
    </main>
  );
};

export default Index;
