import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import WarningTape from "@/components/WarningTape";

// Импорт компонентов для админ-панели
import BookingCalendar from "@/components/admin/BookingCalendar";
import BookingTable from "@/components/admin/BookingTable";
import EditBookingDialog from "@/components/admin/EditBookingDialog";
import ReceiptDialog from "@/components/admin/ReceiptDialog";
import QuestTabContent from "@/components/admin/QuestTabContent";
import BlockDateDialog from "@/components/admin/BlockDateDialog";
import AdminBookingForm from "@/components/admin/AdminBookingForm";
import AdminSettings from "@/components/admin/AdminSettings";

// Импорт типов
import { Booking } from "@/types/booking";

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

// Заглушка для заблокированных дат
const initialBlockedDates = [
  new Date(2024, 8, 10),
  new Date(2024, 8, 20),
  new Date(2024, 8, 25)
];

interface AdminUser {
  id: string;
  username: string;
  password: string;
  name: string;
  role: 'admin' | 'superadmin';
}

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [blockedDates, setBlockedDates] = useState<Date[]>(initialBlockedDates);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);
  const [blockDateDialogOpen, setBlockDateDialogOpen] = useState(false);
  const [createBookingDialogOpen, setCreateBookingDialogOpen] = useState(false);
  const [editedBooking, setEditedBooking] = useState<Partial<Booking>>({});
  const [currentUser, setCurrentUser] = useState<AdminUser>({
    id: '1',
    username: 'NiKiTa Kvest',
    password: 'admin1408',
    name: 'Никита',
    role: 'admin'
  });
  
  // Доступные временные слоты
  const times = ["12:00", "13:30", "15:00", "16:30", "18:00", "19:30", "21:00", "22:30"];
  
  // Проверка авторизации (в реальном приложении использовать контекст авторизации)
  useEffect(() => {
    // Симуляция проверки авторизации
    const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/admin');
    }
  }, [navigate]);
  
  // Открытие диалога редактирования брони
  const handleOpenEditDialog = (booking: Booking) => {
    setSelectedBooking(booking);
    setEditedBooking({ ...booking });
    setEditDialogOpen(true);
  };
  
  // Сохранение изменений в брони
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
  
  // Подтверждение брони (с чеком или без)
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
  
  // Отмена брони
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
  
  // Сохранение чека
  const handleSaveReceipt = () => {
    // В реальном приложении здесь был бы код для сохранения чека
    toast({
      title: "Чек сохранен",
      description: "Чек был сохранен в галерею",
    });
    setReceiptDialogOpen(false);
    setEditDialogOpen(false);
  };

  // Блокировка дат
  const handleBlockDates = (dates: Date[], reason: string) => {
    setBlockedDates([...blockedDates, ...dates]);
    toast({
      title: `Заблокировано дат: ${dates.length}`,
      description: `Причина: ${reason}`,
    });
  };

  // Создание новой брони администратором
  const handleCreateBooking = (bookingData: Omit<Booking, 'id'>) => {
    const newBooking: Booking = {
      ...bookingData,
      id: `booking-${Date.now()}`
    };
    
    setBookings([...bookings, newBooking]);
    toast({
      title: "Бронь создана",
      description: `Новая бронь для ${bookingData.name} успешно создана`,
    });
  };

  // Обновление данных администратора
  const handleSaveSettings = (user: AdminUser) => {
    setCurrentUser(user);
    // В реальном приложении здесь был бы запрос к API для обновления данных
    localStorage.setItem('adminUser', JSON.stringify(user));
  };
  
  // Выход из админ-панели
  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    navigate('/admin');
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
          
          <div className="flex space-x-4">
            <AdminSettings currentUser={currentUser} onSaveSettings={handleSaveSettings} />
            
            <Button 
              variant="outline" 
              className="text-yellow-400 border-yellow-400 hover:bg-yellow-950 hover:text-yellow-300"
              onClick={handleLogout}
            >
              Выйти
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
          {/* Календарь выбора даты */}
          <div className="space-y-4">
            <BookingCalendar 
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
            
            <div className="bg-black/80 p-4 rounded-lg border-2 border-yellow-400">
              <h2 className="text-xl font-bold mb-4 text-yellow-400">Действия</h2>
              <div className="space-y-2">
                <Button 
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-black"
                  onClick={() => setCreateBookingDialogOpen(true)}
                >
                  Создать бронь
                </Button>
                
                <Button 
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => setBlockDateDialogOpen(true)}
                >
                  Блокировать даты
                </Button>
              </div>
            </div>
          </div>
          
          {/* Табы с квестами */}
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
              
              {/* Содержимое табов */}
              <TabsContent value="danger">
                <QuestTabContent
                  questType="danger"
                  times={times}
                  bookings={bookings}
                  selectedDate={selectedDate}
                  onOpenEditDialog={handleOpenEditDialog}
                />
              </TabsContent>
              
              <TabsContent value="artifact">
                <QuestTabContent
                  questType="artifact"
                  times={times}
                  bookings={bookings}
                  selectedDate={selectedDate}
                  onOpenEditDialog={handleOpenEditDialog}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        {/* Таблица броней на выбранную дату */}
        <div className="mt-8 bg-black/80 p-4 rounded-lg border-2 border-yellow-400">
          <h2 className="text-xl font-bold mb-4 text-yellow-400">Брони на выбранную дату</h2>
          
          <BookingTable
            bookings={bookings}
            selectedDate={selectedDate}
            onOpenEditDialog={handleOpenEditDialog}
          />
        </div>
      </div>
      
      {/* Диалоги */}
      <EditBookingDialog
        open={editDialogOpen}
        setOpen={setEditDialogOpen}
        selectedBooking={selectedBooking}
        editedBooking={editedBooking}
        setEditedBooking={setEditedBooking}
        onSave={handleSaveBooking}
        onConfirm={handleConfirmBooking}
        onCancel={handleCancelBooking}
      />
      
      <ReceiptDialog
        open={receiptDialogOpen}
        setOpen={setReceiptDialogOpen}
        booking={selectedBooking}
        editedBooking={editedBooking}
        onSave={handleSaveReceipt}
      />
      
      <BlockDateDialog
        isOpen={blockDateDialogOpen}
        onClose={() => setBlockDateDialogOpen(false)}
        onBlock={handleBlockDates}
        blockedDates={blockedDates}
      />
      
      <AdminBookingForm
        isOpen={createBookingDialogOpen}
        onClose={() => setCreateBookingDialogOpen(false)}
        onSave={handleCreateBooking}
        blockedDates={blockedDates}
        existingBookings={bookings}
      />
    </div>
  );
};

export default AdminPanel;
