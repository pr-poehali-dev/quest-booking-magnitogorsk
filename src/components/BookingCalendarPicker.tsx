import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ru } from 'date-fns/locale';
import { format } from 'date-fns';
import { Booking } from '@/types/booking';
import bookingService from '@/lib/bookingService';
import { v4 as uuidv4 } from 'uuid';

interface BookingCalendarPickerProps {
  questId: string;
  questType: 'danger' | 'artifact';
  isOpen: boolean;
  onClose: () => void;
}

const BookingCalendarPicker: React.FC<BookingCalendarPickerProps> = ({
  questId,
  questType,
  isOpen,
  onClose
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    peopleCount: '',
    notes: '',
    teaZone: false
  });
  const [bookingComplete, setBookingComplete] = useState(false);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);

  // Получение доступных временных слотов
  useEffect(() => {
    const times = bookingService.generateTimeSlots();
    setAvailableTimes(times);
  }, []);

  // Функция проверки доступности времени
  const isTimeAvailable = (time: string) => {
    if (!selectedDate) return false;
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    return bookingService.isTimeSlotAvailable(dateStr, time, questId);
  };

  // Функция для проверки, не заблокирована ли дата
  const isDateBlocked = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return bookingService.isDateBlocked(dateStr);
  };

  // Обработчик выбора времени
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  // Обработчик изменения данных клиента
  const handleCustomerInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
  };

  // Обработчик выбора чайной зоны
  const handleTeaZoneChange = (value: string) => {
    setCustomerInfo(prev => ({ ...prev, teaZone: value === 'yes' }));
  };

  // Обработчик подтверждения бронирования
  const handleBookingConfirm = () => {
    if (!selectedDate || !selectedTime) return;

    // Создаем объект бронирования
    const booking: Booking = {
      id: uuidv4(),
      questId,
      questType,
      date: format(selectedDate, 'yyyy-MM-dd'),
      time: selectedTime,
      name: customerInfo.name,
      phone: customerInfo.phone,
      peopleCount: customerInfo.peopleCount ? parseInt(customerInfo.peopleCount) : undefined,
      notes: customerInfo.notes,
      teaZone: customerInfo.teaZone,
      status: 'pending'
    };

    // Добавляем бронирование
    bookingService.addBooking(booking);
    setBookingComplete(true);
  };

  // Обработчик закрытия диалога
  const handleClose = () => {
    setSelectedDate(new Date());
    setSelectedTime(null);
    setStep(1);
    setCustomerInfo({
      name: '',
      phone: '',
      peopleCount: '',
      notes: '',
      teaZone: false
    });
    setBookingComplete(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-black border-2 border-yellow-400 text-yellow-400 max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {questType === 'danger' ? 'Бронирование "Опасная зона"' : 'Бронирование "В поисках артефакта"'}
          </DialogTitle>
        </DialogHeader>

        {!bookingComplete ? (
          <>
            {step === 1 && (
              <div className="space-y-4 py-4">
                <Label className="text-lg font-bold">Выберите дату</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="border-yellow-400 bg-black/90 rounded-md"
                  classNames={{
                    day_selected: "bg-yellow-600 text-black hover:bg-yellow-500 hover:text-black focus:bg-yellow-600 focus:text-black",
                    day_today: "bg-orange-800/20 text-orange-400 border border-orange-400",
                    day: "text-orange-400 focus-visible:bg-yellow-600/50 hover:bg-yellow-600/50 aria-selected:opacity-100",
                    day_disabled: "text-red-500 line-through opacity-50 cursor-not-allowed",
                    day_range_middle: "aria-selected:bg-yellow-600 aria-selected:text-black",
                    day_hidden: "invisible",
                    caption: "text-yellow-400",
                    caption_label: "text-yellow-400 font-bold",
                    nav_button: "text-yellow-400 hover:bg-yellow-600/20 hover:text-yellow-400",
                    table: "border-collapse space-y-1",
                    head_cell: "text-orange-400 font-bold text-center",
                    cell: "p-0 relative [&:has([aria-selected])]:bg-yellow-600/20",
                    root: "max-w-full bg-black/70 border border-yellow-400 shadow-lg rounded-md p-3"
                  }}
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return date < today || isDateBlocked(date);
                  }}
                  locale={ru}
                />

                {selectedDate && (
                  <div className="space-y-4 mt-4">
                    <Label className="text-lg font-bold">Выберите время</Label>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                      {availableTimes.map((time) => (
                        <Button
                          key={time}
                          variant={selectedTime === time ? "default" : "outline"}
                          className={`
                            ${selectedTime === time ? "bg-yellow-600 text-black" : "bg-black text-yellow-400 border-yellow-400"} 
                            ${!isTimeAvailable(time) ? "opacity-50 cursor-not-allowed line-through" : "hover:bg-yellow-600/20"}
                          `}
                          disabled={!isTimeAvailable(time)}
                          onClick={() => handleTimeSelect(time)}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>

                    <Button
                      className="w-full mt-4 bg-yellow-600 hover:bg-yellow-700 text-black font-bold"
                      disabled={!selectedTime}
                      onClick={() => setStep(2)}
                    >
                      Продолжить
                    </Button>
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 py-4">
                <div className="text-center mb-4">
                  <p className="text-lg">
                    {questType === 'danger' ? 'Опасная зона' : 'В поисках артефакта'}
                  </p>
                  <p className="text-lg font-bold">{format(selectedDate!, 'dd.MM.yyyy')} в {selectedTime}</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Ваше имя</Label>
                    <Input
                      id="name"
                      name="name"
                      value={customerInfo.name}
                      onChange={handleCustomerInfoChange}
                      className="bg-black/50 border-yellow-400 text-orange-400"
                      placeholder="Введите ваше имя"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Телефон</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={customerInfo.phone}
                      onChange={handleCustomerInfoChange}
                      className="bg-black/50 border-yellow-400 text-orange-400"
                      placeholder="+7 (___) ___-__-__"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="peopleCount">Количество человек</Label>
                    <Input
                      id="peopleCount"
                      name="peopleCount"
                      type="number"
                      value={customerInfo.peopleCount}
                      onChange={handleCustomerInfoChange}
                      className="bg-black/50 border-yellow-400 text-orange-400"
                      placeholder="Введите количество человек"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="teaZone">Чайная зона</Label>
                    <Select onValueChange={handleTeaZoneChange} defaultValue="no">
                      <SelectTrigger className="bg-black/50 border-yellow-400 text-orange-400">
                        <SelectValue placeholder="Нужна ли чайная зона?" />
                      </SelectTrigger>
                      <SelectContent className="bg-black border-yellow-400 text-orange-400">
                        <SelectItem value="yes">Да, нужна чайная зона</SelectItem>
                        <SelectItem value="no">Нет, не нужна</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Примечания</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={customerInfo.notes}
                      onChange={handleCustomerInfoChange}
                      className="min-h-[100px] bg-black/50 border-yellow-400 text-orange-400"
                      placeholder="Дополнительные пожелания"
                    />
                  </div>
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1 border-yellow-400 text-yellow-400"
                    onClick={() => setStep(1)}
                  >
                    Назад
                  </Button>
                  <Button
                    className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-black font-bold"
                    disabled={!customerInfo.name || !customerInfo.phone}
                    onClick={handleBookingConfirm}
                  >
                    Забронировать
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="py-8 text-center space-y-4">
            <div className="text-green-400 text-5xl mb-4">✓</div>
            <h3 className="text-2xl font-bold text-green-400">Бронирование успешно!</h3>
            <p className="text-orange-400">
              Спасибо, {customerInfo.name}! Ваше бронирование на {format(selectedDate!, 'dd.MM.yyyy')} в {selectedTime} принято.
            </p>
            <p className="text-orange-400">
              Мы свяжемся с вами для подтверждения по телефону {customerInfo.phone}.
            </p>
            <Button
              className="mt-4 bg-yellow-600 hover:bg-yellow-700 text-black font-bold"
              onClick={handleClose}
            >
              Закрыть
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingCalendarPicker;
