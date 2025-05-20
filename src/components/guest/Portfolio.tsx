import React, { useState } from 'react';

interface PortfolioItem {
  image: string;
  title: string;
  category: string;
  description: string;
}

const portfolioItems: PortfolioItem[] = [
  {
    image:
      'https://images.pexels.com/photos/434346/pexels-photo-434346.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    title: 'Premium Business Cards',
    category: 'Digital Printing',
    description: 'Luxury business cards with spot UV and gold foil stamping.',
  },
  {
    image:
      'https://images.pexels.com/photos/851213/pexels-photo-851213.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    title: 'Product Catalogs',
    category: 'Offset Printing',
    description:
      'High-volume product catalogs with perfect binding and premium paper.',
  },
  {
    image:
      'https://images.pexels.com/photos/5611073/pexels-photo-5611073.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    title: 'Custom Food Packaging',
    category: 'Packaging',
    description:
      'Food-grade packaging with custom designs and protective coatings.',
  },
  {
    image:
      'https://images.pexels.com/photos/4467734/pexels-photo-4467734.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    title: 'Exhibition Graphics',
    category: 'Large Format',
    description: 'Large format prints for trade shows and exhibitions.',
  },
  {
    image:
      'https://images.pexels.com/photos/6243745/pexels-photo-6243745.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    title: 'Corporate Stationery',
    category: 'Corporate Identity',
    description: 'Complete corporate identity package with premium finishes.',
  },
  {
    image:
      'https://images.pexels.com/photos/3182750/pexels-photo-3182750.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    title: 'Special Finish Products',
    category: 'Finishing Services',
    description: 'Products showcasing various premium finishing techniques.',
  },
];

const Portfolio: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const categories = [
    'All',
    'Digital Printing',
    'Offset Printing',
    'Packaging',
    'Large Format',
    'Corporate Identity',
    'Finishing Services',
  ];

  const filteredItems =
    filter === 'All'
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === filter);

  return (
    <section id="portfolio" className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div
          className="text-center mb-12"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Portfolio
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Explore our diverse range of printing projects that showcase our
            commitment to quality and innovation.
          </p>
        </div>

        <div
          className="flex flex-wrap justify-center mb-10"
          data-aos="fade-up"
          data-aos-delay="400"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-4 py-2 m-2 rounded-full text-sm font-medium transition-colors ${
                filter === category
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item, index) => (
            <div
              key={index}
              className="group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
              data-aos="fade-up"
              data-aos-delay={600 + index * 100}
            >
              <div className="relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <p className="text-white font-medium mb-2">
                    {item.description}
                  </p>
                  <button className="bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-medium">
                    View Details
                  </button>
                </div>
              </div>
              <div className="p-6">
                <span className="text-xs font-medium text-cyan-500 uppercase tracking-wider">
                  {item.category}
                </span>
                <h3 className="text-xl font-semibold text-gray-800 mt-2">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        <div
          className="text-center mt-12"
          data-aos="fade-up"
          data-aos-delay="800"
        >
          <button className="px-6 py-3 border-2 border-gray-900 text-gray-900 font-medium rounded-lg hover:bg-gray-900 hover:text-white transition-colors">
            View All Projects
          </button>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
