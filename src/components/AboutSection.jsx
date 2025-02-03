import React from 'react';
import { Users, Target, Award } from 'lucide-react';

function AboutSection() {
  const features = [
    { icon: <Users size={40} />, title: 'Our Vision', description: 'To revolutionize the service industry through technology and innovation.' },
    { icon: <Target size={40} />, title: 'Our Mission', description: 'Delivering exceptional services that simplify lives and exceed expectations.' },
    { icon: <Award size={40} />, title: 'Our Values', description: 'Integrity, excellence, and customer satisfaction guide everything we do.' },
  ];

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-8 text-gray-800" data-aos="fade-up">About Hamro Sewa</h2>
        <div className="max-w-3xl mx-auto text-center mb-12" data-aos="fade-up" data-aos-delay="200">
          <p className="text-gray-600 text-lg mb-6">
            Hamro Sewa is a cutting-edge platform dedicated to providing modern and efficient services to our community. Our mission is to simplify everyday tasks and connect people with reliable service providers.
          </p>
          <p className="text-gray-600 text-lg">
            With a focus on user experience and quality, we strive to make service acquisition seamless and satisfying for both our clients and service partners.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-100 p-6 rounded-lg shadow-md transition duration-300 hover:shadow-xl" data-aos="fade-up" data-aos-delay={`${(index + 1) * 200}`}>
              <div className="text-primary mb-4">{feature.icon}</div>
              <h3 className="font-semibold text-xl mb-2 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AboutSection;

