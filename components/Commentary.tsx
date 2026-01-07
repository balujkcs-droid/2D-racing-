
import React, { useEffect, useState } from 'react';

interface CommentaryProps {
  message: string;
}

const Commentary: React.FC<CommentaryProps> = ({ message }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!visible || !message) return null;

  return (
    <div className="absolute bottom-1/4 left-0 w-full flex justify-center pointer-events-none transition-all duration-300">
      <div className="bg-black/80 border-2 border-cyan-500 px-6 py-3 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.5)] transform animate-bounce">
        <p className="font-orbitron text-sm md:text-lg text-white font-bold italic">
          <span className="text-cyan-400 mr-2">GEMINI AI:</span>
          "{message}"
        </p>
      </div>
    </div>
  );
};

export default Commentary;
