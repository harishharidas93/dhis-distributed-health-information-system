import { Card, CardContent } from "@/components/ui/card";
import { UserCheck, Upload, Coins } from "lucide-react";

const steps = [
  {
    id: 1,
    icon: UserCheck,
    title: "Create a Secure ID (DID)",
    description: "Generate your decentralized identity with cryptographic keys. Your identity, your control.",
    color: "text-primary"
  },
  {
    id: 2,
    icon: Upload,
    title: "Upload & Encrypt Medical Records",
    description: "Securely upload your health data with AES-256 encryption. Stored on IPFS for permanence.",
    color: "text-secondary"
  },
  {
    id: 3,
    icon: Coins,
    title: "Mint NFT & Control Access",
    description: "Transform records into dynamic NFTs. Grant or revoke access through smart contracts.",
    color: "text-privacy-indigo"
  }
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-gradient-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transform your healthcare experience in three simple steps. Take control of your medical data with blockchain technology.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={step.id} className="relative animate-slide-up" style={{ animationDelay: `${index * 0.2}s` }}>
              <Card className="h-full bg-white shadow-soft hover:shadow-medium transition-smooth border-0 rounded-2xl overflow-hidden group hover:scale-105">
                <CardContent className="p-8 text-center">
                  {/* Step Number */}
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-full text-white font-bold text-lg mb-6">
                    {step.id}
                  </div>
                  
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-6 group-hover:bg-gradient-primary group-hover:text-white transition-smooth ${step.color}`}>
                    <step.icon className="w-8 h-8" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-semibold mb-4">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
              
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-6 lg:-right-8 w-12 lg:w-16 h-0.5 bg-gradient-primary transform -translate-y-1/2" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;