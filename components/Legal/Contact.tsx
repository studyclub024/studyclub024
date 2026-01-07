import React from 'react';
import { ArrowLeft } from 'lucide-react';

const Contact: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
          <ArrowLeft size={16} /> Back
        </button>

        <h1 className="text-3xl font-black mb-4">Contact Us</h1>
        <p className="text-gray-600 mb-6">This is placeholder contact information. Update with your contact details.</p>

        <section className="space-y-4">
          <h2 className="font-bold">Email</h2>
          <p className="text-gray-600">support@example.com</p>

          <h2 className="font-bold">Address</h2>
          <p className="text-gray-600">123 StudyClub24 Road, Education City</p>

          <h2 className="font-bold">Phone</h2>
          <p className="text-gray-600">+91 00000 00000</p>
        </section>
      </div>
    </div>
  );
};

export default Contact;
