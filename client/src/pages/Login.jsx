import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { api, fetchApi } from '../api';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();


  // Get loadCart from CartContext
  const { loadCart } = useCart();
  

 

 const handleGoogleLogin = async (response) => {
  const token = response.credential;
  try {
    const data = await fetchApi('http://localhost:5000/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    localStorage.setItem('jwt_token', data.access_token);
    localStorage.setItem('user', JSON.stringify({ name: data.name, email: data.email, role: data.role }));

    // MERGE GUEST CART
    await loadCart();

    if (data.role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/');
    }
    setError('');
  } catch (err) {
    setError(err.message || 'Google login failed');
  }
};

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!formData.email || !formData.password) {
    setError('Please fill in all fields');
    return;
  }

  try {
    const response = await fetchApi(api.auth.login(), {
      method: 'POST',
      body: JSON.stringify({ email: formData.email, password: formData.password }),
    });

    // Save user session
    localStorage.setItem('jwt_token', response.access_token);
    localStorage.setItem('user', JSON.stringify({ name: response.name, email: formData.email, role: response.role }));

    // MERGE GUEST CART
    await loadCart();

    // Redirect
    if (response.role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/');
    }
    setError('');
  } catch (err) {
    setError(err.message || 'Login failed');
  }
};

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-between">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 sm:p-8">
          <h2 className="text-3xl font-montserrat text-center mb-6 text-gray-800">Client Sign In</h2>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
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
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black pr-10"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <button
              type="submit"
              className="w-full px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
            >
              Sign In
            </button>
            <div className="my-4 text-center">or</div>
            <div id="g_id_onload"
                 data-client_id="YOUR_GOOGLE_CLIENT_ID"  // Replace with your Google Client ID
                 data-callback="handleGoogleLogin"
                 data-auto_prompt="false">
            </div>
            <div className="g_id_signin"
                 data-type="standard"
                 data-size="large"
                 data-theme="outline"
                 data-text="sign_in_with"
                 data-shape="rectangular"
                 data-logo_alignment="left">
            </div>
            <Link to="/register" className="w-full mt-2 text-gray-600 hover:text-gray-800 text-center block">
              Don’t have an account? Register
            </Link>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;