import { Header } from "../components/Header";
import { HoneycombBackground } from "../components/HoneycombBackground";
import { Hero } from "../sections/Hero";
import { AppShowcase } from "../sections/AppShowcase";
import { Privacy } from "../sections/Privacy";
import { HowItWorks } from "../sections/HowItWorks";
import { Ubuntu } from "../sections/Ubuntu";
import { Footer } from "../sections/Footer";

export function HomePage() {
  return (
    <>
      <HoneycombBackground intensity={0.5} speed={0.6} />
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
