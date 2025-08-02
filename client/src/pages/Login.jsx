import { useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
    phone: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error on input change
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isSignUp) {
      // Sign In validation
      if (!formData.email || !formData.password) {
        setError('Please fill in all fields');
        return;
      }
      console.log('Sign In:', formData.email, formData.password);
    } else {
      // Sign Up validation
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.phone) {
        setError('Please fill in all fields');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      console.log('Sign Up:', formData);
    }
  };

  return (
  <div className="min-h-screen bg-gray-100 flex flex-col justify-between">
    <Navbar />
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 sm:p-8">
        <h2 className="text-3xl font-montserrat text-center mb-6 text-gray-800">
          {isSignUp ? 'Create Account' : 'Sign In'}
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
              />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
              />
            </>
          )}
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
          />
          {isSignUp && (
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
            />
          )}
          {error && <p className="text-red-500 text-center">{error}</p>}
          <div className="flex justify-between mb-4 space-x-4">
            <button
              type="submit"
              className={`w-1/2 px-4 py-2 rounded ${!isSignUp ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'} hover:bg-gray-800 hover:text-white transition`}
            >
              Sign In
            </button>
            <button
              type="submit"
              onClick={() => setIsSignUp(true)}
              className={`w-1/2 px-4 py-2 rounded ${isSignUp ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'} hover:bg-gray-800 hover:text-white transition`}
            >
              Sign Up
            </button>
          </div>
          {isSignUp ? (
            <button
              type="button"
              onClick={() => setIsSignUp(false)}
              className="w-full mt-2 text-gray-600 hover:text-gray-800 text-center block"
            >
              Already have an account? Login
            </button>
          ) : (
            <Link to="/" className="w-full mt-2 text-gray-600 hover:text-gray-800 text-center block">
              Back to Home
            </Link>
          )}
        </form>
      </div>
    </div>
    <Footer />
  </div>
);
};

export default Login;