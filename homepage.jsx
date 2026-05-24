import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css';
import { useState, useRef, useEffect } from 'react';
import Navbar from '../components/navbar';
import AnimatedBlockType1 from '../components/animatedBlock';
import AnimatedContent from '../components/AnimatedContent';
import MagicBento from '../components/MagicBento';
import GlitchText from '../components/GlitchText';
import TextType from '../components/TextType';
import Particles from '../components/Particles'

const homepage = () => {

  return (
    // Body
    <div className="h-screen w-90  overflow-y-scroll scroll-snap-y snap-mandatory scroll-smooth">
      <header className="">
        <Navbar />
      </header>
      {/* Section1 */}
      <div className="h-screen w-98 flex flex-col  bg-homepage-bg bg-cover bg-center snap-start">
        <div className="flex-1 flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold rounded-lg text-center max-w-sm text-white">The only help your journey needs</h1>
          <h3 className=" mb-2 items-center text-center"><span className="text-white">Elevate your school experience, your</span> <span className="text-white">grades and effectiveness with scap</span></h3>
          <div className="flex gap-3">
            <Link to={'/login'}>
            <button className="bg-black flex justify-center
                              p-3 align-middle rounded-lg text-md text-white transition-all duration-300 hover:bg-white hover:text-black ">Login</button></Link>
            <button className="bg-accent-color rounded-lg text-white flex justify-center
                              p-3 align-middle transition-all duration-300 hover:bg-white hover:text-black ">Join for free</button>
          </div>
        </div>
      </div>
      {/* Section2 */}
      <div className="h-screen w-98 flex flex-col snap-start items-center">
        <div className="flex-1 flex flex-col p-10 w-full justify-center mt-70px">
          {/* upper part of section */}
          <div className="mt-[60px] w-full flex flex-1 flex-col justify-between md:flex-row md:p-10">
            <div className="flex flex-col gap-2 mt-[10px] text-3xl ">
              <div className="font-bold">
                <TextType
                  text={["Built For Academic Success.", "More than an app.", "Customize scap to work the way you do."]}
                  typingSpeed={125}
                  pauseDuration={1500}
                  showCursor={true}
                  cursorCharacter="|"
                />
              </div>
            </div>
          </div>
          {/* Lower part of section */}
          <div className="flex-1 flex flex-col md:flex-row p-10 gap-4 max-w-8/10 justify-center">
            <MagicBento
              textAutoHide={true}
              enableStars={true}
              enableSpotlight={true}
              enableBorderGlow={true}
              enableTilt={true}
              enableMagnetism={true}
              clickEffect={true}
              spotlightRadius={300}
              particleCount={200}
              glowColor="132, 0, 255"
            />
          </div>
        </div>
      </div>
    </div >
  )
}

export default homepage
