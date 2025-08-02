// import { BannerSection } from "@/components/BannerSection";
// import { FeaturesSection } from "@/components/FeaturesSection";
// import { OpenSourceSection } from "@/components/OpenSourceSection";

import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import TechStack from "@/components/TechStack";
import Footer from "@/components/Footer";

// const Index = () => {
//   return (
//     <div className="min-h-screen bg-background">
//       <BannerSection />
//       <FeaturesSection />
//       <OpenSourceSection />
//       <Footer />
//     </div>
//   );
// };

const Index = () => {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="scroll-smooth">
        <Hero />
        <HowItWorks />
        <Features />
        <TechStack />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
