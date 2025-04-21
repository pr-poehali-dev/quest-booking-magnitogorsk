import FlickeringTitle from "@/components/FlickeringTitle";
import WarningTape from "@/components/WarningTape";
import QuestCard from "@/components/QuestCard";
import { AlertTriangle } from "lucide-react";

const Index = () => {
  return (
    <div className="brick-wall-bg min-h-screen day-night-cycle">
      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Верхняя черно-желтая лента */}
        <WarningTape />
        
        {/* Название сайта с мигающими буквами */}
        <div className="py-10">
          <FlickeringTitle />
        </div>
        
        {/* Предупреждение */}
        <div className="max-w-3xl mx-auto my-12 text-center caution-border p-8 bg-black bg-opacity-80 relative animate-pulse">
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black p-2 rounded-full border-2 border-yellow-neon">
            <AlertTriangle size={32} className="text-yellow-neon animate-glow" />
          </div>
          
          <p className="text-2xl text-yellow-neon font-bold mb-6 text-outline">
            ВНИМАНИЕ!
          </p>
          
          <p className="text-xl text-orange-bright font-bold mb-4 text-glow">
            Вход в состоянии алкогольного и наркотического опьянения строго запрещен!
          </p>
          
          <p className="text-xl text-orange-bright text-glow">
            Также на квесте вам предстоит поползать, возьмите удобную обувь и одежду!
          </p>
        </div>
        
        {/* Карточки квестов */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto my-16">
          <QuestCard 
            title="Опасная зона" 
            image="/placeholder.svg" 
            alt="Противогаз" 
            link="/danger-zone" 
          />
          <QuestCard 
            title="В поисках артефакта" 
            image="/placeholder.svg" 
            alt="Золотая монета" 
            link="/artifact-quest" 
          />
          <QuestCard 
            title="Чайная зона" 
            image="/placeholder.svg" 
            alt="Чай и еда" 
            link="/tea-zone" 
          />
        </div>
        
        {/* Контактная информация */}
        <div className="max-w-3xl mx-auto mt-12 mb-8 text-right">
          <div className="caution-border p-8 bg-black bg-opacity-80 relative">
            <h3 className="text-2xl font-bold text-yellow-neon mb-6 text-outline">
              Информация для бронирования
            </h3>
            
            <p className="text-xl text-orange-bright mb-3 text-glow">
              По вопросам бронирования вы можете связаться с администратором по номеру телефона
            </p>
            
            <p className="text-2xl text-yellow-bright mb-5 font-bold text-outline">
              +7 (999) 123-45-67
            </p>
            
            <p className="text-xl text-orange-bright mb-2 text-glow">
              или в сообщениях группы ВК:
            </p>
            
            <a 
              href="https://vk.com/kvest_chekcout" 
              className="text-xl text-yellow-neon underline hover:text-yellow-bright transition-colors inline-block text-outline"
              target="_blank" 
              rel="noopener noreferrer"
            >
              https://vk.com/kvest_chekcout
            </a>
          </div>
        </div>
        
        {/* Нижняя черно-желтая лента */}
        <WarningTape />
      </div>
      
      {/* Декоративные элементы */}
      <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-yellow-DEFAULT opacity-10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-orange-DEFAULT opacity-10 rounded-full blur-3xl animate-pulse"></div>
    </div>
  );
};

export default Index;
