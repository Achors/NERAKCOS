import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, fetchApi } from '../api';

const AdminPanel = () => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category_id: '',
    image_urls: [''],
  });
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [orders, setOrders] = useState([]);
  const [collaborationRequests, setCollaborationRequests] = useState([]);
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState([]); // For local file uploads
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catsData = await fetchApi(api.categories.list());
        setCategories(catsData);
        const ordersData = await fetchApi(api.orders.list());
        setOrders(ordersData);
        const messagesData = await fetchApi(api.collaborate.list());
        const collabRequests = messagesData.filter(msg => 
          msg.subject && msg.subject.toLowerCase().includes('collaboration')
        );
        setCollaborationRequests(collabRequests);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    fetchData();

    const token = localStorage.getItem('token');
    if (!token) navigate('/login');
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (index, value) => {
    setProduct((prev) => {
      const newImages = [...prev.image_urls];
      newImages[index] = value;
      return { ...prev, image_urls: newImages };
    });
  };

  const addImageField = () => {
    setProduct((prev) => ({ ...prev, image_urls: [...prev.image_urls, ''] }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      let imageUrls = [...product.image_urls.filter(url => url)];

      // Handle file uploads
      if (files.length > 0) {
        const formData = new FormData();
        files.forEach(file => formData.append('images', file));
        formData.append('product', JSON.stringify({
          ...product,
          price: parseFloat(product.price),
          stock: parseInt(product.stock),
        }));

        const uploadResponse = await fetch('/api/upload-images', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        const uploadResult = await uploadResponse.json();
        if (uploadResult.urls) {
          imageUrls = [...imageUrls, ...uploadResult.urls];
        }
      }

      const response = await fetchApi(api.products.create(), {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...product,
          price: parseFloat(product.price),
          stock: parseInt(product.stock),
          image_urls: imageUrls,
        }),
      });
      setMessage('Product added successfully!');
      setProduct({ name: '', description: '', price: '', stock: '', category_id: '', image_urls: [''] });
      setFiles([]);
    } catch (err) {
      setMessage(`Error: ${err.message || 'Failed to add product'}`);
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await fetchApi(api.categories.create(), {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(newCategory),
      });
      setNewCategory({ name: '', description: '' });
      const data = await fetchApi(api.categories.list());
      setCategories(data);
      setMessage('Category added successfully!');
    } catch (err) {
      setMessage(`Error: ${err.message || 'Failed to add category'}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-montserrat text-center mb-6">Admin Panel</h1>
      <Link to="/shop" className="text-blue-500 hover:underline mb-4 block">Back to Shop</Link>

      {/* Add Product Form */}
      <div className="bg-white p-4 rounded shadow-md mb-6">
        <h2 className="text-xl font-montserrat mb-4">Add New Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            placeholder="Product Name"
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            placeholder="Price"
            className="w-full p-2 border rounded"
            step="0.01"
            required
          />
          <input
            type="number"
            name="stock"
            value={product.stock}
            onChange={handleChange}
            placeholder="Stock"
            className="w-full p-2 border rounded"
            required
          />
          <select
            name="category_id"
            value={product.category_id}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <div>
            {product.image_urls.map((url, index) => (
              <input
                key={index}
                type="text"
                value={url}
                onChange={(e) => handleImageChange(index, e.target.value)}
                placeholder={`Image URL ${index + 1} (or leave blank)`}
                className="w-full p-2 border rounded mb-2"
              />
            ))}
            <button
              type="button"
              onClick={addImageField}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Another Image URL
            </button>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="w-full p-2 border rounded mt-2"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add Product
          </button>
          {message && <p className="mt-2 text-center text-red-500">{message}</p>}
        </form>
      </div>

      {/* Add Category Form */}
      <div className="bg-white p-4 rounded shadow-md mb-6">
        <h2 className="text-xl font-montserrat mb-4">Add New Category</h2>
        <form onSubmit={handleCategorySubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
            placeholder="Category Name"
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            name="description"
            value={newCategory.description}
            onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
            placeholder="Description"
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            className="w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            Add Category
          </button>
          {message && <p className="mt-2 text-center text-red-500">{message}</p>}
        </form>
      </div>

      {/* View Orders */}
      <div className="bg-white p-4 rounded shadow-md mb-6">
        <h2 className="text-xl font-montserrat mb-4">View Orders</h2>
        {orders.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Product</th>
                <th className="p-2 border">Quantity</th>
                <th className="p-2 border">Total Price</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t">
                  <td className="p-2 border">{order.id}</td>
                  <td className="p-2 border">{order.product_name}</td>
                  <td className="p-2 border">{order.quantity}</td>
                  <td className="p-2 border">${order.total_price.toFixed(2)}</td>
                  <td className="p-2 border">{order.status}</td>
                  <td className="p-2 border">{new Date(order.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500">No orders yet.</p>
        )}
      </div>

      {/* View Collaboration Requests */}
      <div className="bg-white p-4 rounded shadow-md">
        <h2 className="text-xl font-montserrat mb-4">Collaboration Requests</h2>
        {collaborationRequests.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Subject</th>
                <th className="p-2 border">Message</th>
                <th className="p-2 border">Date</th>
              </tr>
            </thead>
            <tbody>
              {collaborationRequests.map((request) => (
                <tr key={request.id} className="border-t">
                  <td className="p-2 border">{request.id}</td>
                  <td className="p-2 border">{request.name}</td>
                  <td className="p-2 border">{request.email}</td>
                  <td className="p-2 border">{request.subject}</td>
                  <td className="p-2 border">{request.message}</td>
                  <td className="p-2 border">{new Date(request.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500">No collaboration requests yet.</p>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;