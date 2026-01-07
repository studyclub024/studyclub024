import React from 'react';
import { ArrowLeft } from 'lucide-react';

const Terms: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
          <ArrowLeft size={16} /> Back
        </button>

        <h1 className="text-3xl font-black mb-4">Terms of Service</h1>
        <p className="text-gray-600 mb-6">This is placeholder terms of service content. Replace this with your legal terms.</p>

        <section className="space-y-4">
          <h2 className="font-bold">1. Acceptance</h2>
          <p className="text-gray-600">By using the service, you agree to the following terms. (Dummy content)</p>

          <h2 className="font-bold">2. Use of Service</h2>
          <p className="text-gray-600">Users should not misuse the platform. (Dummy content)</p>

          <h2 className="font-bold">3. Liability</h2>
          <p className="text-gray-600">Our liability is limited as described here. (Dummy content)</p>
        </section>
      </div>
    </div>
  );
};

export default Terms;
