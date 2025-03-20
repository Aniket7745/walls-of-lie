"use client";

import { useState, useEffect, useRef } from "react";
import Draggable from "react-draggable";
import Image from 'next/image';

interface Story {
  _id: string;
  title?: string;
  content: string;
  author: string;
  createdAt: string;
}

interface PositionedStory extends Story {
  left: number;
  top: number;
  rotation: number;
  initialX: number;
  initialY: number;
  zIndex: number;
}

interface DraggableStoryCardProps {
  story: PositionedStory;
  onSelect: (story: PositionedStory) => void;
  onHover: (id: string) => void;
}

function DraggableStoryCard({
  story,
  onSelect,
  onHover,
}: DraggableStoryCardProps) {
  const nodeRef = useRef<HTMLDivElement>(null);

  return (
    <Draggable
      nodeRef={nodeRef as React.RefObject<HTMLElement>}
      defaultPosition={{ x: story.initialX, y: story.initialY }}
    >
      <div
        ref={nodeRef as React.RefObject<HTMLDivElement>}
        onClick={() => onSelect(story)}
        onMouseEnter={() => onHover(story._id)}
        style={{
          transform: `rotate(${story.rotation}deg)`,
          backgroundColor: "#fdf6e3",
          backgroundImage: "url('/assets/paper-texture.png')",
          backgroundSize: "cover",
          backgroundBlendMode: "multiply",
          zIndex: story.zIndex,
        }}
        className="
          absolute
          w-[140px] h-[100px]
          p-2
          bg-white
          rounded-md
          shadow-md
          flex flex-col
          justify-between
          border border-gray-300
          text-gray-800
          cursor-pointer
          transform-gpu
          transition-all
          duration-100
          hover:scale-100
          hover:rotate-.9
        "
      >
        <h2 className="text-sm font-semibold text-gray-900 text-center">
          {story.title}
        </h2>
        <div className="text-center text-[10px] text-gray-600 italic mt-auto">
          — {story.author}
        </div>
        <p className="text-[9px] text-gray-500 text-center">
          {new Date(story.createdAt).toLocaleDateString()}
        </p>
      </div>
    </Draggable>
  );
}

function getRandomPosition(
  existing: PositionedStory[],
  width: number,
  height: number
): { x: number; y: number } {
  const maxAttempts = 100;
  for (let i = 0; i < maxAttempts; i++) {
    const x = Math.random() * 70 + 10;
    const y = Math.random() * 70 + 10;
    const px = (x / 100) * width;
    const py = (y / 100) * height;
    if (
      !existing.some(
        (s) => Math.abs(s.initialX - px) < 160 && Math.abs(s.initialY - py) < 200
      )
    ) {
      return { x: px, y: py };
    }
  }
  return { x: Math.random() * width, y: Math.random() * height };
}

export default function StoriesPage() {
  const [stories, setStories] = useState<PositionedStory[]>([]);
  const [selectedStory, setSelectedStory] = useState<PositionedStory | null>(null);
  const [pages, setPages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [zCounter, setZCounter] = useState(10);

  useEffect(() => {
    fetch("/api/stories")
      .then((res) => res.json())
      .then((data: Story[]) => {
        const width = window.innerWidth;
        const height = window.innerHeight;

        const positioned: PositionedStory[] = [];
        data.reverse().forEach((story) => {
          const { x, y } = getRandomPosition(positioned, width, height);
          positioned.push({
            ...story,
            left: x,
            top: y,
            rotation: Math.floor(Math.random() * 30) - 15,
            initialX: x,
            initialY: y,
            zIndex: zCounter,
          });
        });
        setStories(positioned);
      })
      .catch((error) => console.error("Error fetching stories:", error));
  }, [zCounter]);

  const handleSelectStory = (story: PositionedStory) => {
    setSelectedStory(story);
    setPages(story.content.match(/.{1,500}/g) || []);
    setCurrentPage(0);
  };

  const handleHover = (id: string) => {
    setStories((prev) =>
      prev.map((s) => (s._id === id ? { ...s, zIndex: zCounter + 1 } : s))
    );
    setZCounter((prev) => prev + 1);
  };

  return (
    <main className="relative w-full h-screen overflow-hidden">
      <Image
        src="/assets/image2.jpg"
        alt="Wooden Floor Background"
        layout="fill"
        objectFit="cover"
        className="absolute inset-0 w-full h-full -z-10"
      />
      {stories.map((story) => (
        <DraggableStoryCard
          key={story._id}
          story={story}
          onSelect={handleSelectStory}
          onHover={handleHover}
        />
      ))}
      {selectedStory && (
        <div
          className="fixed inset-0 bg-transparent backdrop-blur-lg flex items-center justify-center z-50"
          onClick={() => setSelectedStory(null)}
        >
          <div
            className="
              relative p-6 w-[420px] h-[594px] bg-[#fdf6e3] rounded-lg shadow-lg border border-gray-300
              text-gray-800 font-serif italic bg-opacity-90 flex flex-col justify-between
            "
            style={{
              backgroundImage: "url('/assets/music-sheet-texture.png')",
              backgroundSize: "cover",
              backgroundBlendMode: "multiply",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 bg-[url('/assets/music-notes-faint.png')] bg-contain opacity-20 pointer-events-none"></div>
            <h2 className="text-xl font-mono tracking-wide italic mb-2">
              {selectedStory.title || "Untitled Story"}
            </h2>
            <div className="flex-grow overflow-hidden flex flex-col">
              <p className="text-base leading-relaxed whitespace-pre-wrap">
                {pages[currentPage]}
              </p>
            </div>
            <div className="text-right text-sm text-gray-600 italic mt-2">
              — {selectedStory.author}
            </div>
            <p className="text-xs text-gray-500">
              {new Date(selectedStory.createdAt).toLocaleString()}
            </p>
            <div className="flex justify-between mt-4">
              {currentPage > 0 && (
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded"
                >
                  &lt; Prev Page
                </button>
              )}
              {currentPage < pages.length - 1 && (
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded ml-auto"
                >
                  Next Page &gt;
                </button>
              )}
            </div>
            <button
              onClick={() => setSelectedStory(null)}
              className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
