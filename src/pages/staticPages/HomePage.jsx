import React from 'react';
import HeroSection from '../../components/HeroSection';
import AboutSection from '../../components/AboutSection';
import ServicesList from '../../components/ServiceList';
import Testimonials from '../../components/Testimonials';
import FAQ from '../../components/FAQ';

function HomePage() {
  return (
    <div>
      <HeroSection />
      <AboutSection />
      <ServicesList />
      <Testimonials />
      <FAQ />
    </div>
  );
}

export default HomePage;

