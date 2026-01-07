import React from 'react';
import { ArrowLeft } from 'lucide-react';

const Privacy: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
          <ArrowLeft size={16} /> Back
        </button>

        <h1 className="text-3xl font-black mb-4">Privacy Policy</h1>
        <p className="text-gray-600 mb-6">This is placeholder privacy policy content. Replace this with the final privacy policy text.</p>

        <section className="space-y-4">
          <h2 className="font-bold">1. Data Collection</h2>
          <p className="text-gray-600">We may collect certain information for analytics and product improvement purposes. (Dummy content)</p>

          <h2 className="font-bold">2. Data Usage</h2>
          <p className="text-gray-600">We use data to improve the service, personalize content, and for billing. (Dummy content)</p>

          <h2 className="font-bold">3. Contact</h2>
          <p className="text-gray-600">For privacy related questions, contact privacy@example.com</p>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
