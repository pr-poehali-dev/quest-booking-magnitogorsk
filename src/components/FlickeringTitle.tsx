import { useEffect, useState } from 'react';

const FlickeringTitle = () => {
  const [flickerStates, setFlickerStates] = useState<boolean[]>([]);
  const title = "Check_Out";
  
  useEffect(() => {
    // Initialize with all letters visible
    setFlickerStates(Array(title.length).fill(true));
    
    // Set up random flickering
    const intervals = title.split('').map((_, index) => {
      return setInterval(() => {
        setFlickerStates(prev => {
          const newState = [...prev];
          newState[index] = Math.random() > 0.5;
          return newState;
        });
      }, 100 + Math.random() * 3000);
    });
    
    return () => {
      intervals.forEach(clearInterval);
    };
  }, []);
  
  return (
    <div className="text-center">
      <h1 className="text-6xl font-bold mb-2">
        {title.split('').map((letter, index) => (
          <span 
            key={index} 
            className="flicker-letter text-orange-DEFAULT"
            style={{ 
              opacity: flickerStates[index] ? 1 : 0.2,
              '--flicker-duration': `${2 + Math.random() * 4}s`,
              '--flicker-delay': `${Math.random() * 2}s`
            } as React.CSSProperties}
          >
            {letter}
          </span>
        ))}
      </h1>
      <h2 className="text-3xl font-bold text-orange-DEFAULT">КВЕСТЫ МГН</h2>
    </div>
  );
};

export default FlickeringTitle;
