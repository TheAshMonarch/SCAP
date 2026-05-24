'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MagicBento from '../components/MagicBento'
import Navbar from '../components/navbar'
import homeBg from "../static/images/bg_0.jpg" 

// TextType component - animates text typing effect
interface TextTypeProps {
  text: string[];
  typingSpeed?: number;
  pauseDuration?: number;
  showCursor?: boolean;
  cursorCharacter?: string;
}

const TextType = ({ text, typingSpeed = 125, pauseDuration = 1500, showCursor = true, cursorCharacter = '|' }: TextTypeProps) => {
  const [displayText, setDisplayText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (charIndex < text[textIndex].length) {
        setDisplayText(prev => prev + text[textIndex][charIndex]);
        setCharIndex(charIndex + 1);
      } else {
        setTimeout(() => {
          setTextIndex((textIndex + 1) % text.length);
          setDisplayText('');
          setCharIndex(0);
        }, pauseDuration);
      }
    }, typingSpeed);
    return () => clearTimeout(timer);
  }, [charIndex, textIndex, text, typingSpeed, pauseDuration]);

  return (
    <div>
      {displayText}
      {showCursor && <span className="animate-pulse">{cursorCharacter}</span>}
    </div>
  );
};



export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = document.cookie.includes('scap_token=');
    if (token) {
      router.push('/');
    } else {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen w-full overflow-y-scroll scroll-snap-y snap-mandatory scroll-smooth">
      <header className="">
        <Navbar />
      </header>
      {/* Section1 */}
      <div className="h-screen w-full flex flex-col  bg-homepage-bg bg-cover bg-center snap-start">
        <div className="flex-1 flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold rounded-lg text-center max-w-sm text-white">The only help your journey needs</h1>
          <h3 className=" mb-2 items-center text-center"><span className="text-white">Elevate your school experience, your</span> <span className="text-white">grades and effectiveness with scap</span></h3>
          <div className="flex gap-3">
            <Link href='/auth'>
            <button className="bg-black flex justify-center
                              p-3 align-middle rounded-lg text-md text-white transition-all duration-300 hover:bg-white hover:text-black ">Login</button></Link>
            <button className="bg-accent-color rounded-lg text-white flex justify-center
                              p-3 align-middle transition-all duration-300 hover:bg-white hover:text-black ">Join for free</button>
          </div>
        </div>
      </div>
      {/* Section2 */}
      <div className="h-screen w-full flex flex-col snap-start items-center bg-white">
        <div className="flex-1 flex flex-col p-10 w-full justify-center mt-70px">
          {/* upper part of section */}
          <div className="mt-[60px] w-full flex flex-1 flex-col justify-between md:flex-row md:p-10">
            <div className="flex flex-col gap-2 mt-[10px] text-3xl ">
              <div className="font-bold text-black">
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
          <div className="flex-1 flex flex-col md:flex-row p-10 gap-4 max-w-full justify-center">
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
  );
}
