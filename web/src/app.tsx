import { Header } from "./components/Header";
import { HoneycombBackground } from "./components/HoneycombBackground";
import { Hero } from "./sections/Hero";
import { AppShowcase } from "./sections/AppShowcase";
import { Privacy } from "./sections/Privacy";
import { HowItWorks } from "./sections/HowItWorks";
import { Ubuntu } from "./sections/Ubuntu";
import { Footer } from "./sections/Footer";

export function App() {
  return (
    <>
      <HoneycombBackground intensity={0.18} speed={0.3} />
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
