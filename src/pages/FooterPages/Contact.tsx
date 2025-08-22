
import { Mail, Clock, MessageSquare, Phone, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Contact = () => {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8">
          <p className="text-gray-600 text-lg mb-8 text-center">
            Have questions or feedback? We'd love to hear from you. Our team is here to help and will get back to you as soon as possible.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-4">
                <Mail className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Email Us</h2>
              </div>
              <p className="text-gray-600">support@adapted.com</p>
              <p className="text-gray-500 text-sm mt-2">We'll respond within 24 hours</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-4">
                <Clock className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Office Hours</h2>
              </div>
              <p className="text-gray-600">Monday - Friday</p>
              <p className="text-gray-600">9:00 AM - 5:00 PM EST</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-4">
                <MessageSquare className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Live Chat</h2>
              </div>
              <p className="text-gray-600">Available during office hours</p>
              <p className="text-gray-500 text-sm mt-2">For immediate assistance</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-4">
                <Phone className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Phone Support</h2>
              </div>
              <p className="text-gray-600">+1 (555) 123-4567</p>
              <p className="text-gray-500 text-sm mt-2">For urgent matters</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 