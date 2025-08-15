import React from 'react';

const FoundersStorySection = () => {
  return (
    <section className="relative min-h-[80vh] mb-12">
      {/* Background image with opacity, no parent interference */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/karen.png')", opacity: 0.9 }}
      >
        <div className="absolute inset-0 bg-slate bg-opacity-70"></div> {/* Light overlay */}
      </div>
      <div className="relative z-30 flex flex-col md:flex-row items-center gap-6 p-6 md:p-12">
        <div className="w-full md:w-2/5">
          <img
            src="/karen.png"
            alt="Kara Nelson"
            className="w-full h-auto object-cover rounded-lg shadow-md animate-slideUp"
          />
        </div>
        <div className="text-left w-full md:w-3/5 animate-slideIn">
          <h2 className="text-4xl font-montserrat text-white mb-6">Founder’s Story</h2>
          <p className="text-lg font-montserrat text-white leading-relaxed drop-shadow-lg">
            Kara Nelson, the visionary behind NERAKCOS, drew inspiration from
            <br />
            her travels across Paris and Milan. With a background in textile design,
            <br />
            she turned her passion into a legacy, blending bold aesthetics with personal touches.
            <br />
            Her journey from a humble atelier to a fashion icon continues to shape our brand’s identity.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FoundersStorySection;