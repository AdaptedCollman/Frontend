import React from 'react';
import { Shield, Database, Lock, Eye, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link
          to="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8">
          <p className="text-gray-600 text-lg mb-8">
            At AdaptED, we take your privacy seriously. This policy describes how we collect, use, and protect your personal information.
          </p>

          <div className="space-y-8">
            <section className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Database className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-semibold text-gray-900">Information We Collect</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                We collect information that you provide directly to us, including your name, email address, and educational data.
                This information helps us provide and improve our services to better serve your learning needs.
              </p>
            </section>

            <section className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Eye className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-semibold text-gray-900">How We Use Your Information</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                We use your information to provide and improve our services, personalize your learning experience, 
                and communicate with you about updates and improvements to our platform.
              </p>
            </section>

            <section className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Lock className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-semibold text-gray-900">Data Protection</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                We implement robust security measures to protect your personal information from unauthorized access, 
                alteration, disclosure, or destruction.
              </p>
            </section>

            <section className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-semibold text-gray-900">Your Rights</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                You have the right to access, correct, or delete your personal information. You can also request 
                a copy of your data or withdraw your consent at any time.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy; 