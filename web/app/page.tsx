import { Header } from "@/components/Header";
import { HoneycombBackgroundLoader } from "@/components/HoneycombBackgroundLoader";
import { Hero } from "@/sections/Hero";
import { AppShowcase } from "@/sections/AppShowcase";
import { Privacy } from "@/sections/Privacy";
import { HowItWorks } from "@/sections/HowItWorks";
import { Ubuntu } from "@/sections/Ubuntu";
import { Footer } from "@/sections/Footer";

export default function HomePage() {
  return (
    <>
      <HoneycombBackgroundLoader intensity={0.5} speed={0.6} />
      <Header />
      <main>
        <Hero />
        <AppShowcase />
        <Privacy />
        <HowItWorks />
        <Ubuntu />
      </main>
      <Footer />
    </>
  );
}
