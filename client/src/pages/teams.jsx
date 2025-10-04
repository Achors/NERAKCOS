import React from 'react';

const TeamMember = ({ name, role, description, imageUrl }) => {
  return (
    <div className="flex flex-col items-center text-center p-4">
      <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 sm:w-32 sm:h-32">
        <img src={imageUrl} alt={`${name}'s profile`} className="w-full h-full object-cover" />
      </div>
      <h3 className="mt-2 text-lg font-semibold sm:text-xl">{name}</h3>
      <p className="text-sm text-gray-600 sm:text-base">{role}</p>
      <p className="mt-1 text-sm text-gray-700 sm:text-base">{description}</p>
    </div>
  );
};

const TeamSection = () => {
  const teamMembers = [
    {
      name: "Karen",
      role: "Founder & CEO",
      description: "Leads the vision and strategy, driving innovation and growth.",
      imageUrl: "/karen.png",
    },
  ];

  return (
    <section className="py-12 bg-stone-100 rounded-lg shadow-lg">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Our Team</h2>
        <div className="grid grid-cols-1 gap-8">
          {teamMembers.map((member, index) => (
            <TeamMember key={index} {...member} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <h3 className="text-2xl font-garamond font-semibold italic mb-2 border-b-2 border-gray-800 inline-block">Conclusion:</h3>
          <p className="text-lg italic text-gray-800">
            Support us to generate a great impact in terms of recycling and transformation <br />
            of fashion, contributing work, awareness and values...
          </p>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;