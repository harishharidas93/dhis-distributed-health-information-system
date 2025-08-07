import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Database, Users, FileText, Coins } from "lucide-react";

const features = [
  {
    icon: Database,
    title: "Decentralized Record Ownership",
    description: "Your medical records are stored on IPFS and controlled by you through blockchain technology. No single point of failure.",
    gradient: "from-primary to-trust-blue"
  },
  {
    icon: Coins,
    title: "Dynamic NFTs for Health Records",
    description: "Each medical record becomes a dynamic NFT that can be updated, shared, and monetized while maintaining full ownership.",
    gradient: "from-secondary to-trust-green"
  },
  {
    icon: Shield,
    title: "Private & Secure Access Control",
    description: "Military-grade AES-256 encryption with granular permission controls. You decide who sees what, when.",
    gradient: "from-security-purple to-privacy-indigo"
  },
  {
    icon: Users,
    title: "Multi-Stakeholder Collaboration",
    description: "Seamlessly share records between patients, doctors, hospitals, and insurance providers with audit trails.",
    gradient: "from-trust-blue to-primary"
  },
  {
    icon: FileText,
    title: "Immutable Audit History",
    description: "Every access, update, and transaction is permanently recorded on the blockchain for complete transparency.",
    gradient: "from-trust-green to-secondary"
  }
];

const Features = () => {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Key Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Built for the future of healthcare with cutting-edge Web3 technology and patient-centric design.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-strong transition-smooth duration-300 border-0 rounded-2xl overflow-hidden bg-gradient-card animate-slide-up hover:scale-105"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="pb-4">
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-r ${feature.gradient} mb-4 shadow-medium group-hover:scale-110 transition-smooth`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;