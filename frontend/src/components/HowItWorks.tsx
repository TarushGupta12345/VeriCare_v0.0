
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Brain, CheckCircle } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: Upload,
      title: "Upload Medical Bills",
      description: "Securely upload medical bills and documentation through our HIPAA-compliant platform."
    },
    {
      icon: Brain,
      title: "Advanced AI Analysis",
      description: "Our sophisticated AI algorithms analyze every line item, code, and charge for potential errors and discrepancies."
    },
    {
      icon: CheckCircle,
      title: "Detailed Report",
      description: "Receive comprehensive analysis reports highlighting errors, overcharges, and recommendations for cost savings."
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-med-charcoal mb-4">
            How VeriCare Works
          </h2>
          <p className="text-xl text-med-muted max-w-3xl mx-auto">
            Our streamlined process makes medical bill analysis simple and accurate.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <Card key={index} className="relative bg-white border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-med-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="h-8 w-8 text-med-primary" />
                </div>
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-med-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
                <CardTitle className="text-xl font-bold text-med-charcoal">
                  {step.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-med-muted leading-relaxed">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
