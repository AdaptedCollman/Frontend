
import { Cookie, Shield, Settings, Eye, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cookies = () => {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Cookie Policy</h1>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-8 space-y-8">
          <div className="flex items-start space-x-4">
            <Cookie className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">About Cookies</h2>
              <p className="text-gray-600 leading-relaxed">
                Learn about how we use cookies and similar technologies on our platform. We are committed 
                to being transparent about our use of cookies and protecting your privacy.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <Shield className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">What Are Cookies?</h2>
              <p className="text-gray-600 leading-relaxed">
                Cookies are small text files that are stored on your device when you visit our website. 
                They help us provide you with a better experience and enable certain features to work properly.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <Eye className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">How We Use Cookies</h2>
              <p className="text-gray-600 leading-relaxed">
                We use cookies to remember your preferences, analyze how you use our platform, 
                and improve your experience. This includes essential cookies for security and 
                functionality, as well as analytics cookies to help us understand how our platform is used.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <Settings className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">Managing Cookies</h2>
              <p className="text-gray-600 leading-relaxed">
                You can control and manage cookies through your browser settings. However, please note 
                that disabling certain cookies may affect the functionality of our platform. You can 
                also use our cookie preferences center to manage your preferences.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cookies; 