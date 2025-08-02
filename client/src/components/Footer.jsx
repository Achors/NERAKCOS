import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-100 text-black py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-6">
          <div className="flex-1 text-center md:text-left">
            <h4 className="text-lg font-montserrat mb-2">Info</h4>
            <p className="font-montserrat">Shipping Info</p>
            <p className="font-montserrat">Returns Policy</p>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h4 className="text-lg font-montserrat mb-2">Follow Us</h4>
            <div className="flex flex-col items-center md:items-start space-y-2">
              <a href="https://facebook.com" className="hover:text-gray-300 flex items-center">
                <span className="mr-2">📘</span>Facebook
              </a>
              <a href="https://instagram.com" className="hover:text-gray-300 flex items-center">
                <span className="mr-2">📷</span>Instagram
              </a>
              <a href="https://twitter.com" className="hover:text-gray-300 flex items-center">
                <span className="mr-2">🐦</span>TikTok
              </a>
              <a href="https://pinterest.com" className="hover:text-gray-300 flex items-center">
                <span className="mr-2">📌</span>Pinterest
              </a>
              <a href="https://twitter.com" className="hover:text-gray-300 flex items-center">
                <span className="mr-2">🐦</span>Twitter
              </a>
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <Link to="/contact" className="font-montserrat text-lg text-2xl hover:text-blue-800">
              Contact Us
            </Link>
            <p className="font-montserrat">Email: info@nerakcos.com</p>
            <p className="font-montserrat">Phone: +1-234-567-890</p>
          </div>
        </div>
        <div className="text-center">
          <p className="font-montserrat">© 2025 NERAKCOS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;