import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Home = () => {
  // State for carousel
  const [currentSlide, setCurrentSlide] = useState(0);

  // Dummy Instagram posts
  const instagramPosts = [
    { id: 1, src: 'https://via.placeholder.com/300x300?text=Insta+Post+1', alt: 'Instagram Post 1' },
    { id: 2, src: 'https://via.placeholder.com/300x300?text=Insta+Post+2', alt: 'Instagram Post 2' },
    { id: 3, src: 'https://via.placeholder.com/300x300?text=Insta+Post+3', alt: 'Instagram Post 3' },
  ];

  // Carousel auto-slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % instagramPosts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [instagramPosts.length]);
  

  return (
    <div className="min-h-screen bg-gray-50 scroll-smooth">
      <Navbar />
      {/* Hero Banner */}
      <section id="hero" className="relative h-screen">
        <video
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/background_video.mp4" type="video/mp4" />
          <img
            src="/Home.png"
            alt="Hero Image"
            className="w-full h-full object-cover"
          />
        </video>
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Elevate Your Style</h1>
            <p className="text-lg md:text-xl mb-8">Discover the latest in fashion bags</p>
            <Link
              to="/shop"
              className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition"
            >
              Discover Our Bags
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section id="featured" className="py-16 px-4 md:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Collections</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {['Handbags', 'Backpacks', 'Totes'].map((item, index) => (
            <div key={index} className="relative group">
              <img
                src={`https://via.placeholder.com/400x500?text=${item}`}
                alt={item}
                className="w-full h-96 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition flex items-center justify-center">
                <Link
                  to="/shop"
                  className="text-white text-lg font-semibold opacity-0 group-hover:opacity-100 transition"
                >
                  Shop {item}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Instagram Feed */}
      <section id="instagram" className="py-16 px-4 md:px-8 bg-gray-100">
        <h2 className="text-3xl font-bold text-center mb-12">Follow Us on Instagram</h2>
        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {instagramPosts.map((post) => (
                <div key={post.id} className="min-w-full flex justify-center">
                  <img
                    src={post.src}
                    alt={post.alt}
                    className="w-80 h-80 object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + instagramPosts.length) % instagramPosts.length)}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow"
          >
            ←
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % instagramPosts.length)}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow"
          >
            →
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;