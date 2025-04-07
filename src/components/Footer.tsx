// src/components/Footer.tsx
const Footer = () => {
    return (
      <footer className="bg-gray-200 dark:bg-gray-900 text-center text-sm text-gray-600 dark:text-gray-400 py-6">
        <p>&copy; {new Date().getFullYear()} AdaptED. All rights reserved.</p>
        <div className="mt-2 space-x-4">
          <a href="#" className="hover:underline">
            Privacy Policy
          </a>
          <a href="#" className="hover:underline">
            Terms of Service
          </a>
          <a href="#" className="hover:underline">
            Contact
          </a>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  