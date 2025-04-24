import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import WarningTape from "@/components/WarningTape";
import useBookingSync from "@/hooks/useBookingSync";

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

interface AdminUser {
  id: string;
  username: string;
  password: string;
  name: string;
  role: 'admin' | 'superadmin';
  supportPhone: string;
}

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const { 
    bookings, 
    blockedDates, 
    isLoading,
    refreshData,
    addBooking,
    updateBooking,
    deleteBooking,
    addBlockedDate,
    removeBlockedDate,
    getBookingsForDate,
    isTimeSlotAvailable
  } = useBookingSync();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);
  const [blockDateDialogOpen, setBlockDateDialogOpen] = useState(false);
  const [createBookingDialogOpen, setCreateBookingDialogOpen] = useState(false);
  const [editedBooking, setEditedBooking] = useState<Partial<Booking>>({});
  const [currentUser, setCurrentUser] = useState<AdminUser>(() => {
    const savedUser = localStorage.getItem('adminUser');
    return savedUser ? JSON.parse(savedUser) : {
      id: '1',
      username: 'NiKiTa Kvest',
      password: 'admin1408',
      name: 'Никита',
      role: 'admin',
      supportPhone: '+7 (999) 123-45-67'
    };
  });
  
  // Доступные временные слоты
  const times = ["12:00", "13:30", "15:00", "16:30", "18:00", "19:30", "21:00", "22:30"];
  
  // Проверка авторизации при загрузке
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/admin');
    } else {
      // Загружаем данные при входе на страницу
      refreshData();
    }
  }, [navigate, refreshData]);
  
  // Открытие диалога редактирования брони
  const handleOpenEditDialog = (booking: Booking) => {
    setSelectedBooking(booking);
    setEditedBooking({ ...booking });
    setEditDialogOpen(true);
  };
  
  // Сохранение изменений в брони
  const handleSaveBooking = () => {
    if (!selectedBooking || !editedBooking) return;
    
    try {
      // Обновляем бронирование в системе
      updateBooking(selectedBooking.id, { 
        ...selectedBooking, 
        ...editedBooking as Booking 
      });
      
      setEditDialogOpen(false);
      toast({
        title: "Бронь обновлена",
        description: `Данные для ${selectedBooking.name} успешно обновлены`,
      });
    } catch (error) {
      toast({
        title: "Ошибка обновления",
        description: error instanceof Error ? error.message : "Неизвестная ошибка",
        variant: "destructive"
      });
    }
  };
  
  // Подтверждение брони
  const handleConfirmBooking = (withReceipt: boolean) => {
    if (!selectedBooking) return;
    
    try {
      const updatedBooking = { 
        ...selectedBooking, 
        ...editedBooking as Booking, 
        status: 'confirmed' as const 
      };
      
      updateBooking(selectedBooking.id, updatedBooking);
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
    } catch (error) {
      toast({
        title: "Ошибка подтверждения",
        description: error instanceof Error ? error.message : "Неизвестная ошибка",
        variant: "destructive"
      });
    }
  };
  
  // Отмена брони
  const handleCancelBooking = () => {
    if (!selectedBooking) return;
    
    try {
      deleteBooking(selectedBooking.id);
      setEditDialogOpen(false);
      toast({
        title: "Бронь отменена",
        description: `Бронь для ${selectedBooking.name} была отменена`,
        variant: "destructive"
      });
    } catch (error) {
      toast({
        title: "Ошибка отмены",
        description: error instanceof Error ? error.message : "Неизвестная ошибка",
        variant: "destructive"
      });
    }
  };
  
  // Сохранение чека
  const handleSaveReceipt = () => {
    toast({
      title: "Чек сохранен",
      description: "Чек был сохранен в галерею",
    });
    setReceiptDialogOpen(false);
    setEditDialogOpen(false);
  };

  // Блокировка дат
  const handleBlockDates = (dates: Date[], reason: string) => {
    dates.forEach(date => addBlockedDate(date));
    
    toast({
      title: `Заблокировано дат: ${dates.length}`,
      description: `Причина: ${reason}`,
    });
    
    setBlockDateDialogOpen(false);
  };

  // Разблокировка даты
  const handleUnblockDate = (date: Date) => {
    removeBlockedDate(date);
    toast({
      title: "Дата разблокирована",
      description: `Дата ${date.toLocaleDateString()} была разблокирована`,
    });
  };

  // Создание новой брони администратором
  const handleCreateBooking = (bookingData: Omit<Booking, 'id'>) => {
    try {
      const newBooking: Booking = {
        ...bookingData,
        id: `booking-${Date.now()}`
      };
      
      addBooking(newBooking);
      setCreateBookingDialogOpen(false);
      
      toast({
        title: "Бронь создана",
        description: `Новая бронь для ${bookingData.name} успешно создана`,
      });
    } catch (error) {
      toast({
        title: "Ошибка создания брони",
        description: error instanceof Error ? error.message : "Неизвестная ошибка",
        variant: "destructive"
      });
    }
  };

  // Обновление данных администратора
  const handleSaveSettings = (user: AdminUser) => {
    setCurrentUser(user);
    localStorage.setItem('adminUser', JSON.stringify(user));
    
    toast({
      title: "Настройки сохранены",
      description: "Данные администратора успешно обновлены",
    });
  };
  
  // Выход из админ-панели
  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    navigate('/admin');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#7c0000] flex items-center justify-center">
        <div className="text-4xl text-yellow-400 animate-pulse">Загрузка данных...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#7c0000] relative overflow-hidden">
      {/* Декоративные элементы */}
      <div className="absolute inset-0 bg-brick-wall opacity-70"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-30"></div>
      
      <div className="container mx-auto relative z-10 px-4 py-8">
        <WarningTape />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-yellow-400 glow-text">Панель администратора</h1>
          
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
            <div className="text-orange-400 text-sm md:text-base">
              Телефон поддержки: <span className="font-bold">{currentUser.supportPhone}</span>
            </div>
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
        
        <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-8">
          {/* Календарь выбора даты */}
          <div className="space-y-4">
            <BookingCalendar 
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              blockedDates={blockedDates}
              onUnblockDate={handleUnblockDate}
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
