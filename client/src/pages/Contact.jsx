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
    <div className="min-h-screen bg-cover bg-center bg-opacity-20" style={{ backgroundImage: "url('/pink_bag.png')" }}>
      <div className="min-h-screen bg-slate bg-opacity-20 relative overflow-hidden">
        <div className="relative z-10">
          <Navbar />
          <div className="flex-1 py-12">
            <div className="max-w-[90%] mx-auto px-4">
              <section className="mb-12 relative min-h-[70vh]">
                <div className="relative z-20 flex flex-col items-center justify-center text-center animate-slideIn">
                  <h1 className="text-5xl font-montserrat text-black mb-6 drop-shadow-lg">Contact Us</h1>
                  <p className="text-lg font-montserrat text-slate-950 leading-relaxed drop-shadow-lg">
                    We’d love to hear from you. Reach out for inquiries, collaborations, or to explore our collections. 
                  </p>
                </div>
              </section>

              <section className="mb-12 relative">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-slideUp">
                  {/* Contact Info */}
                  <div className="bg-white bg-opacity-80 p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-montserrat text-gray-800 mb-4">Get in Touch</h2>
                    <p className="text-gray-600">Email: info@nerakcos.com</p>
                    <p className="text-gray-600">Phone: +31-613030082</p>
                    <p className="text-gray-600">Address: 18193 Granada, Espana</p>
                    <p className="text-gray-600 mt-4">Hours: Mon-Fri, 9 AM - 6 PM (CET)</p>
                  </div>

                  {/* Contact Form */}
                  <div className="bg-white bg-opacity-80 p-6 rounded-lg shadow-lg">
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
              <section className="mb-12 relative animate-slideIn">
                <div className="bg-slate-100  p-6 rounded-lg shadow-lg">
                  <h2 className="text-2xl font-montserrat text-slate-950 mb-4">Visit Us</h2>
                  <div className="w-full h-64 bg-slate-50 rounded" style={{ backgroundImage: "url('https://www.google.com/maps/place/18193+Granada,+Spain/@37.2303,-3.5974,15z/')" }}></div>
                 
                  <p className="text-slate-900 mt-2">18193 Granada, Espana</p>
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