import { useState, useEffect } from 'react';
import { api, fetchApi } from '../api';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '', images: [] });

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
    newProduct.images.forEach((image) => formData.append('images', image));

    try {
      const response = await fetchApi(api.products.create(), {
        method: 'POST',
        body: formData,
      });
      setProducts([...products, response]);
      setShowModal(false);
      setNewProduct({ name: '', price: '', stock: '', images: [] });
    } catch (err) {
      console.error('Error adding product:', err);
    }
  };

  const handleImageChange = (e) => {
    setNewProduct({ ...newProduct, images: Array.from(e.target.files) });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Product Management</h1>
      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        Add Product
      </button>
      <table className="w-full mt-4 bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">ID</th>
            <th className="p-2">Images</th>
            <th className="p-2">Name</th>
            <th className="p-2">Price</th>
            <th className="p-2">Stock</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-t">
              <td className="p-2">{product.id}</td>
              <td className="p-2">
                <div className="flex space-x-2">
                  {product.image_urls.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`${product.name} angle ${index + 1}`}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ))}
                </div>
              </td>
              <td className="p-2">{product.name}</td>
              <td className="p-2">${product.price.toFixed(2)}</td>
              <td className="p-2">{product.stock}</td>
              <td className="p-2">
                <button className="text-blue-500 hover:text-blue-700">Edit</button>
                <button className="text-red-500 hover:text-red-700 ml-2">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                placeholder="Name"
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                placeholder="Price"
                className="w-full p-2 border rounded"
                step="0.01"
                required
              />
              <input
                type="number"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                placeholder="Stock"
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="w-full p-2 border rounded"
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;