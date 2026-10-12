"use client"

import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#FFF000] text-[#7EB6FF]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="font-script text-lg md:text-xl italic">
            THE VYZN
          </Link>

          {/* Center Nav */}
          <nav className="flex items-center gap-6">
            <a 
              href="https://www.instagram.com/thevyznn/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sm tracking-wider hover:opacity-70 transition-opacity underline underline-offset-4"
            >
              IG
            </a>
            <a 
              href="https://x.com/IMTHEVYZN" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sm tracking-wider hover:opacity-70 transition-opacity underline underline-offset-4"
            >
              X
            </a>
          </nav>


        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center px-4">
        {/* Content */}
        <div className="text-center -mt-24">
          <p className="text-sm md:text-base tracking-[0.25em] uppercase mb-1">
            NEW MUSIC ON ALL
          </p>
          <p className="text-sm md:text-base tracking-[0.25em] uppercase mb-10">
            STREAMING PLATFORMS
          </p>
          
          <a 
            href="https://linktr.ee/THEVYZN" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border border-[#7EB6FF] rounded-full px-14 py-4 font-script text-2xl md:text-3xl italic hover:bg-[#7EB6FF] hover:text-[#FFF000] transition-all duration-300"
          >
            Listen Now
          </a>
        </div>

        {/* Large Title */}
        <div className="absolute bottom-20 left-0 right-0 text-center px-4">
          <h1 className="font-display text-[20vw] md:text-[15vw] font-bold leading-[0.85] tracking-tight">
            THE VYZN
          </h1>
        </div>

        {/* Streaming Platform Links */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-between px-6 md:px-12">
          <a 
            href="https://open.spotify.com/artist/0sK9p2TNbpgG85opq595j1?si=9qcqNl8fQMSJCb4dxFfmiA" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs tracking-[0.15em] uppercase hover:opacity-70 transition-opacity underline underline-offset-4"
          >
            SPOTIFY
          </a>
          <a 
            href="https://music.apple.com/us/artist/the-vyzn/1821175128" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs tracking-[0.15em] uppercase hover:opacity-70 transition-opacity underline underline-offset-4"
          >
            APPLE MUSIC
          </a>
        </div>
      </section>

      {/* Artist Image Section with Marquee */}
      <section className="relative w-full">
        {/* Image */}
        <div className="relative w-full h-[80vh] md:h-screen">
          <Image
            src="/images/artist-performer.jpg"
            alt="THE VYZN"
            fill
            className="object-cover object-center"
          />
          
          {/* Marquee Overlay */}
          <div className="absolute inset-0 flex items-center overflow-hidden">
            <div className="flex whitespace-nowrap animate-marquee">
              <span className="font-script text-[20vw] md:text-[15vw] italic text-[#7EB6FF] drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)] mx-8">
                THE VYZN
              </span>
              <span className="font-script text-[20vw] md:text-[15vw] italic text-[#7EB6FF] drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)] mx-8">
                THE VYZN
              </span>
              <span className="font-script text-[20vw] md:text-[15vw] italic text-[#7EB6FF] drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)] mx-8">
                THE VYZN
              </span>
              <span className="font-script text-[20vw] md:text-[15vw] italic text-[#7EB6FF] drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)] mx-8">
                THE VYZN
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center">
        <p className="text-xs tracking-wider">
          © {new Date().getFullYear()} THE VYZN
        </p>
      </footer>
    </main>
  )
}
