'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AddStoryPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, author }),
      });
      if (res.ok) {
        router.push('/stories');
      } else {
        console.error('Failed to add story');
      }
    } catch (error) {
      console.error('Error adding story:', error);
    }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-gray-900">
      {/* Background Image with Darker Overlay */}
      <div className="absolute inset-0">
        <Image
          src="/assets/image4.jpg"
          alt="Background"
          layout="fill"
          objectFit="cover"
          className="brightness-50"
        />
        <div className="absolute inset-0 bg-amber-300 opacity-10"></div>
      </div>

      {/* Form Container - Darker Box */}
      <div className="bg-black/0 backdrop-blur-xl shadow-2xl border border-white/20 rounded-lg p-8 w-full max-w-2xl relative">
        {/* Header */}
        <header className="text-center mb-6">
          <h1 className="text-4xl font-extrabold text-white drop-shadow-lg">
            ♫ ♩ ♪ ♬ Add Your Story ♬ ♪ ♩ ♫
          </h1>
        </header>

        <h2 className="text-xl font-semibold mb-4 text-center text-white drop-shadow-lg">
          Compose Your Story
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title Field */}
          <div>
            <label htmlFor="title" className="block font-semibold mb-1 text-white drop-shadow-lg">
              Title
            </label>
            <input
              id="title"
              type="text"
              className="w-full border border-gray-400 rounded-md p-3 bg-transparent text-white placeholder-gray-300 focus:ring-2 focus:ring-pink-400 focus:outline-none transition"
              placeholder="e.g. A Spring Promise"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Content Field */}
          <div>
            <label htmlFor="content" className="block font-semibold mb-1 text-white drop-shadow-lg">
              Story (Feel free to pour your heart out)
            </label>
            <textarea
              id="content"
              rows={6}
              className="w-full border border-gray-400 rounded-md p-3 bg-transparent text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              placeholder="Write your story..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>
          </div>

          {/* Author Field */}
          <div>
            <label htmlFor="author" className="block font-semibold mb-1 text-white drop-shadow-lg">
              Your Name (keep it anonymous if you wish)
            </label>
            <input
              id="author"
              type="text"
              className="w-full border border-gray-400 rounded-md p-3 bg-transparent text-white placeholder-gray-300 focus:ring-2 focus:ring-purple-400 focus:outline-none transition"
              placeholder="e.g. Kaori"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white rounded-lg hover:scale-105 hover:shadow-xl transition transform duration-300"
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
