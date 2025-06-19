
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src="/lovable-uploads/dadcb6d4-b96a-4832-8730-e803e8b44cc9.png" alt="VeriCare" className="w-8 h-8" />
            <span className="text-xl font-bold text-med-charcoal">VeriCare</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-med-muted hover:text-med-primary transition-colors">Features</a>
            <a href="#how-it-works" className="text-med-muted hover:text-med-primary transition-colors">How It Works</a>
            <a href="#security" className="text-med-muted hover:text-med-primary transition-colors">Security</a>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Button asChild variant="outline" className="border-med-primary text-med-primary hover:bg-med-primary hover:text-white">
              <Link to="/login">Login</Link>
            </Button>
            <Button className="bg-med-primary hover:bg-med-primary/90 text-white">
              Request Demo
            </Button>
          </div>

          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6 text-med-charcoal" />
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <nav className="flex flex-col space-y-4">
              <a href="#features" className="text-med-muted hover:text-med-primary transition-colors">Features</a>
              <a href="#how-it-works" className="text-med-muted hover:text-med-primary transition-colors">How It Works</a>
              <a href="#security" className="text-med-muted hover:text-med-primary transition-colors">Security</a>
              <div className="flex flex-col space-y-2 pt-4">
                <Button asChild variant="outline" className="border-med-primary text-med-primary">
                  <Link to="/login">Login</Link>
                </Button>
                <Button className="bg-med-primary text-white">Request Demo</Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
