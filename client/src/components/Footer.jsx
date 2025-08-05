import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTiktok, FaPinterestP, FaTwitter } from 'react-icons/fa'; // Import specific icons

const Footer = () => {
  return (
    <footer className="bg-slate-100 text-black py-6 mt-auto border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
          {/* Info Section */}
          <div className="text-center sm:text-left">
            <h4 className="text-lg sm:text-xl font-montserrat font-semibold mb-2 sm:mb-4 border-b-2 border-gray-700 pb-1 sm:pb-2">
              Info
            </h4>
            <ul className="space-y-1 sm:space-y-2">
              <li className="font-montserrat text-sm sm:text-base hover:text-gray-300">FAQs</li>
              <li className="font-montserrat text-sm sm:text-base hover:text-gray-300">Shipping Info</li>
              <li className="font-montserrat text-sm sm:text-base hover:text-gray-300">Returns Policy</li>
              <li className="font-montserrat text-sm sm:text-base hover:text-gray-300">
                <Link to="/admin" className="hover:text-slate-400">Admin Panel</Link>
              </li>
            </ul>
          </div>

          {/* Follow Us Section */}
          <div className="text-center sm:text-left">
            <h4 className="text-lg sm:text-xl font-montserrat font-semibold mb-2 sm:mb-4 border-b-2 border-gray-700 pb-1 sm:pb-2">
              Follow Us
            </h4>
            <ul className="space-y-1 sm:space-y-2">
              <li className="font-montserrat text-sm sm:text-base hover:text-gray-300 flex items-center">
                <FaFacebookF
                  className="mr-1 sm:mr-2"
                  size={window.innerWidth >= 640 ? 20 : 14}
                />{' '}
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                  Facebook
                </a>
              </li>
              <li className="font-montserrat text-sm sm:text-base hover:text-gray-300 flex items-center">
                <FaInstagram
                  className="mr-1 sm:mr-2"
                  size={window.innerWidth >= 640 ? 20 : 14}
                />{' '}
                <a
                  href="https://www.instagram.com/nerakcos_?utm_source=qr&igsh=MWNkeTQ2bmVqMjR0cQ=="
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
              </li>
              <li className="font-montserrat text-sm sm:text-base hover:text-gray-300 flex items-center">
                <FaTiktok
                  className="mr-1 sm:mr-2"
                  size={window.innerWidth >= 640 ? 20 : 14}
                />{' '}
                <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
                  TikTok
                </a>
              </li>
              <li className="font-montserrat text-sm sm:text-base hover:text-gray-300 flex items-center">
                <FaPinterestP
                  className="mr-1 sm:mr-2"
                  size={window.innerWidth >= 640 ? 20 : 14}
                />{' '}
                <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer">
                  Pinterest
                </a>
              </li>
              <li className="font-montserrat text-sm sm:text-base hover:text-gray-300 flex items-center">
                <FaTwitter
                  className="mr-1 sm:mr-2"
                  size={window.innerWidth >= 640 ? 20 : 14}
                />{' '}
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  Twitter
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Us Section */}
          <div className="text-center sm:text-left">
            <h4 className="text-lg sm:text-xl font-montserrat font-semibold mb-2 sm:mb-4 border-b-2 border-gray-700 pb-1 sm:pb-2">
              Contact Us
            </h4>
            <ul className="space-y-1 sm:space-y-2">
              <li className="font-montserrat text-sm sm:text-base">
                <Link to="/contact" className="hover:text-blue-400">Send a Message</Link>
              </li>
              <li className="font-montserrat text-sm sm:text-base">
                Email: <a href="mailto:info@nerakcos.com" className="hover:text-gray-300">info@nerakcos.com</a>
              </li>
              <li className="font-montserrat text-sm sm:text-base">
                Phone: <a href="tel:+1234567890" className="hover:text-gray-300">+1-234-567-890</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="text-center border-t border-gray-800 pt-2 sm:pt-4">
          <p className="font-montserrat text-gray-400 text-sm sm:text-base">© 2025 NERAKCOS.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;