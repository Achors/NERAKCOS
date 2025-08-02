import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const About = () => {
  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/Bag.png')" }} data-z-index="-1">
      <div className="min-h-screen bg-slate bg-opacity-20 relative overflow-hidden">
        <div className="relative z-10">
          <Navbar />
          <div className="flex-1 py-12">
            <div className="max-w-[90%] mx-auto px-4">
              {/* Company Story Section */}
              <section className="mb-12 relative min-h-[90vh]">
                <img
                  src="/Home.png"
                  alt="Company Background"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="relative z-10 min-h-[90vh] flex flex-col items-center justify-center">
                  <div className="text-center px-4 animate-slideIn">
                    <h2 className="text-4xl font-montserrat text-black mb-6 drop-shadow-lg">Company Story</h2>
                    <p className="text-lg font-montserrat text-black leading-relaxed drop-shadow-lg">
                      NERAKCOS emerged gracefully.<br />
                      Redefines luxury with purpose.<br />
                      Blends high fashion and sustainability innovatively.
                    </p>
                  </div>
                  {/* <div className="w-full animate-slideUp">
                    <img
                      src="/Bag.png"
                      alt="Company Bag"
                      className="w-full h-96 object-cover"
                    />
                  </div> */}
                </div>
              </section>

              {/* Founder’s Story Section */}
              <section className="mb-12 relative min-h-[90vh]">
                <h2 className="text-4xl font-montserrat text-white-800 mb-6 text-center animate-slideIn">Founder’s Story</h2>
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: "url('/karen.png')", opacity: 0.7 }}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div> {/* Black overlay */}
                </div>
                <div className="relative z-20 flex flex-col md:flex-row items-center gap-6">
                  <img
                    src="/karen.png"
                    alt="Kara Nelson"
                    className="w-full md:w-2/5 h-auto object-cover rounded-lg shadow-md animate-slideUp"
                  />
                  <div className="text-left w-full md:w-3/5 animate-slideIn">
                    <p className="text-lg font-montserrat text-gray-100 leading-relaxed drop-shadow-lg">
                      Kara Nelson, the visionary behind NERAKCOS, drew inspiration from<br />
                      her travels across Paris and Milan. With a background in textile design,<br />
                      she turned her passion into a legacy, blending bold aesthetics with personal touches.<br />
                      Her journey from a humble atelier to a fashion icon continues to shape our brand’s identity.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default About;