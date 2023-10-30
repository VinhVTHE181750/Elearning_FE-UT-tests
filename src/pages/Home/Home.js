import React from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Slider from '../../components/Slider/Slider';
import PageContent from '../../components/PageContent/PageContent';

export default function Home() {
  return (
    <>
      <Header />
      <Slider />
      <PageContent />
      <Footer />
    </>
  );
}
