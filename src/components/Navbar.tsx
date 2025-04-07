// src/components/Navbar.tsx
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  return (
    <header className="fixed top-0 w-full bg-white dark:bg-black shadow-sm z-50">
      <div className=" mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-blue-600">
          AdaptED
        </Link>
        <nav className="flex gap-4">
          <Link to="/login">
            <Button variant="outline">Login</Button>
          </Link>
          <Link to="/register">
            <Button>Register</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;