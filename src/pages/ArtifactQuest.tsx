import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import WarningTape from "@/components/WarningTape";
import BookingCalendarPicker from "@/components/BookingCalendarPicker";

const ArtifactQuest: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // Заглушка для блокированных дат (в реальном приложении должны загружаться с сервера)
  const blockedDates = [
    new Date(new Date().getFullYear(), new Date().getMonth(), 10),
    new Date(new Date().getFullYear(), new Date().getMonth(), 18),
    new Date(new Date().getFullYear(), new Date().getMonth(), 27)
  ];

  const times = ["12:00", "13:30", "15:00", "16:30", "18:00", "19:30", "21:00", "22:30"];
  
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setBookingDialogOpen(true);
  };

  const handleBooking = () => {
    if (!name || !phone) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все поля",
        variant: "destructive"
      });
      return;
    }
    
    // В реальном приложении здесь был бы запрос к API
    toast({
      title: "Бронь в резерве",
      description: "Скоро с вами свяжется оператор для уточнения",
    });
    
    setBookingDialogOpen(false);
    setName("");
    setPhone("");
  };

  const getPrice = (time: string) => {
    const hour = parseInt(time.split(":")[0]);
    return hour >= 21 ? 1000 : 900;
  };

  const isTimeDisabled = (time: string) => {
    // Здесь можно добавить логику для проверки доступности времени
    // Например, если время уже прошло или все места забронированы
    return Math.random() < 0.2; // Для примера блокируем случайные времена
  };

  return (
    <div className="min-h-screen bg-[#7c0000] relative overflow-hidden">
      {/* Декоративные элементы */}
      <div className="absolute inset-0 bg-brick-wall opacity-70"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-30"></div>
      
      {/* Золотые медальоны и статуэтки (декоративные элементы) */}
      <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-yellow-600 rounded-full animate-pulse opacity-60"></div>
      <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-yellow-600 rounded-full animate-pulse opacity-60"></div>
      <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-yellow-600 rounded-full animate-pulse opacity-70"></div>
      
      {/* Факелы */}
      <div className="absolute top-12 left-12 w-8 h-24 bg-orange-600 animate-flicker opacity-60"></div>
      <div className="absolute top-12 right-12 w-8 h-24 bg-orange-600 animate-flicker opacity-60"></div>
      
      {/* Белый дым */}
      <div className="absolute inset-0 bg-white opacity-5 animate-fog"></div>
      
      <div className="container mx-auto relative z-10 px-4 py-8">
        <WarningTape />
        
        <Link to="/" className="inline-block mb-8">
          <Button variant="outline" className="text-yellow-400 border-yellow-400 hover:bg-yellow-950 hover:text-yellow-300">
            На главную
          </Button>
        </Link>

        {/* Изображение детективного квеста в качестве баннера */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-full max-w-xl overflow-hidden rounded-lg border-2 border-yellow-400">
            <img 
              src="https://cdn.poehali.dev/files/3fe1b1b2-87e3-4301-85f1-117b241735bd.jpg" 
              alt="Детективный квест - В поисках артефакта" 
              className="w-full h-[300px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
            <h1 className="absolute bottom-4 left-0 w-full text-3xl md:text-5xl font-bold text-yellow-400 text-center">
              ДЕТЕКТИВНЫЙ КВЕСТ!
            </h1>
          </div>
        </div>
        
        <div className="bg-black/80 p-6 rounded-lg border-2 border-yellow-400 text-orange-400 mb-8">
          <p className="text-lg mb-6">
            <strong>Сюжет:</strong> Вы команда следопытов, которые отправляются на поиски утерянного артефакта. 
            Все сводки говорят о том, что артефакт был украден и спрятан в старом подвале под музеем. 
            Но местный детектив не может разгадать загадки и найти улики, поэтому именно вам предстоит 
            помочь ему в этом нелегком деле!
          </p>
          <div className="mb-6">
            <p className="text-lg"><strong>Возраст:</strong> 9+, квест проходит с ведущим, в роли доброго детектива Шляпсона.</p>
            <p className="text-lg"><strong>Команда:</strong> от 4 до 10 человек.</p>
            <p className="text-lg"><strong>Цена за 1 человека</strong> указана под временем бронирования.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-black/80 p-6 rounded-lg border-2 border-yellow-400">
            {/* Календарь с выбором даты */}
            <BookingCalendarPicker
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              blockedDates={blockedDates}
            />
          </div>
          
          {selectedDate && (
            <div className="bg-black/80 p-6 rounded-lg border-2 border-yellow-400">
              <h2 className="text-2xl font-bold mb-4 text-yellow-400">Выберите время</h2>
              <div className="grid grid-cols-2 gap-4">
                {times.map((time) => {
                  const disabled = isTimeDisabled(time);
                  const price = getPrice(time);
                  
                  return (
                    <div key={time} className="text-center">
                      <Button
                        onClick={() => !disabled && handleTimeSelect(time)}
                        variant="outline"
                        disabled={disabled}
                        className={`w-full h-16 text-lg font-bold mb-2 border-2 ${
                          disabled 
                            ? 'line-through text-red-500 border-red-500' 
                            : 'text-yellow-400 border-yellow-400 hover:bg-yellow-950 hover:text-yellow-300'
                        }`}
                      >
                        {time}
                      </Button>
                      <p className="text-orange-400 font-bold">{price} ₽/чел</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
        <DialogContent className="bg-black border-2 border-yellow-400 text-yellow-400">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Бронирование квеста</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-yellow-400">Ваше имя</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="bg-black/50 border-yellow-400 text-orange-400"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-yellow-400">Номер телефона</Label>
              <Input 
                id="phone" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                className="bg-black/50 border-yellow-400 text-orange-400"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              onClick={handleBooking} 
              className="bg-yellow-600 hover:bg-yellow-700 text-black font-bold"
            >
              Забронировать
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <WarningTape />
    </div>
  );
};

export default ArtifactQuest;
