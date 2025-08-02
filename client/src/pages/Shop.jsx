import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const Shop = () => {
  // Mock API data (replace with real API call later)
  const [products, setProducts] = useState([]);
  useEffect(() => {
    // Simulated API response
    setProducts([
      { id: 1, name: "Elegant Dress", images: ["/img1.jpg", "/img2.jpg", "/img3.jpg"], price: 99.99 },
      { id: 2, name: "Stylish Jacket", images: ["/img4.jpg", "/img5.jpg", "/img6.jpg"], price: 129.99 },
      // Add more products as needed
    ]);
  }, []);

  // Filter state
  const [filters, setFilters] = useState({ category: "", size: "", priceRange: "" });
  const [showFilters, setShowFilters] = useState(false);

  // Handle filter changes
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Filtered products (mock logic)
  const filteredProducts = products.filter((product) => {
    return (
      (filters.category === "" || product.category === filters.category) &&
      (filters.size === "" || product.size === filters.size) &&
      (filters.priceRange === "" || (filters.priceRange === "under100" && product.price < 100) || (filters.priceRange === "100-200" && product.price >= 100 && product.price <= 200))
    );
  });

  // Footer visibility state and observer
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting);
      },
      { threshold: 0.1 } // Trigger when 10% of the target is visible
    );

    const target = document.querySelector('.product-grid-end');
    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, []);


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
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
          </div>
        </div>
        {/* Filter Panel */}
        {showFilters && (
          <div className="container mx-auto mt-4 bg-white p-4 rounded shadow-md">
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="block w-1/4 p-2 mb-2 border rounded"
            >
              <option value="">All Categories</option>
              <option value="backpacks">Backpacks</option>
              <option value="handbags">Handbags</option>
              <option value="totes">Totes</option>
            </select>
            <select
              name="size"
              value={filters.size}
              onChange={handleFilterChange}
              className="block w-1/4 p-2 mb-2 border rounded"
            >
              <option value="">All Sizes</option>
              <option value="s">S</option>
              <option value="m">M</option>
              <option value="l">L</option>
            </select>
            <select
              name="priceRange"
              value={filters.priceRange}
              onChange={handleFilterChange}
              className="block w-1/4 p-2 border rounded"
            >
              <option value="">All Prices</option>
              <option value="under100">Under $100</option>
              <option value="100-200">$100 - $200</option>
            </select>
          </div>
        )}
      </nav>

      {/* Product Grid */}
      <div className="container mx-auto py-8 flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white p-4 rounded shadow-md">
              {/* Image Carousel */}
              <div className="relative w-full h-64 overflow-hidden">
                <div
                  className="flex transition-transform duration-300 ease-in-out"
                  style={{ transform: `translateX(-${(product.currentSlide || 0) * 100}%)` }}
                >
                  {product.images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={product.name}
                      className="w-full h-64 object-cover"
                    />
                  ))}
                </div>
                <button
                  onClick={() =>
                    setProducts((prev) =>
                      prev.map((p) =>
                        p.id === product.id
                          ? { ...p, currentSlide: (p.currentSlide || 0) - 1 < 0 ? product.images.length - 1 : (p.currentSlide || 0) - 1 }
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
                          ? { ...p, currentSlide: (p.currentSlide || 0) + 1 >= product.images.length ? 0 : (p.currentSlide || 0) + 1 }
                          : p
                      )
                    )
                  }
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-slate-300 text-white p-2 rounded-full"
                >
                  ›
                </button>
              </div>
              <h3 className="text-lg font-montserrat mt-2">{product.name}</h3>
              <p className="text-gray-600 font-montserrat">${product.price.toFixed(2)}</p>
              <button className="mt-2 w-full bg-slate-600 text-white px-4 py-2 rounded hover:bg-slate-900 transition">
                Add to Cart
              </button>
            </div>
          ))}
          <div className="product-grid-end" style={{ height: '1px' }}></div> {/* Invisible target for observer */}
        </div>
      </div>
      {isFooterVisible && <Footer />}
      
    </div>
  );
};

export default Shop;