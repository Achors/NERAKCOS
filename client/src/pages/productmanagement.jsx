import { useState, useEffect } from 'react';
import { api, fetchApi } from '../api';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ 
    name: '', 
    price: '', 
    stock: '', 
    category: '',
    images: [] 
  });

  const categories = [
    { value: 'tote', label: 'Tote Bag' },
    { value: 'backpack', label: 'Backpack' },
    { value: 'handbag', label: 'Handbag' }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await fetchApi(api.products.list());
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };
    fetchProducts();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('price', newProduct.price);
    formData.append('stock', newProduct.stock);
    formData.append('category', newProduct.category);
    newProduct.images.forEach((image) => formData.append('images', image));

    try {
      const response = await fetchApi(api.products.create(), {
        method: 'POST',
        body: formData,
      });
      setProducts([...products, response]);
      setShowModal(false);
      setNewProduct({ name: '', price: '', stock: '', category: '', images: [] });
    } catch (err) {
      console.error('Error adding product:', err);
    }
  };

  const handleImageChange = (e) => {
    setNewProduct({ ...newProduct, images: Array.from(e.target.files) });
  };

  const getCategoryLabel = (categoryValue) => {
    const category = categories.find(cat => cat.value === categoryValue);
    return category ? category.label : categoryValue;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-slate-700 text-white px-6 py-2 rounded-lg hover:bg-slate-800 transition-colors shadow-md"
          >
            Add Product
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Images</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Category</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Price</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Stock</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{product.id}</td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      {product.image_urls?.slice(0, 3).map((img, index) => (
                        <img
                          key={index}
                          src={img}
                          alt={`${product.name} angle ${index + 1}`}
                          className="w-12 h-12 object-cover rounded-md border"
                        />
                      ))}
                      {product.image_urls?.length > 3 && (
                        <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-600">
                          +{product.image_urls.length - 3}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{product.name}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {getCategoryLabel(product.category)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">${product.price?.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{product.stock}</td>
                  <td className="px-4 py-3 text-sm space-x-2">
                    <button className="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                    <button className="text-red-600 hover:text-red-800 font-medium">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Add New Product</h2>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="Enter product name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Images</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">Select multiple images for your product</p>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setNewProduct({ name: '', price: '', stock: '', category: '', images: [] });
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    onClick={handleAddProduct}
                    className="px-4 py-2 text-sm font-medium text-white bg-slate-700 border border-transparent rounded-md hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500"
                  >
                    Add Product
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManagement;