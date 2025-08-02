import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-slate-50 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center relative">
        {/* Left Section: Logo */}
        <div className="flex-shrink-0">
          <img
            src="/n_logo.png"
            alt="NERAKCOS Logo"
            className="h-10"
          />
        </div>

        {/* Center Section: Business Name */}
        <div className="absolute left-1/2 transform -translate-x-1/2 text-black text-x1 font-bold ">
          NERAKCOS
        </div>

        {/* Right Section: Login, Search, Links */}
        <div className="flex items-center space-x-4">
          <Link to="/shop" className="text-black hover:text-neutral-950 font-montserrat">Shop</Link>
          <Link to="/about" className="text-black hover:text-neutral-950 font-montserrat">About</Link>
          <Link to="/contact" className="text-black hover:text-neutral-950 font-montserrat">Contact</Link>
          <Link to="/login" className="bg-transparent text-black px-4 py-2 rounded border-none hover:bg-slate-300 hover:bg-opacity-100 hover:backdrop-blur-sm transition duration-300 font-montserrat">
            Login
          </Link>
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute left-3 top-2 text-gray-400">🔍</span>
          </div>          
        </div>
      </div>
    </nav>
  );
};

export default Navbar;