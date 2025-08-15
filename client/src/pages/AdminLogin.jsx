import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, fetchApi } from '../api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetchApi(api.auth.login(), {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      localStorage.setItem('jwt_token', response.access_token);
      localStorage.setItem('adminUser', JSON.stringify({ name: response.name, email: credentials.email, role: response.role }));
      if (response.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/login'); 
      }
    } catch (err) {
      alert('Invalid credentials or not an admin');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar /> {/* Navbar at the top, full width */}
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
          <input
            type="email"
            name="email"
            value={credentials.email}
            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
            placeholder="Email"
            className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-slate-950"
            required
          />
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            placeholder="Password"
            className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-slate-950"
            required
          />
          <button
            type="submit"
            className="w-full bg-slate-950 text-white p-2 rounded hover:bg-slate-800 transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
      <Footer /> {/* Footer at the bottom */}
    </div>
  );
};

export default AdminLogin;