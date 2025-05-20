import React from 'react';
import {
  Printer,
  FileText,
  PenTool,
  Package,
  Image,
  BookOpen,
} from 'lucide-react';

const serviceItems = [
  {
    icon: <FileText className="h-10 w-10 mb-4 text-cyan-500" />,
    title: 'Digital Printing',
    description:
      'High-quality digital printing services for business cards, brochures, flyers, and marketing materials with fast turnaround times.',
  },
  {
    icon: <PenTool className="h-10 w-10 mb-4 text-fuchsia-500" />,
    title: 'Offset Printing',
    description:
      'Professional offset printing for large volume projects, ensuring consistent quality and vibrant colors.',
  },
  {
    icon: <Package className="h-10 w-10 mb-4 text-yellow-400" />,
    title: 'Packaging Solutions',
    description:
      'Custom packaging design and printing for product boxes, labels, and retail packaging with premium finishes.',
  },
  {
    icon: <Image className="h-10 w-10 mb-4 text-cyan-500" />,
    title: 'Large Format',
    description:
      'Wide format printing for banners, posters, signage, and exhibition materials with durable materials.',
  },
  {
    icon: <Printer className="h-10 w-10 mb-4 text-fuchsia-500" />,
    title: 'Corporate Identity',
    description:
      'Complete corporate identity packages including business cards, letterheads, envelopes, and promotional materials.',
  },
  {
    icon: <BookOpen className="h-10 w-10 mb-4 text-yellow-400" />,
    title: 'Finishing Services',
    description:
      'Professional finishing options including lamination, UV coating, die-cutting, embossing, and special effects.',
  },
];

const Services: React.FC = () => {
  return (
    <section id="services" className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div
          className="text-center mb-16"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Printing Services
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We provide comprehensive printing solutions with state-of-the-art
            technology and exceptional quality for all your business needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {serviceItems.map((service, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-8 hover:shadow-lg transition-shadow duration-300 border border-gray-100 hover:border-gray-200"
              data-aos="fade-up"
              data-aos-delay={400 + index * 100}
            >
              <div className="flex flex-col items-center text-center">
                {service.icon}
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div
          className="flex justify-center mt-12"
          data-aos="fade-up"
          data-aos-delay="800"
        >
          <button className="px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors">
            View All Services
          </button>
        </div>
      </div>
    </section>
  );
};

export default Services;
