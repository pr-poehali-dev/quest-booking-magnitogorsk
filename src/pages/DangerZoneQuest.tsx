import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import WarningTape from "@/components/WarningTape";
import BookingCalendarPicker from "@/components/BookingCalendarPicker";
import bookingService from "@/lib/bookingService";

const DangerZoneQuest: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [peopleCount, setPeopleCount] = useState("");

  // Заглушка для блокированных дат (в реальном приложении должны загружаться с сервера)
  const blockedDates = [
    new Date(new Date().getFullYear(), new Date().getMonth(), 5),
    new Date(new Date().getFullYear(), new Date().getMonth(), 15),
    new Date(new Date().getFullYear(), new Date().getMonth(), 25)
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
    
    // Добавляем бронирование
    if (selectedDate && selectedTime) {
      const booking = {
        id: Math.random().toString(36).substring(2, 11),
        questId: "danger",
        questType: "danger" as "artifact" | "danger",
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedTime,
        name,
        phone,
        peopleCount: peopleCount ? parseInt(peopleCount) : 4,
        status: 'pending'
      };
      
      const success = bookingService.addBooking(booking);
      
      if (success) {
        toast({
          title: "Бронь в резерве",
          description: "Скоро с вами свяжется оператор для уточнения",
        });
        setBookingDialogOpen(false);
        setName("");
        setPhone("");
        setPeopleCount("");
        setSelectedTime(null);
      } else {
        toast({
          title: "Ошибка бронирования",
          description: "Это время уже занято. Пожалуйста, выберите другое время.",
          variant: "destructive"
        });
      }
    }
  };

  const getPrice = (time: string) => {
    const hour = parseInt(time.split(":")[0]);
    return hour >= 21 ? 1200 : 1000;
  };

  const isTimeDisabled = (time: string) => {
    if (!selectedDate) return true;
    
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    return !bookingService.isTimeSlotAvailable(dateStr, time, "danger");
  };

  return (
    <div className="min-h-screen bg-[#1a1a2e] relative overflow-hidden">
      {/* Декоративные элементы */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542281286-9e0a16bb7366')] bg-cover bg-center opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-50"></div>
      
      {/* Биологические предупреждающие знаки */}
      <div className="absolute top-1/4 right-1/4 w-24 h-24 border-4 border-yellow-500 rounded-full opacity-30"></div>
      <div className="absolute top-1/3 left-1/4 w-36 h-36 border-4 border-yellow-500 rounded-full opacity-30"></div>
      <div className="absolute bottom-1/4 right-1/3 w-20 h-20 border-4 border-yellow-500 rounded-full opacity-30"></div>
      
      <div className="container mx-auto relative z-10 px-4 py-8">
        <WarningTape />
        
        <Link to="/" className="inline-block mb-8">
          <Button variant="outline" className="text-yellow-500 border-yellow-500 hover:bg-yellow-950 hover:text-yellow-400">
            На главную
          </Button>
        </Link>

        {/* Изображение опасного квеста в качестве баннера */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-full max-w-xl overflow-hidden rounded-lg border-2 border-yellow-500">
            <img 
              src="https://cdn.poehali.dev/files/b4cf6771-45d7-4b94-b475-2e1ac5f8f74b.jpg" 
              alt="Опасная зона - экстремальный квест" 
              className="w-full h-[300px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
            <h1 className="absolute bottom-4 left-0 w-full text-3xl md:text-5xl font-bold text-yellow-500 text-center">
              ОПАСНАЯ ЗОНА!
            </h1>
          </div>
        </div>
        
        <div className="bg-black/80 p-6 rounded-lg border-2 border-yellow-500 text-yellow-300 mb-8">
          <p className="text-lg mb-6">
            <strong>Сюжет:</strong> Вы группа исследователей, которые оказались в зоне биологической угрозы. 
            Опасный вирус распространяется по комплексу, и вы должны найти противоядие и выбраться до того, 
            как система безопасности заблокирует все выходы. На поиски у вас есть всего 60 минут!
          </p>
          <div className="mb-6">
            <p className="text-lg"><strong>Возраст:</strong> 16+, квест не рекомендуется для лиц с сердечно-сосудистыми заболеваниями и боязнью замкнутых пространств.</p>
            <p className="text-lg"><strong>Команда:</strong> от 2 до 6 человек.</p>
            <p className="text-lg"><strong>Цена за 1 человека</strong> указана под временем бронирования.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-black/80 p-6 rounded-lg border-2 border-yellow-500">
            {/* Календарь с выбором даты */}
            <BookingCalendarPicker
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              blockedDates={blockedDates}
            />
          </div>
          
          {selectedDate && (
            <div className="bg-black/80 p-6 rounded-lg border-2 border-yellow-500">
              <h2 className="text-2xl font-bold mb-4 text-yellow-500">Выберите время</h2>
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
                            : 'text-yellow-500 border-yellow-500 hover:bg-yellow-950 hover:text-yellow-400'
                        }`}
                      >
                        {time}
                      </Button>
                      <p className="text-yellow-300 font-bold">{price} ₽/чел</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
        <DialogContent className="bg-black border-2 border-yellow-500 text-yellow-500">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Бронирование квеста</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-yellow-500">Ваше имя</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="bg-black/50 border-yellow-500 text-yellow-300"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-yellow-500">Номер телефона</Label>
              <Input 
                id="phone" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                className="bg-black/50 border-yellow-500 text-yellow-300"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="peopleCount" className="text-yellow-500">Количество человек</Label>
              <Input 
                id="peopleCount" 
                value={peopleCount} 
                onChange={(e) => setPeopleCount(e.target.value)} 
                type="number"
                min="2"
                max="6"
                className="bg-black/50 border-yellow-500 text-yellow-300"
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

// Вспомогательная функция форматирования даты
function format(date: Date, formatString: string): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return formatString
    .replace('yyyy', String(year))
    .replace('MM', month)
    .replace('dd', day);
}

export default DangerZoneQuest;
