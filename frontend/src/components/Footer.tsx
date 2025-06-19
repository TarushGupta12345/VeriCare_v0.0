
import { Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-med-charcoal text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
          <div className="flex items-center space-x-2">
            <img src="/lovable-uploads/8118c710-05bc-4957-b9f0-59413473c196.png" alt="VeriCare" className="w-10 h-10" />
            <span className="text-2xl font-bold">VeriCare</span>
          </div>
          
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
            <div className="flex items-center text-gray-300">
              <Mail className="h-4 w-4 mr-2 text-med-teal" />
              <span>vericareai@gmail.com</span>
            </div>
            <div className="flex items-center text-gray-300">
              <MapPin className="h-4 w-4 mr-2 text-med-teal" />
              <span>San Jose, CA</span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center space-x-6 text-sm text-gray-400 mt-8">
          <a href="#" className="hover:text-med-teal transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-med-teal transition-colors">Terms of Service</a>
        </div>
        
        <div className="border-t border-gray-700 pt-6 mt-6 text-center">
          <div className="text-gray-400 text-sm">
            © 2024 VeriCare AI, Inc. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
