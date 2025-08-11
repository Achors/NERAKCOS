import { useState, useEffect } from 'react';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaChartLine, FaBox, FaUsers } from 'react-icons/fa';
import DashboardOverview from './DashboardOverview';
import ProductManagement from './productmanagement';
import OrderTracking from './Ordertracking';
import UserManagement from './UserManagement';

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('adminUser');
    if (storedUser) setUser(JSON.parse(storedUser));
    else navigate('/admin/login');
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`bg-gray-800 text-white w-64 space-y-6 py-6 px-2 fixed inset-y-0 left-0 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:w-64 transition duration-200 ease-in-out z-20`}
      >
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden absolute top-4 right-4 text-white"
        >
          <FaTimes />
        </button>
        <nav className="space-y-6">
          <h2 className="text-xl font-semibold text-center">Admin Panel</h2>
          <ul className="space-y-2">
            <li>
              <Link
                to="/admin/dashboard"
                className="flex items-center p-2 hover:bg-gray-700 rounded"
                onClick={() => setIsSidebarOpen(false)}
              >
                <FaChartLine className="mr-3" /> Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/admin/products"
                className="flex items-center p-2 hover:bg-gray-700 rounded"
                onClick={() => setIsSidebarOpen(false)}
              >
                <FaBox className="mr-3" /> Products
              </Link>
            </li>
            <li>
              <Link
                to="/admin/orders"
                className="flex items-center p-2 hover:bg-gray-700 rounded"
                onClick={() => setIsSidebarOpen(false)}
              >
                <FaBox className="mr-3" /> Orders
              </Link>
            </li>
            <li>
              <Link
                to="/admin/users"
                className="flex items-center p-2 hover:bg-gray-700 rounded"
                onClick={() => setIsSidebarOpen(false)}
              >
                <FaUsers className="mr-3" /> Users
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden text-gray-600"
          >
            <FaBars />
          </button>
          <div className="flex items-center space-x-4">
            {user && (
              <span className="font-semibold">{user.name}</span>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center text-red-500 hover:text-red-700"
            >
              <FaSignOutAlt className="mr-2" /> Logout
            </button>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Routes>
            <Route path="/dashboard" element={<DashboardOverview />} />
            <Route path="/products" element={<ProductManagement />} />
            <Route path="/orders" element={<OrderTracking />} />
            <Route path="/users" element={<UserManagement />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;