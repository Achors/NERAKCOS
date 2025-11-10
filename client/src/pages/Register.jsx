import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { api, fetchApi } from '../api';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState({ password: false, confirmPassword: false });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error on input change
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.phone) {
    setError('Please fill in all fields');
    return;
  }

  if (formData.password !== formData.confirmPassword) {
    setError('Passwords do not match');
    return;
  }

  try {
    await fetchApi(api.auth.register(), {
      method: 'POST',
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      }),
    });

    setError('');
    alert('Thanks for registering! Please check your email to verify your account.');
    navigate('/login'); // Optional, send them to login page
  } catch (err) {
    setError(err.message || 'Registration failed');
  }
};

  const handleGoogleRegister = async (response) => {
  const token = response.credential;
  try {
    const data = await fetchApi('http://localhost:5000/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    // Save backend-issued JWT and user info
    localStorage.setItem('jwt_token', data.access_token);
    localStorage.setItem('user', JSON.stringify({
      name: data.name,
      email: data.email,
      role: data.role
    }));

    // Redirect based on role
    if (data.role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/');
    }
    setError('');
  } catch (err) {
    setError(err.message || 'Google registration failed');
  }
};
useEffect(() => {
  /* global google */
  if (window.google) {
    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleGoogleRegister,
    });
    google.accounts.id.renderButton(
      document.getElementById('googleRegisterDiv'),
      { theme: 'outline', size: 'large' }
    );
  }
}, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-between">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 sm:p-8">
          <h2 className="text-3xl font-montserrat text-center mb-6 text-gray-800">Create Account</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
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
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
            />
            <div className="relative">
              <input
                type={showPassword.password ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black pr-10"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('password')}
                className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
              >
                {showPassword.password ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword.confirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black pr-10"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirmPassword')}
                className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
              >
                {showPassword.confirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <button
              type="submit"
              className="w-full px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
            >
              Create Account
            </button>
            <div className="my-2 text-center">or</div>
            <div id="googleRegisterDiv" className="flex justify-center"></div>
            <Link to="/login" className="w-full mt-2 text-gray-600 hover:text-gray-800 text-center block">
              Already have an account? Login
            </Link>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Register;