import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Booking } from '@/types/booking';

interface AdminBookingFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (booking: Omit<Booking, 'id'>) => void;
  blockedDates: Date[];
  existingBookings: Booking[];
}

const AdminBookingForm: React.FC<AdminBookingFormProps> = ({
  isOpen,
  onClose,
  onSave,
  blockedDates,
  existingBookings
}) => {
  const initialState = {
    questType: 'danger' as 'danger' | 'artifact',
    date: new Date(),
    time: '',
    name: '',
    phone: '',
    age: '',
    peopleCount: undefined,
    prepayment: undefined,
    payment: undefined,
    teaZone: false,
    status: 'confirmed' as 'pending' | 'confirmed',
    notes: ''
  };

  const [booking, setBooking] = useState<Omit<Booking, 'id'>>(initialState);
  const [step, setStep] = useState(1);

  const timeSlots = ["12:00", "13:30", "15:00", "16:30", "18:00", "19:30", "21:00", "22:30"];

  const isTimeSlotBooked = (time: string) => {
    if (!booking.date) return false;
    
    return existingBookings.some(
      b => 
        b.time === time && 
        format(b.date, 'yyyy-MM-dd') === format(booking.date, 'yyyy-MM-dd') &&
        b.questType === booking.questType
    );
  };

  const isDateBlocked = (date: Date) => {
    return blockedDates.some(
      blockedDate => format(blockedDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  const handleNextStep = () => {
    if (step === 1 && (!booking.date || !booking.time || !booking.questType)) {
      return;
    }
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleSave = () => {
    onSave(booking);
    setBooking(initialState);
    setStep(1);
    onClose();
  };

  const handleClose = () => {
    setBooking(initialState);
    setStep(1);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-black border-2 border-yellow-400 text-yellow-400 max-w-2xl h-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Создание новой брони</DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="questType">Тип квеста</Label>
              <Select
                value={booking.questType}
                onValueChange={(value) => setBooking({ ...booking, questType: value as 'danger' | 'artifact' })}
              >
                <SelectTrigger className="bg-black/50 border-yellow-400 text-orange-400">
                  <SelectValue placeholder="Выберите тип квеста" />
                </SelectTrigger>
                <SelectContent className="bg-black border-yellow-400 text-orange-400">
                  <SelectItem value="danger">Опасная зона</SelectItem>
                  <SelectItem value="artifact">В поисках артефакта</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Дата</Label>
              <Calendar
                mode="single"
                selected={booking.date}
                onSelect={(date) => setBooking({ ...booking, date: date || new Date() })}
                className="border-yellow-400 bg-black/90 rounded-md"
                classNames={{
                  day_selected: "bg-yellow-600 text-black hover:bg-yellow-500 hover:text-black focus:bg-yellow-600 focus:text-black",
                  day_today: "bg-orange-800/20 text-orange-bright border border-orange-bright",
                  day: "text-orange-400 focus-visible:bg-yellow-600/50 hover:bg-yellow-600/50 aria-selected:opacity-100",
                  day_disabled: "text-red-500 line-through opacity-50 cursor-not-allowed",
                  day_range_middle: "aria-selected:bg-yellow-600 aria-selected:text-black",
                  day_hidden: "invisible",
                  caption: "text-yellow-400",
                  caption_label: "text-yellow-bright font-bold",
                  nav_button: "text-yellow-400 hover:bg-yellow-600/20 hover:text-yellow-bright",
                  table: "border-collapse space-y-1",
                  head_cell: "text-orange-bright font-bold text-center",
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
            </div>

            <div className="space-y-2">
              <Label>Время</Label>
              <div className="grid grid-cols-4 gap-2">
                {timeSlots.map((time) => {
                  const isBooked = isTimeSlotBooked(time);
                  return (
                    <Button
                      key={time}
                      type="button"
                      variant={booking.time === time ? "default" : "outline"}
                      className={`
                        ${booking.time === time ? "bg-yellow-600 text-black" : "text-orange-400"} 
                        ${isBooked ? "line-through opacity-50 cursor-not-allowed" : ""}
                      `}
                      disabled={isBooked}
                      onClick={() => setBooking({ ...booking, time })}
                    >
                      {time}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Имя клиента</Label>
                <Input
                  id="name"
                  value={booking.name}
                  onChange={(e) => setBooking({ ...booking, name: e.target.value })}
                  className="bg-black/50 border-yellow-400 text-orange-400"
                  placeholder="Введите имя"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Телефон</Label>
                <Input
                  id="phone"
                  value={booking.phone}
                  onChange={(e) => setBooking({ ...booking, phone: e.target.value })}
                  className="bg-black/50 border-yellow-400 text-orange-400"
                  placeholder="+7 (___) ___-__-__"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Возраст</Label>
                <Input
                  id="age"
                  value={booking.age || ''}
                  onChange={(e) => setBooking({ ...booking, age: e.target.value })}
                  className="bg-black/50 border-yellow-400 text-orange-400"
                  placeholder="Например: 18+, 14+"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="peopleCount">Количество человек</Label>
                <Input
                  id="peopleCount"
                  type="number"
                  value={booking.peopleCount || ''}
                  onChange={(e) => setBooking({ 
                    ...booking, 
                    peopleCount: e.target.value ? parseInt(e.target.value) : undefined 
                  })}
                  className="bg-black/50 border-yellow-400 text-orange-400"
                  placeholder="Введите количество человек"
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prepayment">Предоплата (руб.)</Label>
                <Input
                  id="prepayment"
                  type="number"
                  value={booking.prepayment || ''}
                  onChange={(e) => setBooking({ 
                    ...booking, 
                    prepayment: e.target.value ? parseInt(e.target.value) : undefined 
                  })}
                  className="bg-black/50 border-yellow-400 text-orange-400"
                  placeholder="Введите сумму предоплаты"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment">Полная оплата (руб.)</Label>
                <Input
                  id="payment"
                  type="number"
                  value={booking.payment || ''}
                  onChange={(e) => setBooking({ 
                    ...booking, 
                    payment: e.target.value ? parseInt(e.target.value) : undefined 
                  })}
                  className="bg-black/50 border-yellow-400 text-orange-400"
                  placeholder="Введите полную стоимость"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="teaZone"
                checked={booking.teaZone}
                onCheckedChange={(checked) => setBooking({ ...booking, teaZone: !!checked })}
                className="border-yellow-400 data-[state=checked]:bg-yellow-600"
              />
              <Label htmlFor="teaZone" className="text-yellow-400">Аренда чайной зоны</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Комментарий</Label>
              <Textarea
                id="notes"
                value={booking.notes || ''}
                onChange={(e) => setBooking({ ...booking, notes: e.target.value })}
                className="min-h-[100px] bg-black/50 border-yellow-400 text-orange-400"
                placeholder="Дополнительные заметки"
              />
            </div>
          </div>
        )}

        <DialogFooter className="flex justify-between">
          {step > 1 && (
            <Button
              onClick={handlePrevStep}
              variant="outline"
              className="border-yellow-400 text-yellow-400"
            >
              Назад
            </Button>
          )}
          
          <div>
            {step < 3 ? (
              <Button
                onClick={handleNextStep}
                className="bg-yellow-600 hover:bg-yellow-700 text-black font-bold"
              >
                Далее
              </Button>
            ) : (
              <Button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-black font-bold"
                disabled={!booking.name || !booking.phone}
              >
                Создать бронь
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdminBookingForm;
