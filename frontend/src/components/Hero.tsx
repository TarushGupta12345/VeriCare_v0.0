
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";

const Hero = () => {
  return (
    <section className="bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 min-h-screen flex items-center">
      <div className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 bg-med-primary/10 rounded-full mb-6">
              <Zap className="h-4 w-4 text-med-primary mr-2" />
              <span className="text-sm font-medium text-med-primary">AI-Powered Medical Bill Analysis</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-med-charcoal mb-6 leading-tight">
              Reduce Medical Costs with AI
            </h1>
            
            <p className="text-xl text-med-muted mb-8 leading-relaxed">
              Our advanced AI analyzes medical bills to detect billing errors, coding mistakes, and overcharges. 
              Save money annually while ensuring compliance and accuracy for your insurance operations.
            </p>
          </div>

          <div className="animate-slide-up lg:animate-fade-in">
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-med-charcoal">VeriCare AI Platform</h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-med-success rounded-full"></div>
                      <span className="text-sm text-med-success">Active</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-med-gray rounded-lg">
                      <div className="flex items-center space-x-3">
                        <img src="/lovable-uploads/dadcb6d4-b96a-4832-8730-e803e8b44cc9.png" alt="VeriCare" className="h-5 w-5" />
                        <span className="text-sm font-medium text-med-charcoal">Medical Bills Analyzed</span>
                      </div>
                      <span className="text-lg font-bold text-med-primary">Secure Processing</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-med-success/10 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <img src="/lovable-uploads/dadcb6d4-b96a-4832-8730-e803e8b44cc9.png" alt="VeriCare" className="h-5 w-5" />
                        <span className="text-sm font-medium text-med-charcoal">Error Detection</span>
                      </div>
                      <span className="text-lg font-bold text-med-success">AI-Powered</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-med-amber/10 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 bg-med-amber rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-med-charcoal">$</span>
                        </div>
                        <span className="text-sm font-medium text-med-charcoal">Cost Reduction</span>
                      </div>
                      <span className="text-lg font-bold text-med-amber">Optimized</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-med-primary to-med-teal rounded-full flex items-center justify-center shadow-lg">
                <div className="text-white text-center">
                  <div className="text-xs font-medium">AI</div>
                  <div className="text-xs">Powered</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
