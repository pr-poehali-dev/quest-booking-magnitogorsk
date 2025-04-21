import { useState, useEffect } from "react";

const FlickeringTitle = () => {
  const title = "Check_Out";
  const subtitle = "КВЕСТЫ МГН";
  
  // Состояние для отслеживания мигающих букв
  const [flickeringLetters, setFlickeringLetters] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Инициализация состояния для всех букв
    const initialState: Record<string, boolean> = {};
    [...title, ...subtitle].forEach((_, index) => {
      initialState[index] = true;
    });
    setFlickeringLetters(initialState);

    // Функция для случайного мигания букв
    const flickerRandomLetter = () => {
      const letterIndex = Math.floor(Math.random() * (title.length + subtitle.length));
      
      setFlickeringLetters(prev => ({
        ...prev,
        [letterIndex]: !prev[letterIndex]
      }));
      
      // Возвращаем букву к исходному состоянию через случайное время
      setTimeout(() => {
        setFlickeringLetters(prev => ({
          ...prev,
          [letterIndex]: true
        }));
      }, Math.random() * 500 + 100);
    };

    // Запускаем мигание с интервалом
    const interval = setInterval(() => {
      // Мигание от 1 до 3 букв за раз
      const flickerCount = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < flickerCount; i++) {
        setTimeout(flickerRandomLetter, Math.random() * 200);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [title, subtitle]);

  // Функция рендеринга буквы с эффектом мигания
  const renderLetter = (letter: string, index: number, isTitle: boolean) => {
    const visible = flickeringLetters[isTitle ? index : index + title.length];
    const letterStyle = `
      ${isTitle ? 'text-5xl md:text-7xl lg:text-9xl' : 'text-2xl md:text-3xl lg:text-4xl'} 
      inline-block font-bold 
      ${visible ? 'text-yellow-neon opacity-100' : 'text-yellow-neon opacity-0'} 
      transition-opacity duration-100
      ${visible ? 'text-outline animate-glow' : ''}
    `;
    
    return (
      <span key={`${isTitle ? 'title' : 'subtitle'}-${index}`} className={letterStyle}>
        {letter}
      </span>
    );
  };

  return (
    <div className="text-center -rotate-1 relative z-10">
      <div className="mb-4 overflow-hidden glitch-container">
        {title.split('').map((letter, index) => renderLetter(letter, index, true))}
      </div>
      <div className="overflow-hidden mt-3">
        {subtitle.split('').map((letter, index) => renderLetter(letter, index, false))}
      </div>
    </div>
  );
};

export default FlickeringTitle;
