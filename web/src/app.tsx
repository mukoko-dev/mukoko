import { Hero } from "./sections/Hero";
import { AppShowcase } from "./sections/AppShowcase";
import { Privacy } from "./sections/Privacy";
import { HowItWorks } from "./sections/HowItWorks";
import { Ubuntu } from "./sections/Ubuntu";
import { Footer } from "./sections/Footer";

export function App() {
  return (
    <>
      <Hero />
      <AppShowcase />
      <Privacy />
      <HowItWorks />
      <Ubuntu />
      <Footer />
    </>
  );
}
