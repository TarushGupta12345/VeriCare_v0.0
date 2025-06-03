import React, { useRef, useState } from 'react';
import { Upload, AlertCircle, RefreshCw } from 'lucide-react';

interface UploadSectionProps {
  uploadStatus: 'idle' | 'uploading' | 'success' | 'error';
  analysisResult: string | null;
  onFileUpload: (file: File) => void;
  onReset: () => void;
}

const UploadSection: React.FC<UploadSectionProps> = ({
  uploadStatus,
  analysisResult,
  onFileUpload,
  onReset
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-blue-900 mb-6">
        Upload Your Medical Bill
      </h2>
      <p className="text-center text-gray-700 mb-8">
        Simply upload your itemized medical bill and our AI will analyze it for errors and overcharges.
      </p>

      {uploadStatus === 'idle' && (
        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Drag and drop your bill here
          </h3>
          <p className="text-gray-600 mb-4">
            or
          </p>
          <button
            onClick={handleButtonClick}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Files
          </button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleChange}
          />
          <p className="mt-4 text-sm text-gray-500">
            Supported formats: PDF, JPG, PNG
          </p>
        </div>
      )}

      {uploadStatus === 'uploading' && (
        <div className="border-2 rounded-lg p-8 text-center bg-blue-50 border-blue-200">
          <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Analyzing your bill...
          </h3>
          <p className="text-gray-600">
            This will just take a moment
          </p>
          <div className="mt-6 w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-blue-600 h-2.5 rounded-full w-3/4 animate-pulse"></div>
          </div>
        </div>
      )}

      {uploadStatus === 'success' && analysisResult && (
        <div className="border rounded-lg p-8 bg-white shadow">
          <pre className="whitespace-pre-wrap text-sm text-gray-700 mb-6">
            {analysisResult}
          </pre>
          <button
            onClick={onReset}
            className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Upload Another Bill
          </button>
        </div>
      )}

      {uploadStatus === 'error' && (
        <div className="border-2 rounded-lg p-8 text-center bg-red-50 border-red-200">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Something went wrong
          </h3>
          <p className="text-gray-600 mb-6">
            We couldn't process your bill. Please try again or contact support.
          </p>
          <button
            onClick={onReset}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadSection;