// src/components/SakuraPetals.tsx
import React, { useEffect, useState } from 'react';

interface Petal {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
}

const NUM_PETALS = 50;

const generateRandomPetal = (id: number): Petal => ({
  id,
  left: Math.random() * 100, // percentage from 0 to 100%
  delay: Math.random() * 5, // seconds delay before animation starts
  duration: 5 + Math.random() * 10, // animation duration in seconds
  size: 15 + Math.random() * 20, // size in pixels
});

const SakuraPetals: React.FC = () => {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    const generatedPetals = Array.from({ length: NUM_PETALS }, (_, i) =>
      generateRandomPetal(i)
    );
    setPetals(generatedPetals);
  }, []);

  return (

    <div>
    <div className="fixed inset-0 pointer-events-none z-0">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="sakura-petal"
          style={{
            left: `${petal.left}%`,
            animationDelay: `${petal.delay}s`,
            animationDuration: `${petal.duration}s`,
            width: `${petal.size}px`,
            height: `${petal.size}px`,
          }}
        />
      ))}
       
    </div>
    
 <div className="fixed  inset-0 pointer-events-none z-1">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="sakura-petal"
          style={{
            left: `${petal.left}%`,
            animationDelay: `${petal.delay}s`,
            animationDuration: `${petal.duration}s`,
            width: `${petal.size}px`,
            height: `${petal.size}px`,
          }}
        />
      ))}
       
    </div>
</div>
  );
};

export default SakuraPetals;
