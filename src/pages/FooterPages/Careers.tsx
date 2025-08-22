
import { Briefcase, Rocket, Users, Star, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Careers = () => {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Careers</h1>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-8 space-y-8">
          <div className="flex items-start space-x-4">
            <Briefcase className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">Join Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">
                Join us in our mission to revolutionize education through technology. We're looking for passionate 
                individuals who want to make a real impact in the world of education.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <Rocket className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">Why Join Us?</h2>
              <p className="text-gray-600 leading-relaxed">
                At AdaptED, you'll work with cutting-edge technology, collaborate with passionate 
                professionals, and make a real impact on students' lives worldwide.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <Users className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">Open Positions</h2>
              <p className="text-gray-600 leading-relaxed">
                We're currently looking for talented individuals in software development, 
                educational content creation, and customer success roles.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <Star className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">Benefits</h2>
              <p className="text-gray-600 leading-relaxed">
                Enjoy competitive compensation, flexible work arrangements, professional development 
                opportunities, and a supportive work environment that values innovation and growth.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Careers; 