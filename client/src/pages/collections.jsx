import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api, fetchApi } from '../api';

const Collections = () => {
  const [categoryImages, setCategoryImages] = useState({});
  const [currentSlides, setCurrentSlides] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsData = await fetchApi(api.products.list());
        const products = productsData.map(product => ({ ...product, currentSlide: 0 }));
        setProducts(products);

        // Group by category_id and take first three images
        const grouped = products.reduce((acc, product) => {
          const categoryId = product.category_id || 'Uncategorized';
          if (!acc[categoryId]) {
            acc[categoryId] = [];
          }
          if (acc[categoryId].length < 3 && product.image_urls && product.image_urls.length > 0) {
            acc[categoryId].push(product.image_urls[0]); // Use first image
          }
          return acc;
        }, {});
        setCategoryImages(grouped);

        // Initialize current slide for each category
        const initialSlides = {};
        Object.keys(grouped).forEach(categoryId => {
          initialSlides[categoryId] = 0;
        });
        setCurrentSlides(initialSlides);
      } catch (err) {
        console.error('Error fetching collections:', err);
        setCategoryImages({
          1: ['/placeholder.jpg', '/placeholder.jpg', '/placeholder.jpg'], // Handbags
          2: ['/placeholder.jpg', '/placeholder.jpg', '/placeholder.jpg'], // Totes
          3: ['/placeholder.jpg', '/placeholder.jpg', '/placeholder.jpg'], // Backpacks
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Auto-slide for each category
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlides(prev => {
        const newSlides = { ...prev };
        Object.keys(categoryImages).forEach(categoryId => {
          newSlides[categoryId] = (prev[categoryId] + 1) % (categoryImages[categoryId].length || 1);
        });
        return newSlides;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [categoryImages]);

  return (
    <section id="featured" className="py-16 px-4 md:px-8">
      <h2 className="text-3xl font-bold text-center mb-12">Featured Collections</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {loading ? (
          <p className="text-center text-gray-500">Loading collections...</p>
        ) : Object.keys(categoryImages).length > 0 ? (
          Object.keys(categoryImages).map((categoryId) => {
            const images = categoryImages[categoryId];
            const currentSlide = currentSlides[categoryId] || 0;
            const categoryName = products.find(p => p.category_id === parseInt(categoryId))?.category_name || 'Uncategorized';
            return (
              <div key={categoryId} className="relative group">
                <div className="relative w-full h-96 overflow-hidden">
                  <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {images.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`${categoryName} image ${index + 1}`}
                        className="w-full h-96 object-cover rounded-lg min-w-full border border-black border-opacity-100"
                        onError={(e) => { e.target.src = `/https://via.placeholder.com/400x500?text=${categoryName}`; }}
                      />
                    ))}
                  </div>
                </div>
                <div className="absolute inset-0 bg-slate-0 bg-opacity-0 group-hover:bg-opacity-8 0 transition flex items-center justify-center">
                  <Link
                    to={`/shop?category=${categoryId}`}
                    className="text-black text-lg font-semibold opacity-0 group-hover:opacity-100 transition"
                  >
                    Shop {categoryName}
                  </Link>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500">No collections available.</p>
        )}
      </div>
    </section>
  );
};

export default Collections;