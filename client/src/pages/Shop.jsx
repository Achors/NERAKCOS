import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { api, fetchApi, API_CONFIG } from '../api';
import { useSearch } from '../pages/searchcontext';
import { FaSearch } from 'react-icons/fa';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ category: '', priceRange: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const { searchTerm, setSearchTerm } = useSearch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching products from:', api.products.list());
        const productsData = await fetchApi(api.products.list());
        console.log('Products fetched:', productsData);
        setProducts(productsData.map(product => ({ ...product, currentSlide: 0 })));
        const categoriesData = await fetchApi(api.categories.list());
        setCategories(categoriesData);
      } catch (err) {
        console.error('Error fetching data:', err.message, err);
      }
    };
    fetchData();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddToCart = async (productId) => {
    try {
      const response = await fetchApi(api.orders.create(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId, quantity: 1 }),
      });
      alert('Item added to cart! Admin will see this order.');
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Error adding to cart. Please log in or try again.');
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = !searchTerm ||
      (product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filters.category === '' || product.category_id === parseInt(filters.category);
    const matchesPrice = filters.priceRange === '' ||
      (filters.priceRange === 'under100' && product.price < 100) ||
      (filters.priceRange === '100-200' && product.price >= 100 && product.price <= 200);
    return matchesSearch && matchesCategory && matchesPrice;
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const target = document.querySelector('.product-grid-end');
    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-slate-100 p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center relative">
          <div className="flex-shrink-0">
            <Link to="/">
              <img src="/n_logo.png" alt="NERAKCOS Logo" className="h-10" />
            </Link>
          </div>
          <div className="absolute left-1/2 transform -translate-x-1/2 text-black text-2xl font-montserrat">
            Shop
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="text-black bg-transparent border border-white px-4 py-2 rounded hover:bg-slate hover:text-slate-300 transition"
            >
              Filter
            </button>
            <Link to="/" className="text-black bg-transparent border border-white px-4 py-2 rounded hover:bg-slate hover:text-slate-300 transition">
              Back
            </Link>
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm || ''}
                onChange={handleSearchChange}
                className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
              />
              <FaSearch className="absolute left-3 top-2.5 text-gray-400" size={16} />
            </div>
          </div>
        </div>
        {showFilters && (
          <div className="container mx-auto mt-4 bg-white p-4 rounded shadow-md">
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="block w-1/4 p-2 mb-2 border rounded"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <select
              name="priceRange"
              value={filters.priceRange}
              onChange={handleFilterChange}
              className="block w-1/4 p-2 border rounded"
            >
              <option value="">All Prices</option>
              <option value="under100">Under €100</option>
              <option value="100-200">€100 - €200</option>
            </select>
          </div>
        )}
      </nav>

      <div className="container mx-auto py-8 flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product.id} className="bg-white p-4 rounded shadow-md">
                <div className="relative w-full h-64 overflow-hidden">
  <div
    className="flex transition-transform duration-300 ease-in-out"
    style={{ transform: `translateX(-${(product.currentSlide || 0) * 100}%)`, width: '100%' }}  // Container width is 100% of one slide
  >
    {product.image_urls?.length > 0 ? (
      product.image_urls.map((img, index) => {
        const imgUrl = `${API_CONFIG.API_BASE_URL.replace(/\/api\/$/, '')}/static/${img.replace('static/', '')}`;
        return (
          <img
            key={index}
            src={imgUrl}
            alt={`${product.name} angle ${index + 1}`}
            className="w-full h-64 object-contain flex-shrink-0"  // Each image is 100% width, no shrinking
            onError={(e) => {
              console.log(`Image load failed: ${e.target.src}`);
              e.target.src = 'https://via.placeholder.com/150';
            }}
          />
        );
      })
    ) : (
      <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-600">
        No Images
      </div>
    )}
  </div>
  {product.image_urls?.length > 1 && (
    <>
      <button
        onClick={() =>
          setProducts((prev) =>
            prev.map((p) =>
              p.id === product.id
                ? { ...p, currentSlide: (p.currentSlide || 0) - 1 < 0 ? product.image_urls.length - 1 : (p.currentSlide || 0) - 1 }
                : p
            )
          )
        }
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-slate-300 text-black p-2 rounded-full"
      >
        ‹
      </button>
      <button
        onClick={() =>
          setProducts((prev) =>
            prev.map((p) =>
              p.id === product.id
                ? { ...p, currentSlide: (p.currentSlide || 0) + 1 >= product.image_urls.length ? 0 : (p.currentSlide || 0) + 1 }
                : p
            )
          )
        }
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-slate-300 text-white p-2 rounded-full"
      >
        ›
      </button>
    </>
  )}
</div>
                <h3 className="text-lg font-montserrat mt-2">{product.name}</h3>
                <p className="text-gray-600 font-montserrat">€{product.price.toFixed(2)}</p>
                <button
                  onClick={() => handleAddToCart(product.id)}
                  className="mt-2 w-full bg-slate-600 text-white px-4 py-2 rounded hover:bg-slate-900 transition"
                >
                  Add to Cart
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No products found.</p>
          )}
          <div className="product-grid-end" style={{ height: '1px' }}></div>
        </div>
      </div>
      {isFooterVisible && <Footer />}
    </div>
  );
};

export default Shop;