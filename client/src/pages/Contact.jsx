import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { api, fetchApi } from '../api';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Submitting...');
    try {
      const response = await fetchApi(api.contact.submit(), {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      setStatus(`Submission received! ID: ${response.id}`);
      setFormData({ name: '', email: '', subject: '', message: '' }); 
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100">
      <div className="min-h-screen relative overflow-hidden">
        <div className="relative z-10">
          <Navbar />
          <div className="flex-1 py-6">
            <div className="max-w-[90%] mx-auto px-4">
              <section className="mb-6 relative">
                <div className="relative z-20 flex flex-col items-center justify-center text-center animate-slideIn">
                  <h1 className="text-5xl font-montserrat text-black mb-4">Contact Us</h1>
                  <p className="text-lg font-montserrat text-gray-800 leading-relaxed">
                    We’d love to hear from you. Reach out for inquiries, collaborations, or to explore our collections. 
                  </p>
                </div>
              </section>

              <section className="mb-6 relative">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slideUp">
   {/* Contact Info */}
<div className="bg-stone-200 p-6 rounded-lg shadow-lg relative">
  <h2 className="text-2xl font-montserrat text-gray-800 mb-4">Get in Touch</h2>
  <p className="text-gray-600">Email: info@nerakcos.com</p>
  <p className="text-gray-600">Phone: +31-613030082</p>
  <p className="text-gray-600">Address: Nicolaas Maestraat 43, 7545 CD Enschede, <em>Netherlands</em></p>
  <p className="text-gray-600 mt-4">Hours: Mon-Fri, 9 AM - 6 PM (CET)</p>
  <div className="absolute bottom-2 left-0 w-full h-16 overflow-hidden"> {/* Increased h-12 to h-16 */}
    <div className="flex items-center animate-car-move">
      <img src="/car-icon.svg" alt="Car" className="w-16 h-12 text-gray-600 mr-2" /> {/* Kept size */}
    </div>
    <div className="absolute bottom-0 right-0 pin-container"> {/* Repositioned to right edge */}
      <img src="/pin_loc.svg" alt="Location Pin" className="w-13 h-20 text-red-600 opacity-0 pin-appear" />
    </div>
    <style>
      {`
        .animate-car-move {
          animation: carMove 6s linear infinite;
          position: absolute;
        }
        @keyframes carMove {
          0% { transform: translateX(-100%); }
          75% { transform: translateX(75%); } /* Earlier pause for visibility */
          80% { transform: translateX(75%); } /* Pause for pin */
          100% { transform: translateX(100vw); } /* Full viewport width */
        }
        .pin-container {
          position: absolute;
          right: 0; /* Fixed at right edge */
        }
        .pin-appear {
          animation: pinAppear 0.5s ease-in forwards 4.8s; /* Trigger at 4.8s, no infinite */
        }
        @keyframes pinAppear {
          0% { opacity: 0; transform: scale(0.5); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}
    </style>
  </div>
</div>

    {/* Contact Form */}
    <div className="bg-stone-200 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-montserrat text-gray-800 mb-4">Send Us a Message</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your Name"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Your Email"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="Subject"
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Your Message"
          className="w-full p-2 border rounded h-32"
          required
        />
        <button
          type="submit"
          className="w-full bg-gray-800 text-white p-2 rounded hover:bg-gray-700 transition"
        >
          Send Message
        </button>
      </form>
      {status && <p className="mt-4 text-green-600">{status}</p>}
    </div>
  </div>
</section>

              {/* Map Placeholder */}
              <section className="mb-6 relative animate-slideIn">
                <div className="bg-stone-200 p-6 rounded-lg shadow-lg">
                  <h2 className="text-2xl font-montserrat text-gray-800 mb-4">Visit Us</h2>
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2425.123!2d6.894!3d52.216!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c7e8f5b1a5b1b2%3A0xabcdef1234567890!2sNicolaas%20Maestraat%2043%2C%207545%20CD%20Enschede%2C%20Netherlands!5e0!3m2!1sen!2sus!4v1727879720" 
                    width="100%" 
                    height="400" 
                    style={{border:0}} 
                    allowFullScreen="" 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-lg"
                  />
                  <p className="text-gray-800 mt-2">Nicolaas Maestraat 43, 7545 CD Enschede, Netherlands</p>
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

export default Contact;