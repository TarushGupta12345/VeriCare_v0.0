
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, ArrowLeft } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const UploadBill = () => {
  const navigate = useNavigate();
  const [patientName, setPatientName] = useState("");
  const [billFile, setBillFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBillFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!billFile || !patientName.trim()) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", billFile);

      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL?.concat("/analyze-bill") ||
          "http://localhost:8000/analyze-bill",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      console.log("Analysis result", data);
      toast("Bill analyzed successfully");
    } catch (err) {
      console.error(err);
      toast("Failed to analyze bill");
    } finally {
      setIsUploading(false);
      navigate("/dashboard");
    }
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-med-gray">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-med-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">VC</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-med-charcoal">Upload Medical Bill</h1>
                <p className="text-sm text-med-muted">AI-Powered Bill Analysis</p>
              </div>
            </div>
            <Button 
              onClick={handleBack}
              variant="outline" 
              className="border-med-primary text-med-primary hover:bg-med-primary hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-med-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-med-primary" />
              </div>
              <h2 className="text-2xl font-bold text-med-charcoal mb-2">Upload Medical Bill</h2>
              <p className="text-med-muted">
                Upload a medical bill and our AI will analyze it for potential savings and billing errors.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="patientName" className="text-med-charcoal">Patient Name</Label>
                <Input
                  id="patientName"
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="mt-1"
                  placeholder="Enter patient name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="billFile" className="text-med-charcoal">Medical Bill Document</Label>
                <div className="mt-1">
                  <Input
                    id="billFile"
                    type="file"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    required
                  />
                  <p className="text-sm text-med-muted mt-2">
                    Accepted formats: PDF, JPG, PNG, DOC, DOCX (Max 10MB)
                  </p>
                </div>
              </div>

              {billFile && (
                <div className="p-4 bg-med-teal/10 rounded-lg border border-med-teal/20">
                  <p className="text-sm text-med-charcoal">
                    <strong>Selected file:</strong> {billFile.name}
                  </p>
                  <p className="text-sm text-med-muted">
                    Size: {(billFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              )}

              <div className="flex space-x-4">
                <Button
                  type="button"
                  onClick={handleBack}
                  variant="outline"
                  className="flex-1 border-med-primary text-med-primary hover:bg-med-primary hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isUploading || !billFile || !patientName.trim()}
                  className="flex-1 bg-med-primary hover:bg-med-primary/90 text-white"
                >
                  {isUploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload & Analyze
                    </>
                  )}
                </Button>
              </div>
            </form>

            <div className="mt-8 p-4 bg-med-amber/10 rounded-lg border border-med-amber/20">
              <h3 className="font-semibold text-med-charcoal mb-2">What happens next?</h3>
              <ul className="text-sm text-med-muted space-y-1">
                <li>• Our AI will analyze the bill for coding errors and overcharges</li>
                <li>• We'll identify potential savings opportunities</li>
                <li>• You'll receive a detailed report with negotiation recommendations</li>
                <li>• Typical analysis takes 2-5 minutes</li>
              </ul>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default UploadBill;
