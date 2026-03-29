import { Header } from "@/components/Header";
import { HoneycombBackgroundLoader } from "@/components/HoneycombBackgroundLoader";
import { Hero } from "@/sections/Hero";
import { Problem } from "@/sections/Problem";
import { Ecosystem } from "@/sections/Ecosystem";
import { YourHoney } from "@/sections/YourHoney";
import { ShamwariSection } from "@/sections/ShamwariSection";
import { MukokoID } from "@/sections/MukokoID";
import { Ubuntu } from "@/sections/Ubuntu";
import { NeverDo } from "@/sections/NeverDo";
import { FinalCTA } from "@/sections/FinalCTA";
import { Footer } from "@/sections/Footer";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "mukoko",
  url: "https://mukoko.com",
  description:
    "A digital twin social ecosystem for Africa. 15 mini-apps, one identity, your sovereignty.",
  founder: { "@type": "Organization", name: "Nyuchi Africa" },
  sameAs: ["https://github.com/nyuchitech"],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HoneycombBackgroundLoader />
      <Header />
      <main id="main-content">
        <Hero />
        <Problem />
        <Ecosystem />
        <YourHoney />
        <ShamwariSection />
        <MukokoID />
        <Ubuntu />
        <NeverDo />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
