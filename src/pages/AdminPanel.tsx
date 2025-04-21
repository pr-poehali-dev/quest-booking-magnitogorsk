import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "@/components/ui/use-toast";
import WarningTape from "@/components/WarningTape";

interface Booking {
  id: string;
  questType: 'danger' | 'artifact';
  date: Date;
  time: string;
  name: string;
  phone: string;
  age?: string;
  peopleCount?: number;
  prepayment?: number;
  payment?: number;
  teaZone?: boolean;
  status: 'pending' | 'confirmed';
  notes?: string;
}

// Заглушка данных
const mockBookings: Booking[] = [
  {
    id: '1',
    questType: 'danger',
    date: new Date(2024, 8, 15),
    time: '15:00',
    name: 'Алексей',
    phone: '+7 900 123 45 67',
    status: 'pending'
  },
  {
    id: '2',
    questType: 'artifact',
    date: new Date(2024, 8, 16),
    time: '18:00',
    name: 'Елена',
    phone: '+7 911 987 65 43',
    age: '14+',
    peopleCount: 5,
    prepayment: 2000,
    payment: 4500,
    teaZone: true,
    status: 'confirmed',
    notes: 'День рождения'
  }
];

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);
  const [editedBooking, setEditedBooking] = useState<Partial<Booking>>({});
  
  // Проверка авторизации (в реальном приложении использовать контекст авторизации)
  useEffect(() => {
    // Симуляция проверки авторизации
    const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/admin');
    }
  }, [navigate]);

  const times = ["12:00", "13:30", "15:00", "16:30", "18:00", "19:30", "21:00", "22:30"];
  
  const handleOpenEditDialog = (booking: Booking) => {
    setSelectedBooking(booking);
    setEditedBooking({ ...booking });
    setEditDialogOpen(true);
  };
  
  const handleSaveBooking = () => {
    if (!selectedBooking) return;
    
    const updatedBookings = bookings.map(booking => 
      booking.id === selectedBooking.id ? { ...booking, ...editedBooking } : booking
    );
    
    setBookings(updatedBookings);
    setEditDialogOpen(false);
    toast({
      title: "Бронь обновлена",
      description: `Данные для ${selectedBooking.name} успешно обновлены`,
    });
  };
  
  const handleConfirmBooking = (withReceipt: boolean) => {
    if (!selectedBooking) return;
    
    const updatedBooking = { ...selectedBooking, ...editedBooking, status: 'confirmed' as const };
    
    const updatedBookings = bookings.map(booking => 
      booking.id === selectedBooking.id ? updatedBooking : booking
    );
    
    setBookings(updatedBookings);
    setSelectedBooking(updatedBooking);
    
    if (withReceipt) {
      setReceiptDialogOpen(true);
    } else {
      setEditDialogOpen(false);
      toast({
        title: "Бронь подтверждена",
        description: `Бронь для ${selectedBooking.name} успешно подтверждена`,
      });
    }
  };
  
  const handleCancelBooking = () => {
    if (!selectedBooking) return;
    
    const updatedBookings = bookings.filter(booking => booking.id !== selectedBooking.id);
    
    setBookings(updatedBookings);
    setEditDialogOpen(false);
    toast({
      title: "Бронь отменена",
      description: `Бронь для ${selectedBooking.name} была отменена`,
      variant: "destructive"
    });
  };
  
  const handleSaveReceipt = () => {
    // В реальном приложении здесь был бы код для сохранения чека
    toast({
      title: "Чек сохранен",
      description: "Чек был сохранен в галерею",
    });
    setReceiptDialogOpen(false);
    setEditDialogOpen(false);
  };
  
  const getBookingsForDate = () => {
    if (!selectedDate) return [];
    return bookings.filter(booking => 
      booking.date.toDateString() === selectedDate.toDateString()
    );
  };
  
  const getBookingsForTime = (time: string, questType: 'danger' | 'artifact') => {
    if (!selectedDate) return [];
    return bookings.filter(booking => 
      booking.date.toDateString() === selectedDate.toDateString() && 
      booking.time === time &&
      booking.questType === questType
    );
  };

  return (
    <div className="min-h-screen bg-[#7c0000] relative overflow-hidden">
      {/* Декоративные элементы */}
      <div className="absolute inset-0 bg-brick-wall opacity-70"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-30"></div>
      
      <div className="container mx-auto relative z-10 px-4 py-8">
        <WarningTape />
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-yellow-400">Панель администратора</h1>
          
          <Button variant="outline" className="text-yellow-400 border-yellow-400 hover:bg-yellow-950 hover:text-yellow-300">
            Выйти
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
          <div className="bg-black/80 p-4 rounded-lg border-2 border-yellow-400">
            <h2 className="text-xl font-bold mb-4 text-yellow-400">Выберите дату</h2>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="border-yellow-400 bg-black/90 rounded-md text-orange-400"
            />
          </div>
          
          <div className="bg-black/80 p-4 rounded-lg border-2 border-yellow-400">
            <Tabs defaultValue="danger">
              <TabsList className="mb-4 bg-transparent border-b border-yellow-400 w-full justify-start">
                <TabsTrigger 
                  value="danger" 
                  className="data-[state=active]:bg-yellow-700 data-[state=active]:text-black text-yellow-400"
                >
                  Опасная зона
                </TabsTrigger>
                <TabsTrigger 
                  value="artifact" 
                  className="data-[state=active]:bg-yellow-700 data-[state=active]:text-black text-yellow-400"
                >
                  В поисках артефакта
                </TabsTrigger>
              </TabsList>
              
              {['danger', 'artifact'].map((questType) => (
                <TabsContent key={questType} value={questType} className="mt-0">
                  <h3 className="text-xl font-bold mb-4 text-yellow-400">
                    {questType === 'danger' ? 'Опасная зона' : 'В поисках артефакта'}
                  </h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {times.map((time) => {
                      const timeBookings = getBookingsForTime(time, questType as 'danger' | 'artifact');
                      const hasBooking = timeBookings.length > 0;
                      const booking = timeBookings[0];
                      
                      return (
                        <div key={`${questType}-${time}`} className="text-center">
                          <Button
                            onClick={() => hasBooking && handleOpenEditDialog(booking)}
                            variant="outline"
                            className={`w-full h-16 text-lg font-bold mb-2 border-2 ${
                              hasBooking 
                                ? booking.status === 'confirmed'
                                  ? 'bg-green-900/30 text-green-400 border-green-500'
                                  : 'bg-yellow-900/30 text-yellow-400 border-yellow-500'
                                : 'text-gray-500 border-gray-500'
                            }`}
                          >
                            {time}
                            {hasBooking && booking.teaZone && <span className="ml-2 text-blue-400">С</span>}
                            {hasBooking && booking.status === 'confirmed' && 
                              <span className="ml-2 text-green-400">✓</span>
                            }
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
        
        <div className="mt-8 bg-black/80 p-4 rounded-lg border-2 border-yellow-400">
          <h2 className="text-xl font-bold mb-4 text-yellow-400">Брони на выбранную дату</h2>
          
          {getBookingsForDate().length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-orange-400">
                <thead className="text-yellow-400 border-b border-yellow-400">
                  <tr>
                    <th className="py-2 px-3">Квест</th>
                    <th className="py-2 px-3">Время</th>
                    <th className="py-2 px-3">Имя</th>
                    <th className="py-2 px-3">Телефон</th>
                    <th className="py-2 px-3">Статус</th>
                    <th className="py-2 px-3">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {getBookingsForDate().map((booking) => (
                    <tr key={booking.id} className="border-b border-yellow-900/30">
                      <td className="py-2 px-3">
                        {booking.questType === 'danger' ? 'Опасная зона' : 'Артефакт'}
                      </td>
                      <td className="py-2 px-3">{booking.time}</td>
                      <td className="py-2 px-3">{booking.name}</td>
                      <td className="py-2 px-3">{booking.phone}</td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-1 rounded text-sm ${
                          booking.status === 'confirmed' 
                            ? 'bg-green-900/30 text-green-400' 
                            : 'bg-yellow-900/30 text-yellow-400'
                        }`}>
                          {booking.status === 'confirmed' ? 'Подтверждено' : 'В ожидании'}
                        </span>
                      </td>
                      <td className="py-2 px-3">
                        <Button 
                          size="sm" 
                          onClick={() => handleOpenEditDialog(booking)}
                          className="bg-yellow-600 hover:bg-yellow-700 text-black"
                        >
                          Редактировать
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-orange-400">Нет броней на выбранную дату</p>
          )}
        </div>
      </div>
      
      {/* Диалог редактирования брони */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="bg-black border-2 border-yellow-400 text-yellow-400 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {selectedBooking?.status === 'confirmed' ? 'Редактирование подтвержденной брони' : 'Подтверждение брони'}
            </DialogTitle>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-yellow-400">Имя клиента</Label>
                  <Input 
                    id="name" 
                    value={editedBooking.name || ''} 
                    onChange={(e) => setEditedBooking({...editedBooking, name: e.target.value})} 
                    className="bg-black/50 border-yellow-400 text-orange-400"
                    readOnly
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-yellow-400">Телефон</Label>
                  <Input 
                    id="phone" 
                    value={editedBooking.phone || ''} 
                    onChange={(e) => setEditedBooking({...editedBooking, phone: e.target.value})} 
                    className="bg-black/50 border-yellow-400 text-orange-400"
                    readOnly
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-yellow-400">Возраст</Label>
                  <Input 
                    id="age" 
                    value={editedBooking.age || ''} 
                    onChange={(e) => setEditedBooking({...editedBooking, age: e.target.value})} 
                    className="bg-black/50 border-yellow-400 text-orange-400"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="peopleCount" className="text-yellow-400">Количество человек</Label>
                  <Input 
                    id="peopleCount" 
                    type="number" 
                    value={editedBooking.peopleCount || ''} 
                    onChange={(e) => setEditedBooking({...editedBooking, peopleCount: parseInt(e.target.value) || undefined})} 
                    className="bg-black/50 border-yellow-400 text-orange-400"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="prepayment" className="text-yellow-400">Предоплата (руб.)</Label>
                  <Input 
                    id="prepayment" 
                    type="number" 
                    value={editedBooking.prepayment || ''} 
                    onChange={(e) => setEditedBooking({...editedBooking, prepayment: parseInt(e.target.value) || undefined})} 
                    className="bg-black/50 border-yellow-400 text-orange-400"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="payment" className="text-yellow-400">Полная оплата (руб.)</Label>
                  <Input 
                    id="payment" 
                    type="number" 
                    value={editedBooking.payment || ''} 
                    onChange={(e) => setEditedBooking({...editedBooking, payment: parseInt(e.target.value) || undefined})} 
                    className="bg-black/50 border-yellow-400 text-orange-400"
                  />
                </div>
                
                <div className="flex items-center space-x-2 mt-6">
                  <Checkbox 
                    id="teaZone" 
                    checked={editedBooking.teaZone || false} 
                    onCheckedChange={(checked) => 
                      setEditedBooking({...editedBooking, teaZone: checked as boolean})
                    } 
                    className="border-yellow-400 data-[state=checked]:bg-yellow-600"
                  />
                  <Label htmlFor="teaZone" className="text-yellow-400">Аренда чайной зоны</Label>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-yellow-400">Заметки</Label>
                <Input 
                  id="notes" 
                  value={editedBooking.notes || ''} 
                  onChange={(e) => setEditedBooking({...editedBooking, notes: e.target.value})} 
                  className="bg-black/50 border-yellow-400 text-orange-400"
                />
              </div>
            </div>
          )}
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            {selectedBooking?.status !== 'confirmed' && (
              <>
                <Button 
                  onClick={() => handleConfirmBooking(true)} 
                  className="bg-green-600 hover:bg-green-700 text-black font-bold"
                >
                  Подтвердить с чеком
                </Button>
                <Button 
                  onClick={() => handleConfirmBooking(false)} 
                  className="bg-blue-600 hover:bg-blue-700 text-black font-bold"
                >
                  Подтвердить без чека
                </Button>
              </>
            )}
            <Button 
              onClick={handleSaveBooking} 
              className="bg-yellow-600 hover:bg-yellow-700 text-black font-bold"
            >
              Сохранить
            </Button>
            <Button 
              onClick={handleCancelBooking} 
              variant="destructive"
            >
              Отменить бронь
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Диалог чека */}
      <Dialog open={receiptDialogOpen} onOpenChange={setReceiptDialogOpen}>
        <DialogContent className="bg-white border-2 border-black text-black max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">ЧЕК</DialogTitle>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="space-y-4 py-4 border-t border-b border-dashed border-black my-2">
              <div className="text-center text-lg font-bold">
                Check_Out — Квесты в МГН
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-bold">Квест:</span> 
                  <span>{selectedBooking.questType === 'danger' ? 'Опасная зона' : 'В поисках артефакта'}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-bold">Дата:</span> 
                  <span>{selectedBooking.date.toLocaleDateString()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-bold">Время:</span> 
                  <span>{selectedBooking.time}</span>
                </div>
                
                {editedBooking.age && (
                  <div className="flex justify-between">
                    <span className="font-bold">Возраст:</span> 
                    <span>{editedBooking.age}</span>
                  </div>
                )}
                
                {editedBooking.peopleCount && (
                  <div className="flex justify-between">
                    <span className="font-bold">Количество игроков:</span> 
                    <span>{editedBooking.peopleCount}</span>
                  </div>
                )}
                
                {editedBooking.payment && (
                  <div className="flex justify-between">
                    <span className="font-bold">Общая сумма:</span> 
                    <span>{editedBooking.payment} ₽</span>
                  </div>
                )}
                
                {editedBooking.prepayment && (
                  <div className="flex justify-between">
                    <span className="font-bold">Предоплата:</span> 
                    <span>{editedBooking.prepayment} ₽</span>
                  </div>
                )}
                
                {editedBooking.teaZone && (
                  <div className="flex justify-between">
                    <span className="font-bold">Аренда чайной зоны (1ч):</span> 
                    <span>1000 ₽</span>
                  </div>
                )}
              </div>
              
              <div className="text-center border-t border-dashed border-black pt-2">
                <p>Спасибо за бронирование!</p>
                <p>Ждем вас по адресу: [Адрес квеста]</p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              onClick={handleSaveReceipt} 
              className="bg-black hover:bg-gray-800 text-white font-bold"
            >
              Сохранить в галерею
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPanel;
