
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, FileText, MessageSquare, Shield, TrendingUp, Zap } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Brain,
      title: "Advanced AI Analysis",
      description: "Our machine learning algorithms analyze thousands of billing patterns to identify errors, overcharges, and coding inconsistencies with 94% accuracy."
    },
    {
      icon: FileText,
      title: "Comprehensive Error Detection",
      description: "Detects duplicate charges, incorrect procedure codes, pricing discrepancies, and unbundling violations across all medical specialties."
    },
    {
      icon: MessageSquare,
      title: "Automated Negotiation Scripts",
      description: "Generate personalized, legally-compliant negotiation scripts based on detected errors and historical success rates with specific providers."
    },
    {
      icon: TrendingUp,
      title: "ROI Analytics",
      description: "Real-time dashboards showing cost savings, error trends, and negotiation success rates to maximize your return on investment."
    },
    {
      icon: Shield,
      title: "HIPAA Compliant",
      description: "Enterprise-grade security with end-to-end encryption, audit trails, and full HIPAA compliance to protect sensitive medical data."
    },
    {
      icon: Zap,
      title: "Rapid Processing",
      description: "Process thousands of bills in minutes, not weeks. Our scalable infrastructure handles peak loads with sub-second response times."
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-med-charcoal mb-4">
            Powerful Features for Enterprise Insurance
          </h2>
          <p className="text-xl text-med-muted max-w-3xl mx-auto">
            Our AI-powered platform delivers comprehensive medical bill analysis with enterprise-grade security and scalability.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
            >
              <CardHeader>
                <div className="w-12 h-12 bg-med-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-med-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-med-primary" />
                </div>
                <CardTitle className="text-xl font-semibold text-med-charcoal">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-med-muted leading-relaxed">
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
