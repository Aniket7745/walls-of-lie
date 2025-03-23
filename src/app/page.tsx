"use client";

import React from "react";
import Link from "next/link";
import SakuraPetals from "@/components/SakuraPetals";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="relative w-full h-screen overflow-hidden">
      {/* Sakura Petals Animation */}
      <SakuraPetals />

      {/* Full-screen background */}
      <div className="absolute inset-0">
        <Image
          src="/assets/image3.jpg" // Ensure this image is placed in public/assets
          alt="Scenic Background"
          width={1920} // Add width
          height={1080} // Add height
          className="w-full h-full object-cover"
        />
        {/* Stronger overlay for better contrast */}
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      {/* Hero content */}
      <div className="relative flex flex-col items-center justify-center h-full text-center text-white px-4">
        <h1
          className="
            text-5xl
            md:text-7xl
            font-bold
            mb-4
            drop-shadow-[0_1.5px_1.5px_rgba(0,0,0,0.7)]
          "
        >
          Walls of Lies
        </h1>
        <p
          className="
            text-xl
            md:text-2xl
            mb-4
            drop-shadow-[0_1px_1px_rgba(0,0,0,0.7)]
          "
        >
          Inspired from Your Lie in April
        </p>
        <p
          className="
            text-lg
            md:text-xl
            mb-8
            drop-shadow-[0_1px_1px_rgba(0,0,0,0.7)]
          "
        >
          once we meet somebody we can no longer be alone.
        </p>
        <div className="flex space-x-4">
          <Link
            href="/stories"
            className="
              px-6 py-3
              bg-pink-500/70
              hover:bg-pink-500/90
              text-white
              rounded-lg
              text-lg
              transition
              duration-300
              shadow-lg
              backdrop-blur-md
              drop-shadow-[0_1px_1px_rgba(0,0,0,0.7)]
            "
          >
            View Stories
          </Link>
          <Link
            href="/add-story"
            className="
              px-6 py-3
              bg-purple-500/70
              hover:bg-purple-500/90
              text-white
              rounded-lg
              text-lg
              transition
              duration-300
              shadow-lg
              backdrop-blur-md
              drop-shadow-[0_1px_1px_rgba(0,0,0,0.7)]
            "
          >
            Share Your Story
          </Link>
        </div>
      </div>
    </main>
  );
}
