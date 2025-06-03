import React, { useState } from 'react';
import { 
  Upload, 
  FileCheck, 
  DollarSign, 
  Mail, 
  Shield, 
  Clock, 
  CheckCircle,
  ArrowRight,
  FileText,
  AlertCircle,
  Phone
} from 'lucide-react';
import UploadSection from './components/UploadSection';
import HowItWorks from './components/HowItWorks';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setUploadStatus('uploading');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/analyze-bill', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      const data = await response.json();
      setAnalysisResult(data.analysis);
      setUploadStatus('success');
    } catch (error) {
      console.error(error);
      setUploadStatus('error');
    }
  };

  const resetUpload = () => {
    setUploadedFile(null);
    setUploadStatus('idle');
    setAnalysisResult(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-blue-900 mb-6">
                Stop Overpaying for Medical Care
              </h1>
              <p className="text-xl text-gray-700 mb-8">
                VeriCare uses AI to analyze your medical bills, identify overcharges, and help you get your money back—all automatically.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center">
                  <Shield className="text-green-600 mr-2 h-5 w-5" />
                  <span className="text-gray-700">No Personal Info Saved</span>
                </div>
                <div className="flex items-center">
                  <Clock className="text-green-600 mr-2 h-5 w-5" />
                  <span className="text-gray-700">Results in Minutes</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="text-green-600 mr-2 h-5 w-5" />
                  <span className="text-gray-700">Get Your Money</span>
                </div>
              </div>
              <a 
                href="#upload-section" 
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Upload Your Bill
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Medical bill analysis" 
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </section>

        {/* Upload Section */}
        <section id="upload-section" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <UploadSection 
            uploadedFile={uploadedFile}
            uploadStatus={uploadStatus}
            analysisResult={analysisResult}
            onFileUpload={handleFileUpload}
            onReset={resetUpload}
          />
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-blue-50 rounded-3xl">
          <HowItWorks />
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-blue-900 mb-12">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-blue-800 mb-3">How does VeriCare work?</h3>
              <p className="text-gray-700">Our AI analyzes the bill for all errors and overcharges. We draft a message (either email or phone) to the billing department to negotiate the costs.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-blue-800 mb-3">Is my medical information secure?</h3>
              <p className="text-gray-700">Absolutely. We don't save any of your personally identifiable information (PII). The "Veri" in VeriCare is derived from <i>verus</i>, the Latin word for truth or trust. You can trust VeriCare with your medical data.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-blue-800 mb-3">How long does the process take?</h3>
              <p className="text-gray-700">Our AI analysis takes just minutes. The hospital's response time varies, but most users see results within 2-3 weeks.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-blue-800 mb-3">What if the hospital rejects my dispute?</h3>
              <p className="text-gray-700">If the hospital rejects your dispute, you can always resubmit your itemized bill and try again. In our v0, we don't have any builtin functionality to help with this, but in future versions, we will absolutely address it.</p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-blue-50 rounded-3xl">
          <h2 className="text-3xl font-bold text-center text-blue-900 mb-12">Contact Us</h2>
          <div className="max-w-lg mx-auto text-center">
            <p className="text-gray-700 mb-8">
              Have questions? We're here to help! Reach out to us at:
            </p>
            <a 
              href="mailto:vericareai@gmail.com" 
              className="text-xl text-blue-600 hover:text-blue-800 transition-colors"
            >
              vericareai@gmail.com
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;