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
      // Увеличено время восстановления буквы
      setTimeout(() => {
        setFlickeringLetters(prev => ({
          ...prev,
          [letterIndex]: true
        }));
      }, Math.random() * 700 + 200); // Увеличено время с 500+100 до 700+200
    };

    // Запускаем мигание с интервалом
    // Увеличен интервал для замедления эффекта мигания
    const interval = setInterval(() => {
      // Мигание от 1 до 2 букв за раз (уменьшено с 1-3)
      const flickerCount = Math.floor(Math.random() * 2) + 1;
      for (let i = 0; i < flickerCount; i++) {
        setTimeout(flickerRandomLetter, Math.random() * 300); // Увеличено с 200 до 300
      }
    }, 800); // Значительно увеличен интервал с 300 до 800 мс

    return () => clearInterval(interval);
  }, [title, subtitle]);

  // Функция рендеринга буквы с эффектом мигания
  const renderLetter = (letter: string, index: number, isTitle: boolean) => {
    const visible = flickeringLetters[isTitle ? index : index + title.length];
    const letterStyle = `
      ${isTitle ? 'text-5xl md:text-7xl lg:text-9xl' : 'text-2xl md:text-3xl lg:text-4xl'} 
      inline-block font-bold 
      ${visible ? 'text-yellow-neon opacity-100' : 'text-yellow-neon opacity-0'} 
      transition-opacity duration-200
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
