
import { Users, Award, Heart, Sparkles } from 'lucide-react';

const Team = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Team</h1>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="flex items-center space-x-3 mb-8">
            <Users className="w-6 h-6 text-blue-600" />
            <p className="text-gray-600 text-lg">
              Meet the passionate individuals behind AdaptED, dedicated to transforming education through technology.
            </p>
          </div>

          <div className="space-y-8">
            <section className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Award className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-semibold text-gray-900">Leadership</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Our leadership team brings together decades of experience in education technology, 
                software development, and educational research to drive our mission forward.
              </p>
            </section>

            <section className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Heart className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-semibold text-gray-900">Our Values</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                We believe in innovation, accessibility, and student success. Every team member 
                is committed to creating an educational platform that makes a real difference in students' lives.
              </p>
            </section>

            <section className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Sparkles className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-semibold text-gray-900">Join Our Team</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                We're always looking for talented individuals who share our passion for education 
                and technology. Check out our careers page for current opportunities.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team; 