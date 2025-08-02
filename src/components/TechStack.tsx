import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const technologies = [
  {
    name: "Hedera",
    description: "Enterprise-grade blockchain for healthcare compliance",
    category: "Blockchain"
  },
  {
    name: "IPFS",
    description: "Decentralized storage for medical records",
    category: "Storage"
  },
  {
    name: "Filecoin",
    description: "Permanent, verifiable storage network",
    category: "Storage"
  },
  {
    name: "AES-256",
    description: "Military-grade encryption standard",
    category: "Security"
  },
  {
    name: "DIDs",
    description: "Decentralized identity management",
    category: "Identity"
  },
  {
    name: "React.js",
    description: "Modern, responsive user interface",
    category: "Frontend"
  },
  {
    name: "Smart Contracts",
    description: "Automated access control and permissions",
    category: "Blockchain"
  },
  {
    name: "Zero-Knowledge",
    description: "Privacy-preserving verification protocols",
    category: "Privacy"
  }
];

const categoryColors = {
  "Blockchain": "bg-primary text-primary-foreground",
  "Storage": "bg-secondary text-secondary-foreground", 
  "Security": "bg-security-purple text-white",
  "Identity": "bg-privacy-indigo text-white",
  "Frontend": "bg-trust-green text-white",
  "Privacy": "bg-trust-blue text-white"
};

const TechStack = () => {
  return (
    <section className="py-24 bg-gradient-hero">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Built on Proven Technology
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            dHIS leverages the most advanced and secure technologies to ensure your health data remains private, accessible, and under your control.
          </p>
        </div>
        
        <Card className="bg-white/95 backdrop-blur-sm shadow-strong rounded-3xl border-0 animate-slide-up">
          <CardContent className="p-8 lg:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {technologies.map((tech, index) => (
                <div 
                  key={index}
                  className="group p-6 rounded-xl bg-gradient-card hover:bg-white transition-smooth hover:shadow-medium hover:scale-105 animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-smooth">
                      {tech.name}
                    </h3>
                    <Badge 
                      className={`${categoryColors[tech.category as keyof typeof categoryColors]} text-xs px-2 py-1 rounded-full`}
                    >
                      {tech.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {tech.description}
                  </p>
                </div>
              ))}
            </div>
            
            {/* Security Statement */}
            <div className="mt-12 text-center p-6 bg-gradient-primary rounded-2xl text-white">
              <h3 className="text-xl font-semibold mb-2">
                🛡️ Healthcare-Grade Security & Compliance
              </h3>
              <p className="text-white/90">
                Built with HIPAA compliance in mind, featuring end-to-end encryption, zero-trust architecture, and immutable audit trails.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default TechStack;