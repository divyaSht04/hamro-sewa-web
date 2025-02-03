import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: 'What services does Hamro Sewa offer?',
    answer: 'Hamro Sewa offers a wide range of services including home cleaning, plumbing, electrical work, gardening, painting, and carpentry. We aim to be your one-stop solution for all your home service needs.',
  },
  {
    question: 'How do I book a service?',
    answer: 'Booking a service with Hamro Sewa is easy! You can book online through our website, use our mobile app, or call our customer service hotline. Choose your service, select a convenient date and time, and our professional will be there.',
  },
  {
    question: 'Are your professionals vetted and insured?',
    answer: 'Yes, all our professionals undergo thorough background checks and are fully insured. We prioritize your safety and peace of mind, ensuring that only trusted and skilled individuals enter your home.',
  },
  {
    question: 'What is your cancellation policy?',
    answer: 'We understand that plans can change. You can cancel or reschedule your appointment up to 24 hours before the scheduled service time without any charge. Cancellations within 24 hours may incur a small fee.',
  },
  {
    question: 'Do you offer any guarantees on your services?',
    answer: 'Yes, we stand behind the quality of our work. If youre not satisfied with a service, please let us know within 7 days and well make it right at no additional cost to you.',
  },
];

function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="bg-gray-100 py-16">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800" data-aos="fade-up">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="mb-4" data-aos="fade-up" data-aos-delay={index * 100}>
              <button
                className="flex justify-between items-center w-full bg-white p-4 rounded-lg shadow-md focus:outline-none"
                onClick={() => toggleFAQ(index)}
              >
                <span className="font-semibold text-left">{faq.question}</span>
                {activeIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              {activeIndex === index && (
                <div className="bg-white p-4 rounded-b-lg shadow-md mt-1">
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQ;

