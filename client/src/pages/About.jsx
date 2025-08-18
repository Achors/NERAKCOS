import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TeamSection from './teams';
import FoundersStorySection from './founder';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50" data-z-index="-1"> {/* Light gray base, no full-screen image */}
      <div className="relative overflow-hidden">
        <div className="relative z-10">
          <Navbar />
          <div className="flex-1 py-12">
            <div className="max-w-[90%] mx-auto px-4">
              {/* Company Story Section */}
              <section className="mb-12 relative min-h-[80vh]">
                <img
                  src="/Home.png"
                  alt="Company Background"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="relative z-10 min-h-[90vh] flex flex-col items-center justify-center">
                  <div className="text-center px-4 animate-slideIn">
                    <h2 className="text-4xl font-montserrat text-black mb-6 drop-shadow-lg">Company Story</h2>
                    <p className="text-lg font-montserrat text-black leading-relaxed drop-shadow-lg">
                      NERAKCOS emerged gracefully.
                      <br />
                      Redefines luxury with purpose.
                      <br />
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

              <FoundersStorySection />

              <TeamSection />
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default About;