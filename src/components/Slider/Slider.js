import React from 'react';
import { Carousel } from 'antd';
import slider1 from '../../assets/slider/slider1.jpg';
import slider2 from '../../assets/slider/slider2.jpg';
import slider3 from '../../assets/slider/slider3.jpg';
import slider4 from '../../assets/slider/slider4.jpg';
import './index.css';

export default function Slider() {
  return (
    <Carousel autoplay>
      <div className="slider-img">
        <img src={slider1} />
      </div>
      <div className="slider-img">
        <img src={slider2} />
      </div>
      <div className="slider-img">
        <img src={slider3} />
      </div>
      <div className="slider-img">
        <img src={slider4} />
      </div>
    </Carousel>
  );
}
