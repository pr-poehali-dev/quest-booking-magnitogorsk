import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

interface QuestCardProps {
  title: string;
  image: string;
  alt: string;
  link: string;
}

const QuestCard = ({ title, image, alt, link }: QuestCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Добавляем эффект случайного мерцания
  useEffect(() => {
    const flickerInterval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% шанс начать мерцание
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 200 + Math.random() * 300);
      }
    }, 2000);
    
    return () => clearInterval(flickerInterval);
  }, []);

  return (
    <Link 
      to={link}
      className={`
        block relative overflow-hidden group transition-all duration-300
        transform hover:scale-105 hover:rotate-1
        ${isHovered ? 'z-10' : 'z-1'}
        ${isAnimating ? 'animate-pulse' : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="caution-border bg-black bg-opacity-70 p-6 h-full flex flex-col items-center">
        {/* Внутренняя рамка, которая светится при наведении */}
        <div className={`
          absolute inset-1 border-2 border-yellow-DEFAULT opacity-0 
          transition-opacity duration-300 
          ${isHovered ? 'opacity-100' : ''}
        `}></div>
        
        <div className="mb-4 relative">
          <img 
            src={image} 
            alt={alt} 
            className="w-40 h-40 object-cover rounded-lg transform transition-all duration-300 group-hover:brightness-125"
          />
          
          {/* Светящийся ореол вокруг изображения */}
          <div className={`
            absolute inset-0 rounded-lg 
            transition-all duration-300
            ${isHovered ? 'box-shadow-xl shadow-yellow-DEFAULT glow-effect' : ''}
            pointer-events-none
          `}></div>
        </div>
        
        <h3 className={`
          text-2xl font-bold text-center transition-all duration-300
          ${isHovered ? 'text-yellow-neon text-outline' : 'text-yellow-DEFAULT'} 
          ${isAnimating ? 'text-outline' : ''}
        `}>
          {title}
        </h3>
        
        {/* Кнопка "Подробнее", которая появляется при наведении */}
        <div className={`
          mt-4 opacity-0 transform translate-y-4 
          transition-all duration-300 
          ${isHovered ? 'opacity-100 translate-y-0' : ''}
        `}>
          <span className="px-4 py-2 bg-yellow-DEFAULT text-black font-bold rounded hover:bg-yellow-bright">
            Подробнее
          </span>
        </div>
      </div>
      
      {/* Эффект свечения при наведении */}
      <div className={`
        absolute inset-0 bg-yellow-DEFAULT opacity-0 
        transition-opacity duration-300 blur-xl
        ${isHovered ? 'opacity-20' : ''}
        pointer-events-none
      `}></div>
    </Link>
  );
};

export default QuestCard;
