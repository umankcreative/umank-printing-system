import React from 'react';
import { Award, Clock, Users, Printer } from 'lucide-react';

const About: React.FC = () => {
  const features = [
    {
      icon: <Award className="h-8 w-8 text-cyan-500" />,
      title: 'Premium Quality',
      description:
        'We use state-of-the-art printing technology and premium materials',
    },
    {
      icon: <Clock className="h-8 w-8 text-cyan-500" />,
      title: 'Fast Turnaround',
      description: 'Quick delivery without compromising on quality',
    },
    {
      icon: <Users className="h-8 w-8 text-cyan-500" />,
      title: 'Expert Team',
      description: 'Skilled professionals with years of industry experience',
    },
    {
      icon: <Printer className="h-8 w-8 text-cyan-500" />,
      title: 'Modern Equipment',
      description: 'Latest printing technology for optimal results',
    },
  ];

  return (
    <section id="about" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div
          className="text-center mb-12"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Tentang Umank Creative
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Mitra terpercaya anda dalam solusi cetak premium sejak 2009
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative" data-aos="fade-right" data-aos-delay="400">
            <img
              src="https://images.pexels.com/photos/6224/hands-people-woman-working.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Umank Creative Printing Facility"
              className="rounded-lg shadow-xl"
            />
            <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg">
              <p className="text-2xl font-bold text-gray-900">16+</p>
              <p className="text-sm text-gray-600">Tahun Pengalaman</p>
            </div>
          </div>

          <div className="space-y-6" data-aos="fade-left" data-aos-delay="400">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Excellence in Every Print
              </h3>
              <p className="text-gray-600 mb-6">
                Di Umank Creative, kami menggabungkan visi artistik dengan keahlian teknis untuk menyediakan solusi cetak yang luar biasa. Komitmen kami untuk kualitas dan inovasi telah membuat kami mitra terpercaya bagi berbagai bisnis di Indonesia.
              </p>
              <p className="text-gray-600">
                Dengan peralatan teknologi terkini dan tim profesional yang terampil, kami menangani proyek dengan skala apa saja dengan presisi dan perhatian. Dari konsep hingga penyelesaian, kami memastikan setiap detail memenuhi standar kualitas yang tinggi.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="bg-white p-6 rounded-lg shadow-md"
                  data-aos="fade-up"
                  data-aos-delay={600 + index * 200}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">{feature.icon}</div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">
                        {feature.title}
                      </h4>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
