import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Github, 
  Twitter, 
  MessageCircle, 
  Mail, 
  Heart,
  Zap,
  Globe} from "lucide-react";

const socialLinks = [
  { icon: Github, label: "GitHub", href: "#" },
  { icon: Twitter, label: "Twitter", href: "#" },
  { icon: MessageCircle, label: "Discord", href: "#" },
  { icon: Mail, label: "Email", href: "#" }
];

const links = [
  {
    title: "Product",
    items: [
      { label: "Features", href: "#" },
      { label: "Pricing", href: "#" },
      { label: "Roadmap", href: "#" },
      { label: "Changelog", href: "#" }
    ]
  },
  {
    title: "Developers",
    items: [
      { label: "Documentation", href: "#" },
      { label: "API Reference", href: "#" },
      { label: "GitHub", href: "#" },
      { label: "Community", href: "#" }
    ]
  },
  {
    title: "Support",
    items: [
      { label: "Help Center", href: "#" },
      { label: "Contact Us", href: "#" },
      { label: "Status", href: "#" },
      { label: "Bug Reports", href: "#" }
    ]
  }
];

export const Footer = () => {
  return (
    <footer className="relative border-t border-border/50 bg-gradient-to-b from-background to-muted/20">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        {/* Top Section */}
        <div className="grid lg:grid-cols-12 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-4">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center mr-3">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                MintBridge
              </span>
            </div>
            
            <p className="text-muted-foreground mb-6 leading-relaxed">
              The unified, open-source NFT minting platform that connects all your wallets 
              and chains in one beautiful interface.
            </p>

            <div className="flex items-center gap-2 mb-6">
              <Badge variant="outline" className="border-green-500/50 bg-green-500/10 text-green-400">
                <Heart className="w-3 h-3 mr-1" />
                Open Source
              </Badge>
              <Badge variant="outline" className="border-blue-500/50 bg-blue-500/10 text-blue-400">
                <Globe className="w-3 h-3 mr-1" />
                Multi-Chain
              </Badge>
            </div>

            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="icon"
                  className="hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </Button>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          <div className="lg:col-span-8 grid md:grid-cols-3 gap-8">
            {links.map((section, index) => (
              <div key={index}>
                <h4 className="font-semibold text-foreground mb-4">{section.title}</h4>
                <ul className="space-y-3">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <a 
                        href={item.href}
                        className="text-muted-foreground hover:text-primary transition-colors text-sm"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border/50 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>© 2024 MintBridge. All rights reserved.</span>
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Built with</span>
              <Heart className="w-4 h-4 text-red-500" />
              <span>by the Web3 community</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};