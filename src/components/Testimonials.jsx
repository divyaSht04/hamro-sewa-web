import React, { useEffect, useRef } from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Homeowner',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    content: 'Hamro Sewa has been a lifesaver! Their cleaning services are top-notch, and the staff is always professional and courteous.',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    role: 'Business Owner',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    content: 'Ive been using Hamro Sewa for our office maintenance needs, and they never disappoint. Reliable, efficient, and great value for money.',
    rating: 5,
  },
  {
    name: 'Emily Rodriguez',
    role: 'Apartment Resident',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    content: 'The gardening services from Hamro Sewa have transformed my balcony into a beautiful green space. Im extremely satisfied with their work!',
    rating: 4,
  },
  {
    name: 'David Thompson',
    role: 'Real Estate Agent',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    content: 'Hamro Sewas painting services are exceptional. Theyve helped me prepare numerous properties for sale, always delivering outstanding results.',
    rating: 5,
  },
  {
    name: 'Lisa Patel',
    role: 'Restaurant Owner',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    content: 'The plumbing team from Hamro Sewa saved my business from a potential disaster. Their quick response and expertise are unmatched.',
    rating: 5,
  },
];

function Testimonials() {
  const scrollRef = useRef(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    let animationFrameId;
    let startTime;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      
      if (scrollContainer) {
        scrollContainer.scrollLeft = (progress / 100) % (scrollContainer.scrollWidth - scrollContainer.clientWidth);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <section className="bg-white py-16 overflow-hidden">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800" data-aos="fade-up">What Our Customers Say</h2>
        <div 
          ref={scrollRef}
          className="flex overflow-x-hidden"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <div className="flex animate-scroll">
            {testimonials.concat(testimonials).map((testimonial, index) => (
              <div 
                key={index} 
                className="flex-shrink-0 w-80 mx-4 bg-gray-100 p-6 rounded-lg shadow-md"
                style={{ scrollSnapAlign: 'start' }}
              >
                <div className="flex items-center mb-4">
                  <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4" />
                  <div>
                    <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">{testimonial.content}</p>
                <div className="flex text-yellow-400">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={20} fill="currentColor" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;

