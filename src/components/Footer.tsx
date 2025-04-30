import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 text-gray-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-5">
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold text-gray-900">
                Adapt<span className="text-blue-600">ED</span>
              </span>
            </div>
            <p className="text-gray-600 mb-4 max-w-md">
              Empowering students with personalized learning experiences through
              adaptive technology. Our platform evolves with you, ensuring
              optimal educational outcomes.
            </p>
          </div>

          {/* Navigation Sections */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {/* About Section */}
              <div>
                <h3 className="text-gray-900 font-semibold mb-4">About</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      to="/mission"
                      className="hover:text-blue-600 transition-colors"
                    >
                      Our Mission
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/team"
                      className="hover:text-blue-600 transition-colors"
                    >
                      Team
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/careers"
                      className="hover:text-blue-600 transition-colors"
                    >
                      Careers
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Support Section */}
              <div>
                <h3 className="text-gray-900 font-semibold mb-4">Support</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      to="/help"
                      className="hover:text-blue-600 transition-colors"
                    >
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/contact"
                      className="hover:text-blue-600 transition-colors"
                    >
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/faq"
                      className="hover:text-blue-600 transition-colors"
                    >
                      FAQ
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Legal Section */}
              <div>
                <h3 className="text-gray-900 font-semibold mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      to="/privacy"
                      className="hover:text-blue-600 transition-colors"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/terms"
                      className="hover:text-blue-600 transition-colors"
                    >
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/cookies"
                      className="hover:text-blue-600 transition-colors"
                    >
                      Cookie Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Notice */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-500 text-sm">
            © {currentYear} AdaptED. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
