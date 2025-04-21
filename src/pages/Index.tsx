import FlickeringTitle from "@/components/FlickeringTitle";
import WarningTape from "@/components/WarningTape";
import QuestCard from "@/components/QuestCard";

const Index = () => {
  return (
    <div className="brick-wall-bg min-h-screen day-night-cycle">
      <div className="container mx-auto px-4 py-12">
        {/* Верхняя черно-желтая лента */}
        <WarningTape />
        
        {/* Название сайта с мигающими буквами */}
        <div className="py-10">
          <FlickeringTitle />
        </div>
        
        {/* Предупреждение */}
        <div className="max-w-3xl mx-auto my-12 text-center caution-border p-6 bg-black bg-opacity-70">
          <p className="text-xl text-orange-DEFAULT font-bold mb-4">
            Вход в состоянии алкогольного и наркотического опьянения строго запрещен!
          </p>
          <p className="text-xl text-orange-DEFAULT">
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
          <div className="caution-border p-6 bg-black bg-opacity-70">
            <h3 className="text-2xl font-bold text-orange-DEFAULT mb-4">Информация для бронирования</h3>
            <p className="text-lg text-orange-DEFAULT mb-2">
              По вопросам бронирования вы можете связаться с администратором по номеру
            </p>
            <p className="text-lg text-orange-DEFAULT mb-4">
              или в сообщениях группы ВК: <a href="https://vk.com/kvest_chekcout" className="underline hover:text-yellow-DEFAULT">https://vk.com/kvest_chekcout</a>
            </p>
          </div>
        </div>
        
        {/* Нижняя черно-желтая лента */}
        <WarningTape />
      </div>
    </div>
  );
};

export default Index;
