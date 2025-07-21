import { BannerSection } from "@/components/BannerSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { OpenSourceSection } from "@/components/OpenSourceSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <BannerSection />
      <FeaturesSection />
      <OpenSourceSection />
      <Footer />
    </div>
  );
};

export default Index;
