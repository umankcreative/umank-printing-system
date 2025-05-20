import React from 'react';
import { Star, Quote } from 'lucide-react';

interface Testimonial {
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    name: 'Sarah Johnson',
    role: 'Marketing Director',
    company: 'Elevate Studios',
    content:
      'Umank Creative has been our printing partner for over 3 years. Their attention to detail and color accuracy is unmatched. Our marketing materials always come out perfect!',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    role: 'Event Coordinator',
    company: 'Global Events',
    content:
      'We needed rush printing for a major conference, and Umank delivered everything ahead of schedule without compromising on quality. Truly impressed with their service.',
    rating: 5,
  },
  {
    name: 'Ava Williams',
    role: 'Brand Manager',
    company: 'Fusion Brands',
    content:
      'The quality of their printing is excellent. Our catalog colors were exactly as designed, and the paper quality was superior. Will definitely use their services again.',
    rating: 4,
  },
];

const Testimonials: React.FC = () => {
  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`h-5 w-5 ${
            i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
          }`}
        />
      ));
  };

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 md:px-6">
        <div
          className="text-center mb-12"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We take pride in delivering exceptional printing services that
            exceed our clients' expectations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow duration-300 relative"
              data-aos="fade-up"
              data-aos-delay={400 + index * 200}
            >
              <Quote className="absolute top-4 right-4 h-10 w-10 text-gray-100" />

              <div className="flex mb-4">{renderStars(testimonial.rating)}</div>

              <p className="text-gray-600 mb-6 italic relative z-10">
                "{testimonial.content}"
              </p>

              <div className="flex items-center">
                <div className="flex-shrink-0 mr-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 flex items-center justify-center text-white font-semibold">
                    {testimonial.name.charAt(0)}
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          className="mt-12 text-center"
          data-aos="fade-up"
          data-aos-delay="800"
        >
          <p className="text-gray-600 font-medium mb-2">
            Trusted by 500+ businesses
          </p>
          <div className="flex flex-wrap justify-center gap-8 mt-6">
            {[
              'Acme Inc.',
              'TechGiant',
              'GlobalMedia',
              'InnovateCorp',
              'PrimeRetail',
            ].map((company, index) => (
              <div
                key={index}
                className="text-gray-400 font-bold text-xl"
                data-aos="fade-up"
                data-aos-delay={1000 + index * 100}
              >
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
