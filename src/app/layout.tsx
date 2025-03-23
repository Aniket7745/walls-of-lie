"use client";

import "@fontsource/roboto/400.css";
import "@fontsource/roboto/700.css";
import "./globals.css";
import { useState, useEffect, useCallback } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Save audio state to localStorage
  const saveAudioState = useCallback((currentTime: number, playing: boolean) => {
    localStorage.setItem('audioState', JSON.stringify({
      currentTime,
      playing
    }));
  }, []);

  // Load audio state from localStorage
  useEffect(() => {
    setMounted(true);
    try {
      const audioElement = new Audio("/assets/bg-music.mp3");
      audioElement.loop = true;
      audioElement.volume = 0.5;
      
      // Load saved state first
      const savedState = localStorage.getItem('audioState');
      if (savedState) {
        const { currentTime, playing } = JSON.parse(savedState);
        audioElement.currentTime = currentTime;
        
        // Set up oncanplaythrough event to handle playback after loading
        audioElement.oncanplaythrough = () => {
          if (playing) {
            audioElement.play()
              .then(() => {
                setIsPlaying(true);
              })
              .catch(console.error);
          }
        };
      }

      // Save state periodically
      const saveInterval = setInterval(() => {
        if (audioElement) {
          saveAudioState(audioElement.currentTime, !audioElement.paused);
        }
      }, 1000);

      // Handle window unload to save state
      const handleUnload = () => {
        saveAudioState(audioElement.currentTime, !audioElement.paused);
      };
      window.addEventListener('beforeunload', handleUnload);

      const handleError = (e: Event) => {
        setError('Failed to load audio file');
        console.error('Audio error:', e);
      };

      audioElement.addEventListener('error', handleError);
      setAudio(audioElement);

      return () => {
        clearInterval(saveInterval);
        window.removeEventListener('beforeunload', handleUnload);
        audioElement.removeEventListener('error', handleError);
        if (audioElement) {
          saveAudioState(audioElement.currentTime, !audioElement.paused);
        }
        audioElement.pause();
        audioElement.src = "";
      };
    } catch (err) {
      setError('Failed to initialize audio');
      console.error('Audio initialization error:', err);
    }
  }, [saveAudioState]);

  const toggleMusic = useCallback(async () => {
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
        saveAudioState(audio.currentTime, false);
      } else {
        await audio.play();
        setIsPlaying(true);
        saveAudioState(audio.currentTime, true);
      }
    } catch (err) {
      setError('Failed to play audio');
      console.error('Playback error:', err);
    }
  }, [audio, isPlaying, saveAudioState]);

  return (
    <html lang="en">
      <body className="font-sans">
        {mounted && (
          <div className="fixed bottom-4 left-4 z-50 flex items-center gap-4">
            {error && (
              <div className="text-red-500 text-sm bg-white/80 px-2 py-1 rounded">
                {error}
              </div>
            )}
            <button
              onClick={toggleMusic}
              disabled={!audio || !!error}
              className={`p-3 rounded-full ${
                !audio || error 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-pink-500/70 hover:bg-pink-500/90'
              } text-white shadow-lg backdrop-blur-md transition-all duration-300`}
              aria-label={isPlaying ? "Pause Music" : "Play Music"}
            >
              {isPlaying ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </button>
          </div>
        )}
        {children}
      </body>
    </html>
  );
}
