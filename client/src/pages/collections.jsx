
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api, fetchApi, API_CONFIG } from '../api';

const Collections = () => {
  const [categoryImages, setCategoryImages] = useState({});
  const [currentSlides, setCurrentSlides] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper: Build full image URL
  const getImageUrl = (relativePath) => {
    if (!relativePath) return 'https://via.placeholder.com/400x500?text=No+Image';
    // relativePath = "uploads/products/image.jpg"
    const base = API_CONFIG.API_BASE_URL.replace(/\/api\/?$/, ''); // Remove /api
    return `${base}/static/${relativePath.replace(/^static\//, '')}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsData = await fetchApi(api.products.list());
        const productsWithSlide = productsData.map(p => ({ ...p, currentSlide: 0 }));
        setProducts(productsWithSlide);

        // Group by category: first 3 images
        const grouped = productsWithSlide.reduce((acc, product) => {
          const catId = product.category_id || 'uncategorized';
          if (!acc[catId]) acc[catId] = [];

          if (acc[catId].length < 3 && product.image_urls?.length > 0) {
            const imgUrl = getImageUrl(product.image_urls[0]);
            acc[catId].push(imgUrl);
          }
          return acc;
        }, {});

        setCategoryImages(grouped);

        // Init sliders
        const slides = {};
        Object.keys(grouped).forEach(id => {
          slides[id] = 0;
        });
        setCurrentSlides(slides);
      } catch (err) {
        console.error('Failed to load collections:', err);
        // Fallback
        setCategoryImages({
          '1': Array(3).fill('https://via.placeholder.com/400x500?text=Handbags'),
          '2': Array(3).fill('https://via.placeholder.com/400x500?text=Totes'),
          '3': Array(3).fill('https://via.placeholder.com/400x500?text=Backpacks'),
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Auto-slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlides(prev => {
        const next = { ...prev };
        Object.keys(categoryImages).forEach(catId => {
          const len = categoryImages[catId].length;
          next[catId] = len > 0 ? (prev[catId] + 1) % len : 0;
        });
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [categoryImages]);

  if (loading) {
    return (
      <section className="py-16 px-4 md:px-8 text-center">
        <p className="text-gray-500">Loading collections...</p>
      </section>
    );
  }

  return (
    <section id="featured" className="py-16 px-4 md:px-8">
      <h2 className="text-3xl font-bold text-center mb-12">Featured Collections</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {Object.keys(categoryImages).length === 0 ? (
          <p className="text-center text-gray-500 col-span-3">No collections available.</p>
        ) : (
          Object.entries(categoryImages).map(([catId, images]) => {
            const currentSlide = currentSlides[catId] || 0;
            const sampleProduct = products.find(p => p.category_id === parseInt(catId));
            const categoryName = sampleProduct?.category_name || 'Collection';

            return (
              <div key={catId} className="relative group overflow-hidden rounded-lg">
                <div className="relative w-full h-96">
                  <div
                    className="flex transition-transform duration-500 ease-in-out h-full"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {images.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt={`${categoryName} ${i + 1}`}
                        className="w-full h-full object-cover flex-shrink-0"
                        onError={(e) => {
                          e.target.src = `https://via.placeholder.com/400x500?text=${categoryName}`;
                        }}
                      />
                    ))}
                  </div>
                </div>
                <div className="absolute inset-0 bg-slate bg-opacity-0 group-hover:bg-opacity-40 transition flex items-center justify-center">
                  <Link
                    to={`/shop?category=${catId}`}
                    className="text-white text-xl font-semibold opacity-0 group-hover:opacity-100 transition"
                  >
                    Shop {categoryName}
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default Collections;