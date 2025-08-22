
import { HelpCircle, BookOpen, MessageSquare, Clock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQ = () => {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-8 space-y-8">
          <div className="flex items-start space-x-4">
            <HelpCircle className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">Common Questions</h2>
              <p className="text-gray-600 leading-relaxed">
                Find answers to common questions about AdaptED and our platform. If you don't find what you're 
                looking for, please don't hesitate to contact our support team.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <BookOpen className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">Getting Started</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">How do I create an account?</h3>
                  <p className="text-gray-600">
                    Click the "Sign Up" button on our homepage and follow the registration process. 
                    You'll need to provide your email address and create a password.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Is there a free trial?</h3>
                  <p className="text-gray-600">
                    Yes, we offer a 14-day free trial for all new users to explore our platform's features.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <MessageSquare className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">Platform Features</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">What subjects are available?</h3>
                  <p className="text-gray-600">
                    We currently offer courses in English, Mathematics, and Hebrew, with more subjects 
                    coming soon.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">How does the adaptive learning work?</h3>
                  <p className="text-gray-600">
                    Our platform uses advanced algorithms to analyze your learning patterns and adjust 
                    content difficulty accordingly.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <Clock className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">Technical Support</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">What devices are supported?</h3>
                  <p className="text-gray-600">
                    Our platform works on all modern web browsers and is optimized for both desktop 
                    and mobile devices.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">How can I get help?</h3>
                  <p className="text-gray-600">
                    You can reach our support team through the Help Center, email, or live chat 
                    during business hours.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ; 