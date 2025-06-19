
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, DollarSign, TrendingUp } from "lucide-react";
import { useState } from "react";

const ROICalculator = () => {
  const [monthlyBills, setMonthlyBills] = useState(10000);
  const [averageBillAmount, setAverageBillAmount] = useState(2500);
  
  const monthlyVolume = monthlyBills * averageBillAmount;
  const annualVolume = monthlyVolume * 12;
  const errorRate = 0.27; // Industry average 27% error rate
  const averageSavingsPerError = 0.15; // 15% average savings on errors
  const annualSavings = annualVolume * errorRate * averageSavingsPerError;
  const monthlySavings = annualSavings / 12;
  const roi = ((annualSavings - 120000) / 120000) * 100; // Assuming $120k annual cost

  return (
    <section id="savings" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-med-charcoal mb-4">
            Calculate Your Potential Savings
          </h2>
          <p className="text-xl text-med-muted max-w-3xl mx-auto">
            See how much your insurance company could save with AI-powered medical bill analysis.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <Card className="border-gray-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-xl text-med-charcoal">
                <Calculator className="h-5 w-5 mr-2 text-med-primary" />
                ROI Calculator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="monthly-bills" className="text-med-charcoal font-medium">
                  Monthly Medical Bills Processed
                </Label>
                <Input
                  id="monthly-bills"
                  type="number"
                  value={monthlyBills}
                  onChange={(e) => setMonthlyBills(Number(e.target.value))}
                  className="text-lg"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="average-amount" className="text-med-charcoal font-medium">
                  Average Bill Amount ($)
                </Label>
                <Input
                  id="average-amount"
                  type="number"
                  value={averageBillAmount}
                  onChange={(e) => setAverageBillAmount(Number(e.target.value))}
                  className="text-lg"
                />
              </div>

              <div className="bg-med-gray rounded-lg p-4">
                <div className="text-sm text-med-muted mb-2">Based on industry averages:</div>
                <div className="space-y-1 text-sm">
                  <div>• 27% of medical bills contain errors</div>
                  <div>• Average 15% savings on error corrections</div>
                  <div>• 94% error detection accuracy with AI</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-med-primary/20 shadow-lg bg-gradient-to-br from-white to-med-primary/5">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <DollarSign className="h-8 w-8 text-med-success mr-3" />
                  <h3 className="text-2xl font-bold text-med-charcoal">Your Potential Savings</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-med-success mb-2">
                      ${monthlySavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                    <div className="text-sm text-med-muted">Monthly Savings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-med-primary mb-2">
                      ${annualSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                    <div className="text-sm text-med-muted">Annual Savings</div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-med-muted">Annual Processing Volume</span>
                    <span className="font-semibold text-med-charcoal">
                      ${annualVolume.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-med-muted">Expected ROI</span>
                    <span className="font-semibold text-med-success">
                      {roi.toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-med-muted">Payback Period</span>
                    <span className="font-semibold text-med-teal">
                      {roi > 0 ? Math.ceil(12 / (roi / 100 * 12)) : 0} months
                    </span>
                  </div>
                </div>

                <Button className="w-full bg-med-primary hover:bg-med-primary/90 text-white">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Get Detailed Analysis
                </Button>
              </CardContent>
            </Card>

            <Card className="border-med-teal/20 bg-gradient-to-br from-white to-med-teal/5">
              <CardContent className="p-6">
                <h4 className="font-semibold text-med-charcoal mb-3">Why Insurance Companies Choose Us</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-med-success rounded-full mr-3"></div>
                    <span className="text-med-muted">Average 40% reduction in medical costs</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-med-teal rounded-full mr-3"></div>
                    <span className="text-med-muted">HIPAA compliant with enterprise security</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-med-primary rounded-full mr-3"></div>
                    <span className="text-med-muted">Seamless integration with existing systems</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ROICalculator;
