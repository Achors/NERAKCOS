import React, { useState, useEffect } from 'react';

const CommitmentItem = ({ title, description, imageUrl, isMission }) => {
  return (
    <div className="flex items-center text-center p-6">
      <div className="text-left flex-1">
        <h3 className="text-2xl font-semibold italic text-black">{title}</h3>
        <p className="mt-2 text-lg leading-relaxed text-black">
          {isMission ? (
            <>
              We are committed to reducing ecological footprint through:
              <ol className="list-decimal pl-6 text-left">
                <li>Recycled materials</li>
                <li>Conscious manufacturing process</li>
                <li>Ethical practices</li>
                <li>Positive contribution to the environment</li>
                <li>Attraction of consumers committed to sustainability and style</li>
              </ol>
            </>
          ) : (
            description
          )}
        </p>
      </div>
      <div className="w-52 h-52 rounded-full overflow-hidden ml-6">
        <img src={imageUrl} alt={`${title} image`} className="w-full h-full object-cover border-4 border-gray-800" />
      </div>
    </div>
  );
};

const FoundersStorySection = () => {
  const [currentCommitment, setCurrentCommitment] = useState('mission');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCommitment((prev) => (prev === 'mission' ? 'vision' : 'mission'));
    }, 5000); // Switch every 5 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <section className="min-h-[90vh] mb-12 bg-stone-100 rounded-lg shadow-lg">
      <div className="min-h-[90vh] flex flex-col items-center justify-center text-center p-6 md:p-12">
        {/* Our Story Section with Logo and Textile Image Side-by-Side */}
        <div className="px-4 animate-slideIn mb-12">
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 rounded-full overflow-hidden">
              <img src="/n_logo.png" alt="Company logo" className="w-full h-full object-cover" />
            </div>
            <h2 className="mt-4 text-4xl font-garamond mb-6 text-black italic font-bold">Our Story</h2>
          </div>
          <div className="flex items-center">
            <div className="w-52 h-52 rounded-full overflow-hidden mr-6">
              <img src="/madrid.png" alt="Textile work" className="w-full h-full object-cover border-4 border-gray-800" />
            </div>
            <div className="text-left flex-1">
              <p className="text-lg font-montserrat leading-relaxed max-w-xl text-black">
                Inspired by the vibrant streets of Paris and Milan, <em>NERAKCOS</em> was born from a passion
                for textile design and bold aesthetics. What started as a humble atelier has evolved
                into a fashion legacy, shaping our brand with unique, personal touches.
              </p>
            </div>
          </div>
        </div>
        {/* Commitment Section with Swapping Mission and Vision */}
        <div className="animate-fadeIn">
          <h2 className="text-4xl font-garamond mb-6 text-black italic">Commitment</h2>
          <div className="max-w-2xl mx-auto transition-opacity duration-500" style={{ minHeight: '500px' }}>
            {currentCommitment === 'mission' ? (
              <div className="opacity-100 transition-opacity duration-500 flex items-center" style={{ minHeight: '400px' }}>
                <CommitmentItem
                  title="Our Mission"
                  description=""
                  imageUrl="/kids.png"
                  isMission={true}
                />
              </div>
            ) : (
              <div className="opacity-100 transition-opacity duration-500 flex items-center" style={{ minHeight: '400px' }}>
                <CommitmentItem
                  title="Our Vision"
                  description="Sustainable brand of bags and accessories that address the environmental impact of the fashion industry."
                  imageUrl="/textile_trial.png"
                  isMission={false}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FoundersStorySection;