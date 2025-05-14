import React from 'react';
import { Target, Lightbulb, Sparkles, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Mission = () => {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Mission</h1>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-8 space-y-8">
          <div className="flex items-start space-x-4">
            <Target className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">Revolutionizing Education</h2>
              <p className="text-gray-600 leading-relaxed">
                At AdaptED, our mission is to revolutionize education through personalized learning experiences. 
                We believe every student deserves an education that adapts to their unique needs, learning style, 
                and pace.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <Lightbulb className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">Innovative Approach</h2>
              <p className="text-gray-600 leading-relaxed">
                Our platform combines cutting-edge technology with proven educational methodologies to 
                create a truly adaptive learning environment that evolves with each student's progress.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <Sparkles className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">Future of Learning</h2>
              <p className="text-gray-600 leading-relaxed">
                We're committed to making quality education accessible to all, leveraging technology to 
                create engaging, effective, and personalized learning experiences that prepare students 
                for success in an ever-changing world.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mission; 