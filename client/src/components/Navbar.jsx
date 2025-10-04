import { Link } from 'react-router-dom';
import { useState } from 'react';
import { FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import { useSearch } from '../context/searchcontext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { setSearchTerm } = useSearch();
  const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Delay closing the dropdown to allow clicking
  const handleMouseLeave = () => {
    setTimeout(() => setIsLoginDropdownOpen(false), 500); // Increased to 500ms
  };

  // Toggle dropdown on click for better control
  const toggleLoginDropdown = (e) => {
    e.preventDefault();
    setIsLoginDropdownOpen((prev) => !prev);
  };

  return (
    <nav className="bg-slate-50 p-4 shadow-md relative z-20">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left Section: Logo and NERAKCOS Link */}
        <div className="flex-shrink-0 flex items-center space-x-4">
          <Link to="/">
            <img src="/n_logo.png" alt="NERAKCOS Logo" className="h-10" />
          </Link>
          <Link
            to="/"
            className="text-black text-xl font-bold font-montserrat hover:text-neutral-950 transition"
          >
            NERAKCOS
          </Link>
        </div>

        {/* Hamburger Menu for Mobile */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-black focus:outline-none p-1"
            aria-label="Toggle menu"
          >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Right Section: Links and Search */}
        <div
          className={`${
            isOpen ? 'block' : 'hidden'
          } lg:flex lg:items-center lg:space-x-4 absolute lg:static top-16 right-0 lg:top-auto lg:right-auto bg-white lg:bg-transparent p-4 lg:p-0 rounded-lg shadow-lg lg:shadow-none w-64 lg:w-auto transition-all duration-300 ease-in-out`}
        >
          <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4 w-full">
            <Link
              to="/shop"
              className="block lg:inline-block text-black hover:text-neutral-950 font-montserrat py-2 lg:py-0"
            >
              Shop
            </Link>
            <Link
              to="/about"
              className="block lg:inline-block text-black hover:text-neutral-950 font-montserrat py-2 lg:py-0"
            >
              About
            </Link>
            <Link
              to="/blog"
              className="block lg:inline-block text-black hover:text-neutral-950 font-montserrat py-2 lg:py-0"
            >
              Blog
            </Link>
            {/* Login Dropdown */}
            <div className="relative">
              <button
                onClick={toggleLoginDropdown} // Click to toggle
                onMouseEnter={() => setIsLoginDropdownOpen(true)} // Hover to open
                onMouseLeave={handleMouseLeave} // Delay close
                className="block lg:inline-block bg-transparent text-black px-4 py-2 rounded border-none hover:bg-slate-300 hover:bg-opacity-100 hover:backdrop-blur-sm transition duration-300 font-montserrat"
              >
                Login
              </button>
              {isLoginDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-30"
                  onMouseEnter={() => setIsLoginDropdownOpen(true)} // Keep open while hovering options
                  onMouseLeave={handleMouseLeave} // Delay close when leaving options
                >
                  <Link
                    to="/admin/login"
                    onClick={() => setIsLoginDropdownOpen(false)}
                    className="block px-4 py-2 text-black hover:bg-gray-100 font-montserrat"
                  >
                    Admin
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => setIsLoginDropdownOpen(false)}
                    className="block px-4 py-2 text-black hover:bg-gray-100 font-montserrat"
                  >
                    Client
                  </Link>
                </div>
              )}
            </div>
            <div className="relative mt-2 lg:mt-0 w-full lg:w-48">
              <input
                type="text"
                placeholder="Search..."
                onChange={handleSearchChange}
                className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
              <FaSearch className="absolute left-3 top-2.5 text-gray-400" size={16} />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;