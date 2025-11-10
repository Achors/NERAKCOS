import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { api, fetchApi, API_CONFIG } from '../api';
import { useSearch } from '../context/searchcontext';
import { FaSearch, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ category: '', priceRange: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const { searchTerm, setSearchTerm } = useSearch();
  const { cartCount, addToCart, toast } = useCart();

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
    <div className="min-h-screen bg-stone-200 flex flex-col">
      <nav className="bg-slate-100 p-2 shadow-md">
        <div className="container mx-auto">
          {/* Top Row: Logo, Shop, Back, Cart */}
          <div className="flex items-center justify-between mb-1 sm:mb-0">
            <div className="flex-shrink-0">
              <Link to="/">
                <img src="/n_logo.png" alt="NERAKCOS Logo" className="h-8 sm:h-10" />
              </Link>
            </div>
            <h2 className="text-lg sm:text-2xl font-montserrat text-black">Shop</h2>
            <div className="flex items-center space-x-2">
              <Link to="/" className="text-sm sm:text-base bg-transparent border border-slate-100 px-2 sm:px-4 py-1 sm:py-2 rounded hover:bg-slate-200 transition">
                Back
              </Link>
              <Link to="/cart" className="relative text-sm sm:text-base bg-transparent border border-slate-100 px-2 sm:px-4 py-1 sm:py-2 rounded hover:bg-slate-200 transition">
                <FaShoppingCart />
                {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{cartCount}</span>}
              </Link>
            </div>
          </div>
          {/* Bottom Row: Filter, Search (side-by-side, centered on large screens) */}
          <div className="flex items-center justify-between sm:justify-center mt-1 sm:mt-0">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="text-xs sm:text-sm bg-transparent border border-slate-100 px-2 sm:px-4 py-1 sm:py-2 rounded hover:bg-slate-200 transition mr-2 sm:mr-4"
            >
              Filter
            </button>
            <div className="relative flex-1 sm:w-1/3 md:w-1/2">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm || ''}
                onChange={handleSearchChange}
                className="pl-8 sm:pl-10 pr-4 py-1 sm:py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-slate-500 w-full sm:w-48 md:w-64 text-xs sm:text-sm"
              />
              <FaSearch className="absolute left-2 sm:left-3 top-1.5 sm:top-2.5 text-gray-400" size={12} sm:size={16} />
            </div>
          </div>
        </div>
        {showFilters && (
          <div className="container mx-auto mt-2 bg-stone-100 p-2 sm:p-4 rounded shadow-md">
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="block w-1/3 sm:w-1/4 p-1 sm:p-2 mb-1 sm:mb-2 border rounded text-xs sm:text-sm"
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
              className="block w-1/3 sm:w-1/4 p-1 sm:p-2 border rounded text-xs sm:text-sm"
            >
              <option value="">All Prices</option>
              <option value="under100">Under €100</option>
              <option value="100-200">€100 - €200</option>
            </select>
          </div>
        )}
      </nav>

      <div className="container mx-auto py-8 flex-1">
        {toast && <div className="fixed top-4 right-4 bg-black text-white p-2 rounded shadow-md z-50">{toast}</div>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product.id} className="bg-stone-200 p-4 rounded shadow-md">
                <div className="relative w-full h-64 overflow-hidden">
                  <div
                    className="flex transition-transform duration-300 ease-in-out"
                    style={{ transform: `translateX(-${(product.currentSlide || 0) * 100}%)`, width: '100%' }}
                  >
                    {product.image_urls?.length > 0 ? (
                      product.image_urls.map((img, index) => {
                        const imgUrl = `${API_CONFIG.API_BASE_URL.replace(/\/api\/$/, '')}/static/${img.replace('static/', '')}`;
                        return (
                          <img
                            key={index}
                            src={imgUrl}
                            alt={`${product.name} angle ${index + 1}`}
                            className="w-full h-64 object-cover flex-shrink-0"
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

                <div className="mt-2 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-montserrat">{product.name}</h3>
                    <p className="text-gray-600 font-montserrat">€{product.price.toFixed(2)}</p>
                  </div>

                  <button
                    onClick={() => addToCart(product.id)}
                    className="p-3 bg-transparent border border-black text-black rounded-full hover:bg-black hover:text-white transition shadow-md hover:shadow-lg"
                    title="Add to Cart"
                  >
                    <FaShoppingCart size={18} />
                  </button>
                </div>
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