import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import WarningTape from "@/components/WarningTape";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const DangerZoneQuest = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  
  // Пример временных слотов
  const timeSlots = [
    { time: "12:00", available: true },
    { time: "13:30", available: true },
    { time: "15:00", available: true },
    { time: "16:30", available: false },
    { time: "18:00", available: true },
    { time: "19:30", available: true },
    { time: "21:00", available: true },
    { time: "22:30", available: true },
  ];

  const handleBookTime = (time: string) => {
    setSelectedTime(time);
    setIsBookingOpen(true);
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    // В реальной ситуации здесь был бы запрос к API для сохранения брони
    setIsBookingOpen(false);
    alert("Бронь в резерве, скоро с вами свяжется оператор, для уточнения");
  };

  // Определяем цену в зависимости от времени
  const getPrice = (time: string) => {
    const hour = parseInt(time.split(":")[0]);
    return hour >= 21 ? "1000" : "900";
  };

  return (
    <div className="brick-wall-bg min-h-screen toxic-waste-bg relative">
      <div className="green-smoke"></div>
      
      {/* Верхняя черно-желтая лента */}
      <WarningTape />
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <Link to="/" className="inline-block mb-6">
          <Button variant="outline" className="text-yellow-DEFAULT border-yellow-DEFAULT bg-black">
            ← Вернуться на главную
          </Button>
        </Link>
        
        <div className="caution-border p-8 bg-black bg-opacity-80 max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-yellow-DEFAULT text-center mb-4 flashing-light">
            ХОРРОР КВЕСТ!
          </h1>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-orange-DEFAULT mb-2">Сюжет:</h2>
            <p className="text-orange-DEFAULT">
              Вы группа сталкеров, чьи жизни погрязли в долгах, и вот лучик света – проходит молва, 
              что за дневник одного из ученого, готовы заплатить огромные деньги. 
              Вы не раздумываете и бросаетесь на поиски этого дневника, прямо в логово опасности.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="flex-1">
              <div className="p-4 border border-yellow-DEFAULT rounded-md bg-black bg-opacity-70">
                <h3 className="text-xl font-bold text-orange-DEFAULT mb-2">Информация о квесте:</h3>
                <ul className="text-orange-DEFAULT space-y-2">
                  <li>👥 Команда от 4–10 человек</li>
                  <li>👨‍👩‍👧‍👦 Возраст: 18+, 14+, 13+ в сопровождение</li>
                  <li>💰 Цена за 1 человека, указана под временем бронирования</li>
                </ul>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="p-4 border border-yellow-DEFAULT rounded-md bg-black bg-opacity-70">
                <h3 className="text-xl font-bold text-orange-DEFAULT mb-2">Выберите дату:</h3>
                <div className="bg-gray-800 rounded-md p-2 text-center">
                  <p className="text-orange-DEFAULT mb-2">Выберите дату в календаре</p>
                  <p className="text-yellow-DEFAULT text-sm">(В демо-версии календарь не реализован)</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-bold text-orange-DEFAULT mb-4">Выберите время:</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {timeSlots.map((slot) => (
                <div key={slot.time} className="text-center">
                  <button
                    disabled={!slot.available}
                    onClick={() => slot.available && handleBookTime(slot.time)}
                    className={`w-full p-3 border-2 ${
                      slot.available 
                        ? "border-yellow-DEFAULT text-yellow-DEFAULT hover:bg-yellow-DEFAULT hover:text-black" 
                        : "border-red-500 text-red-500 line-through opacity-50"
                    } bg-black rounded-md transition-colors`}
                  >
                    {slot.time}
                  </button>
                  <p className="mt-1 text-orange-DEFAULT">
                    {slot.available ? `${getPrice(slot.time)}₽` : "Недоступно"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Диалог бронирования */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="bg-black border-yellow-DEFAULT text-orange-DEFAULT">
          <DialogHeader>
            <DialogTitle className="text-yellow-DEFAULT">Бронирование</DialogTitle>
            <DialogDescription className="text-orange-DEFAULT">
              Выбранное время: {selectedTime}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmitBooking} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-yellow-DEFAULT">Ваше имя</label>
              <input
                id="name"
                className="w-full p-2 bg-gray-800 border border-yellow-DEFAULT text-orange-DEFAULT rounded"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="phone" className="text-yellow-DEFAULT">Номер телефона</label>
              <input
                id="phone"
                type="tel"
                className="w-full p-2 bg-gray-800 border border-yellow-DEFAULT text-orange-DEFAULT rounded"
                required
              />
            </div>
            
            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full bg-yellow-DEFAULT text-black hover:bg-orange-DEFAULT"
              >
                Забронировать
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Нижняя черно-желтая лента */}
      <WarningTape />
    </div>
  );
};

export default DangerZoneQuest;
