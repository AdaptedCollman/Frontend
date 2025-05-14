import React from 'react';
import { FileText, CheckCircle, AlertCircle, Shield, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Terms = () => {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="flex items-center space-x-3 mb-8">
            <FileText className="w-6 h-6 text-blue-600" />
            <p className="text-gray-600 text-lg">
              Please read these terms of service carefully before using the AdaptED platform.
            </p>
          </div>

          <div className="space-y-8">
            <section className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <CheckCircle className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-semibold text-gray-900">Acceptance of Terms</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                By accessing or using our platform, you agree to be bound by these Terms of Service and all 
                applicable laws and regulations. If you do not agree with any of these terms, you are prohibited 
                from using or accessing this site.
              </p>
            </section>

            <section className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-semibold text-gray-900">User Responsibilities</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                You are responsible for maintaining the confidentiality of your account and for all activities 
                that occur under your account. You must notify us immediately of any unauthorized use of your 
                account or any other breach of security.
              </p>
            </section>

            <section className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <AlertCircle className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-semibold text-gray-900">Prohibited Activities</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Users are prohibited from engaging in any activity that disrupts or interferes with the proper 
                functioning of the platform, including but not limited to unauthorized access, data mining, 
                or any other activity that could harm the platform or other users.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms; 