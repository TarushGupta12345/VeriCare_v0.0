import React from 'react';
import { Upload, FileCheck, Mail, Phone } from 'lucide-react';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: <Upload className="h-10 w-10 text-blue-600" />,
      title: "Upload Your Bill",
      description: "Simply upload your itemized medical bill in PDF or image format."
    },
    {
      icon: <FileCheck className="h-10 w-10 text-blue-600" />,
      title: "AI Analysis",
      description: "Our AI analyzes errors to save as much money as possible."
    },
    {
      icon: <div className="flex space-x-2">
        <Phone className="h-10 w-10 text-blue-600" />
        <Mail className="h-10 w-10 text-blue-600" />
      </div>,
      title: "Dispute Process",
      description: "Our AI drafts a sample script to negotiate with the hospital, applicable either through email or phone."
    }
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold text-center text-blue-900 mb-4">How VeriCare Works</h2>
      <p className="text-center text-gray-700 mb-12 max-w-2xl mx-auto">
        Our AI-powered process makes it easy to identify and dispute medical billing errors, saving you time and money.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-md relative">
            {index < steps.length - 1 && (
              <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-blue-200 z-0"></div>
            )}
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                {step.icon}
              </div>
            </div>
            <h3 className="text-xl font-semibold text-center text-blue-800 mb-2">{step.title}</h3>
            <p className="text-center text-gray-700">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;