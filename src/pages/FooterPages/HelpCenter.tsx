
import { HelpCircle, BookOpen, Clock, MessageSquare, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const HelpCenter = () => {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="flex items-center space-x-3 mb-8">
            <HelpCircle className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-semibold text-gray-900">Welcome to AdaptED Support</h2>
          </div>
          
          <p className="text-gray-600 leading-relaxed mb-8">
            Here you'll find comprehensive guides and documentation to help you start working with our platform 
            as quickly as possible, as well as support if you get stuck. Let's get you started!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Documentation</h3>
              </div>
              <p className="text-gray-600">
                Detailed guides and tutorials for using all features of our platform.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Support</h3>
              </div>
              <p className="text-gray-600">
                Get help from our support team for any questions or issues.
              </p>
            </div>
          </div>

          <div className="mt-8 p-6 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-3 mb-4">
              <Clock className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Coming Soon</h3>
            </div>
            <p className="text-gray-600">
              Our help center documentation is currently being updated. Please check back soon for detailed guides 
              and tutorials.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter; 