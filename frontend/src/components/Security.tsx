
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

const Security = () => {
  return (
    <section id="security" className="py-20 bg-med-gray">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-med-charcoal mb-4">
            HIPAA Compliant Security
          </h2>
          <p className="text-xl text-med-muted max-w-3xl mx-auto">
            Your medical data is protected by HIPAA-compliant security measures and strict privacy standards.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="bg-white border-gray-200 text-center shadow-lg">
            <CardHeader>
              <div className="w-24 h-24 bg-med-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-12 w-12 text-med-primary" />
              </div>
              <CardTitle className="text-3xl font-bold text-med-charcoal">
                HIPAA Compliant
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-12">
              <p className="text-lg text-med-muted leading-relaxed mb-8 max-w-2xl mx-auto">
                Full HIPAA compliance with comprehensive Business Associate Agreements, 
                end-to-end encryption, and regular security audits to protect your sensitive medical data.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-6 bg-med-gray rounded-lg">
                  <h4 className="font-semibold text-med-charcoal mb-2">Secure Data Handling</h4>
                  <p className="text-sm text-med-muted">All medical data is encrypted and processed according to HIPAA standards</p>
                </div>
                <div className="p-6 bg-med-gray rounded-lg">
                  <h4 className="font-semibold text-med-charcoal mb-2">Access Controls</h4>
                  <p className="text-sm text-med-muted">Role-based permissions and audit logging for all data access</p>
                </div>
                <div className="p-6 bg-med-gray rounded-lg">
                  <h4 className="font-semibold text-med-charcoal mb-2">Regular Audits</h4>
                  <p className="text-sm text-med-muted">Continuous monitoring and compliance assessments</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-12 bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-med-charcoal mb-4">Backed By:</h3>
              <div className="flex justify-center items-center">
                <img src="/lovable-uploads/b798cc0d-58f5-4332-9ca8-52184ac28476.png" alt="3M" className="h-16" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Security;
