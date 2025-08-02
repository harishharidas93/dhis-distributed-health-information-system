import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Heart, Github, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">dHIS</span>
            </div>
            <p className="text-background/70 leading-relaxed">
              Empowering patients with decentralized, secure, and private health data ownership through blockchain technology.
            </p>
          </div>
          
          {/* Product */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <div className="space-y-3">
              <a href="#" className="block text-background/70 hover:text-background transition-smooth">Features</a>
              <a href="#" className="block text-background/70 hover:text-background transition-smooth">How It Works</a>
              <a href="#" className="block text-background/70 hover:text-background transition-smooth">Security</a>
              <a href="#" className="block text-background/70 hover:text-background transition-smooth">Pricing</a>
            </div>
          </div>
          
          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <div className="space-y-3">
              <a href="#" className="block text-background/70 hover:text-background transition-smooth">About</a>
              <a href="#" className="block text-background/70 hover:text-background transition-smooth">Careers</a>
              <a href="#" className="block text-background/70 hover:text-background transition-smooth">Blog</a>
              <a href="#" className="block text-background/70 hover:text-background transition-smooth">Contact</a>
            </div>
          </div>
          
          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <div className="space-y-3">
              <a href="#" className="block text-background/70 hover:text-background transition-smooth">Privacy Policy</a>
              <a href="#" className="block text-background/70 hover:text-background transition-smooth">Terms of Service</a>
              <a href="#" className="block text-background/70 hover:text-background transition-smooth">HIPAA Compliance</a>
              <a href="#" className="block text-background/70 hover:text-background transition-smooth">Cookie Policy</a>
            </div>
          </div>
        </div>
        
        <Separator className="bg-background/20 mb-8" />
        
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-background/70 text-sm mb-4 md:mb-0">
            © 2024 dHIS. All rights reserved. Built with ❤️ for healthcare innovation.
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-background/70 hover:text-background hover:bg-background/10">
              <Github className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="text-background/70 hover:text-background hover:bg-background/10">
              <Twitter className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="text-background/70 hover:text-background hover:bg-background/10">
              <Linkedin className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
