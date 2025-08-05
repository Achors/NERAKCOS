import { Link } from 'react-router-dom';
import { useState } from 'react';
import { FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import { useSearch } from '../pages/searchcontext'; 

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { setSearchTerm } = useSearch(); // Get setSearchTerm from context

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Update search term in context
  };

  return (
    <nav className="bg-slate-50 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center relative">
        {/* Left Section: Logo and NERAKCOS Link */}
        <div className="flex-shrink-0 flex items-center space-x-4">
          <Link to="/">
            <img
              src="/n_logo.png"
              alt="NERAKCOS Logo"
              className="h-10"
            />
          </Link>
          <Link
            to="/"
            className="absolute left-1/2 transform -translate-x-1/2 text-black text-xl font-bold font-montserrat hover:text-neutral-950 transition"
          >
            NERAKCOS
          </Link>
        </div>

        {/* Hamburger Menu for Mobile */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-black focus:outline-none"
          >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Right Section: Links and Search */}
        <div
          className={`${
            isOpen ? 'block' : 'hidden'
          } lg:flex lg:items-center lg:space-x-4 absolute lg:static top-16 right-4 lg:top-auto lg:right-auto bg-white lg:bg-transparent p-4 lg:p-0 rounded-lg shadow-lg lg:shadow-none w-64 lg:w-auto`}
        >
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
            to="/contact"
            className="block lg:inline-block text-black hover:text-neutral-950 font-montserrat py-2 lg:py-0"
          >
            Contact
          </Link>
          <Link
            to="/login"
            className="block lg:inline-block bg-transparent text-black px-4 py-2 rounded border-none hover:bg-slate-300 hover:bg-opacity-100 hover:backdrop-blur-sm transition duration-300 font-montserrat lg:mt-0 mt-2"
          >
            Login
          </Link>
          <div className="relative block lg:inline-block mt-2 lg:mt-0">
            <input
              type="text"
              placeholder="Search..."
              onChange={handleSearchChange} 
              className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full lg:w-48"
            />
            <FaSearch className="absolute left-3 top-2.5 text-gray-400" size={16} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;