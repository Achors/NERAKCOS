import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Collections from '../pages/collections';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const instagramPosts = [
    { id: 1, src: '/Insta_1.png', alt: 'Instagram Post 1' },
    { id: 2, src: '/Insta_2.png', alt: 'Instagram Post 2' },
    { id: 3, src: '/Insta_3.png', alt: 'Instagram Post 3' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % instagramPosts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [instagramPosts.length]);

  return (
    <div className="min-h-screen bg-stone-200 scroll-smooth">
      <Navbar />
      <section id="hero" className="relative min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(/Home.png)` }}>
        {/* Optional video background with fallback */}
        <video autoPlay muted loop className="w-full h-full object-cover absolute inset-0 hidden md:block" style={{ zIndex: -1 }}>
          <source src="/background_video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-slate bg-opacity-40 flex items-center justify-center min-h-screen">
          <div className="text-center text-black">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Elevate Your Style</h1>
            <p className="text-lg md:text-xl mb-8">Discover the latest in fashion bags</p>
            <Link to="/shop" className="bg-black text-slate-100 px-6 py-3 rounded-full font-semibold hover:bg-gray-900 transition">
              Discover Our Bags
            </Link>
          </div>
        </div>
      </section>
      <Collections />
      <section id="instagram" className="py-16 px-4 md:px-8 bg-stone-200">
        <h2 className="text-3xl font-bold text-center mb-12">Follow Us on Instagram</h2>
        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {instagramPosts.map((post) => (
                <div key={post.id} className="min-w-full flex justify-center">
                  <img src={post.src} alt={post.alt} className="w-90 h-120 object-cover rounded-lg" />
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