import React from 'react';
import Hero from '../components/hero';
import Lauchbutton from '../components/lauchbutton';
import imgvote from '../assets/images/vote1.jpg';

const Home = () => {
  return (
    <div>
      <Hero />
      <Lauchbutton />
      <div className="pt-12 pl-8">
        {/* Container for image and overlay */}
        <div className="relative h-[750px] w-[800px] overflow-hidden rounded-lg group">
          {/* Image */}
          <img 
            src={imgvote} 
            alt="Vote" 
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Overlay with text */}
          <div className="absolute inset-0 bg-white bg-opacity-40 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-black/50 text-7xl mb-[200px] font-bold tracking-wider">Make Your Choice</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
