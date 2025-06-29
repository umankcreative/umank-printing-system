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
            Hubungi Kami
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Siap untuk memulai proyek cetak Anda? Hubungi kami hari ini untuk konsultasi gratis dan penawaran.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div
            className="bg-gray-50 rounded-lg p-8"
            data-aos="fade-right"
            data-aos-delay="400"
          >
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              Informasi Kontak
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
                    Jl. Gatot Subroto, Gg.Mesjid 100 Meter dari depan gang
                    <br />
                    Samarinda, Kalimantan Timur 75111
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
                  <h4 className="font-medium text-gray-900 mb-1">Telepon</h4>
                  <p className="text-gray-600">+62 812 55691234</p>
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
                  <p className="text-gray-600">umank@umank.com</p>
                </div>
              </div>
            </div>

            <div className="mt-8" data-aos="fade-up" data-aos-delay="900">
              <h4 className="font-medium text-gray-900 mb-4">Jam Operasional</h4>
              <ul className="space-y-2 text-gray-600">
                <li className="flex justify-between">
                  <span>Senin - Jumat:</span>
                  <span>09:00 - 18:00</span>
                </li>
                <li className="flex justify-between">
                  <span>Sabtu:</span>
                  <span>09:00 - 18:00</span>
                </li>
                <li className="flex justify-between">
                  <span>Minggu:</span>
                  <span>Tutup (Via WA Saja)</span>
                </li>
              </ul>
            </div>
          </div>

          <div data-aos="fade-left" data-aos-delay="400">
            <form
              className="space-y-6"
              onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const formData = new FormData(form);
              const formatMessage = `Saya ${formData.get('name')}\nEmail: ${formData.get('email')}\nTelepon: ${formData.get('phone')}\nTertarik dengan Layanan: ${formData.get('service')}\nPesan: ${formData.get('message')}\nTerima Kasih!`;
              const url = 'https://wa.me/6281255691234?text=' + encodeURIComponent(formatMessage);
              window.open(url, '_blank');
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
                >
                Nama Lengkap
                </label>
                <input
                type="text"
                id="name"
                name="name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="Nama Lengkap"
                />
              </div>
              <div>
                <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
                >
                Email
                </label>
                <input
                type="email"
                id="email"
                name="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="Email"
                />
              </div>
              </div>

              <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                No. Telepon
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="No. Telepon"
              />
              </div>

              <div>
              <label
                htmlFor="service"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Layanan yang diminati
              </label>
              <select
                id="service"
                name="service"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="">Pilih Layanan</option>
                <option value="digital-printing">Cetak Digital</option>
                <option value="offset-printing">Cetak Offset</option>
                <option value="packaging">Pengemasan</option>
                <option value="large-format">Format Besar</option>
                <option value="corporate-identity">Identitas Perusahaan</option>
                <option value="finishing">Finishing</option>
                <option value="other">Lainnya</option>
              </select>
              </div>

              <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Detail Proyek
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="Tulis tentang proyek Anda..."
              ></textarea>
              </div>

              <button
              type="submit"
              className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white font-medium rounded-lg flex items-center justify-center hover:from-cyan-600 hover:to-fuchsia-600 transition-colors"
              >
              Kirim Pesan
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
