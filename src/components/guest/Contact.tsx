import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div
          className="text-center mb-12"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Get In Touch
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Ready to start your printing project? Contact us today for a free
            consultation and quote.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div
            className="bg-gray-50 rounded-lg p-8"
            data-aos="fade-right"
            data-aos-delay="400"
          >
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              Contact Information
            </h3>

            <div className="space-y-6">
              <div
                className="flex items-start"
                data-aos="fade-up"
                data-aos-delay="600"
              >
                <MapPin className="h-6 w-6 text-cyan-500 mt-1 mr-4" />
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Address</h4>
                  <p className="text-gray-600">
                    Jl. Raya Kuta No.88, Kuta
                    <br />
                    Badung, Bali 80361
                  </p>
                </div>
              </div>

              <div
                className="flex items-start"
                data-aos="fade-up"
                data-aos-delay="700"
              >
                <Phone className="h-6 w-6 text-cyan-500 mt-1 mr-4" />
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Phone</h4>
                  <p className="text-gray-600">+62 361 4755575</p>
                </div>
              </div>

              <div
                className="flex items-start"
                data-aos="fade-up"
                data-aos-delay="800"
              >
                <Mail className="h-6 w-6 text-cyan-500 mt-1 mr-4" />
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Email</h4>
                  <p className="text-gray-600">info@umank.com</p>
                </div>
              </div>
            </div>

            <div className="mt-8" data-aos="fade-up" data-aos-delay="900">
              <h4 className="font-medium text-gray-900 mb-4">Business Hours</h4>
              <ul className="space-y-2 text-gray-600">
                <li className="flex justify-between">
                  <span>Monday - Friday:</span>
                  <span>8:00 AM - 5:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Saturday:</span>
                  <span>9:00 AM - 2:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Sunday:</span>
                  <span>Closed</span>
                </li>
              </ul>
            </div>
          </div>

          <div data-aos="fade-left" data-aos-delay="400">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="+62 xxx-xxxx-xxxx"
                />
              </div>

              <div>
                <label
                  htmlFor="service"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Service Interested In
                </label>
                <select
                  id="service"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  <option value="">Select a service</option>
                  <option value="digital-printing">Digital Printing</option>
                  <option value="offset-printing">Offset Printing</option>
                  <option value="packaging">Packaging Solutions</option>
                  <option value="large-format">Large Format</option>
                  <option value="corporate-identity">Corporate Identity</option>
                  <option value="finishing">Finishing Services</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Project Details
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="Tell us about your project..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white font-medium rounded-lg flex items-center justify-center hover:from-cyan-600 hover:to-fuchsia-600 transition-colors"
              >
                Send Message
                <Send className="ml-2 h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
