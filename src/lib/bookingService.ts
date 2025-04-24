import { Booking } from "@/types/booking";

// Ключи для хранения данных в localStorage
const BOOKINGS_STORAGE_KEY = "checkoutQuest_bookings";
const BLOCKED_DATES_KEY = "checkoutQuest_blockedDates";

// Интерфейс для синхронизированного хранилища бронирований
interface BookingStorage {
  getBookings: () => Booking[];
  addBooking: (booking: Booking) => void;
  updateBooking: (bookingId: string, updatedBooking: Booking) => boolean;
  deleteBooking: (bookingId: string) => boolean;
  isTimeSlotAvailable: (date: Date, timeSlot: string, questId: string) => boolean;
  getBookingsForDate: (date: Date, questId?: string) => Booking[];
  getBlockedDates: () => Date[];
  addBlockedDate: (date: Date) => void;
  removeBlockedDate: (date: Date) => boolean;
}

// Singleton-сервис для работы с бронированиями
const bookingService: BookingStorage = {
  // Получить все бронирования
  getBookings: (): Booking[] => {
    const bookingsJson = localStorage.getItem(BOOKINGS_STORAGE_KEY);
    if (!bookingsJson) return [];
    
    try {
      const bookings = JSON.parse(bookingsJson) as Booking[];
      // Преобразуем строковые даты обратно в объекты Date
      return bookings.map(booking => ({
        ...booking,
        date: new Date(booking.date)
      }));
    } catch (error) {
      console.error("Ошибка при чтении бронирований:", error);
      return [];
    }
  },

  // Добавить новое бронирование
  addBooking: (booking: Booking): void => {
    const bookings = bookingService.getBookings();
    
    // Проверка доступности времени
    if (!bookingService.isTimeSlotAvailable(booking.date, booking.timeSlot, booking.questId)) {
      throw new Error("Это время уже забронировано");
    }
    
    // Генерация уникального ID, если он не был предоставлен
    if (!booking.id) {
      booking.id = Date.now().toString();
    }
    
    // Сохранение бронирования
    const updatedBookings = [...bookings, booking];
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(updatedBookings));
    
    // Отправляем событие синхронизации
    window.dispatchEvent(new CustomEvent('bookings-updated'));
  },

  // Обновить существующее бронирование
  updateBooking: (bookingId: string, updatedBooking: Booking): boolean => {
    const bookings = bookingService.getBookings();
    const index = bookings.findIndex(b => b.id === bookingId);
    
    if (index === -1) return false;
    
    // Проверка на занятость времени, если оно было изменено
    const originalBooking = bookings[index];
    if (
      originalBooking.timeSlot !== updatedBooking.timeSlot || 
      originalBooking.date.getTime() !== updatedBooking.date.getTime() ||
      originalBooking.questId !== updatedBooking.questId
    ) {
      const isAvailable = bookingService.isTimeSlotAvailable(
        updatedBooking.date, 
        updatedBooking.timeSlot,
        updatedBooking.questId
      );
      
      if (!isAvailable) {
        throw new Error("Выбранное время уже занято");
      }
    }
    
    // Обновление бронирования
    bookings[index] = updatedBooking;
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
    
    // Отправляем событие синхронизации
    window.dispatchEvent(new CustomEvent('bookings-updated'));
    return true;
  },

  // Удалить бронирование
  deleteBooking: (bookingId: string): boolean => {
    const bookings = bookingService.getBookings();
    const filteredBookings = bookings.filter(b => b.id !== bookingId);
    
    if (filteredBookings.length === bookings.length) {
      return false; // Ничего не было удалено
    }
    
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(filteredBookings));
    
    // Отправляем событие синхронизации
    window.dispatchEvent(new CustomEvent('bookings-updated'));
    return true;
  },

  // Проверить доступность временного слота
  isTimeSlotAvailable: (date: Date, timeSlot: string, questId: string): boolean => {
    const bookings = bookingService.getBookings();
    const dateString = date.toDateString();
    
    // Проверка на блокировку даты
    const blockedDates = bookingService.getBlockedDates();
    if (blockedDates.some(blockedDate => blockedDate.toDateString() === dateString)) {
      return false;
    }
    
    // Проверка на существующие бронирования
    return !bookings.some(booking => 
      booking.date.toDateString() === dateString && 
      booking.timeSlot === timeSlot &&
      booking.questId === questId
    );
  },

  // Получить бронирования для конкретной даты и квеста
  getBookingsForDate: (date: Date, questId?: string): Booking[] => {
    const bookings = bookingService.getBookings();
    const dateString = date.toDateString();
    
    return bookings.filter(booking => 
      booking.date.toDateString() === dateString &&
      (questId ? booking.questId === questId : true)
    );
  },

  // Получить заблокированные даты
  getBlockedDates: (): Date[] => {
    const blockedDatesJson = localStorage.getItem(BLOCKED_DATES_KEY);
    if (!blockedDatesJson) return [];
    
    try {
      const dates = JSON.parse(blockedDatesJson) as string[];
      return dates.map(dateStr => new Date(dateStr));
    } catch (error) {
      console.error("Ошибка при чтении заблокированных дат:", error);
      return [];
    }
  },

  // Добавить заблокированную дату
  addBlockedDate: (date: Date): void => {
    const blockedDates = bookingService.getBlockedDates();
    const dateString = date.toISOString().split('T')[0]; // Формат YYYY-MM-DD
    
    // Проверка на существование даты в списке
    if (blockedDates.some(d => d.toISOString().split('T')[0] === dateString)) {
      return; // Дата уже заблокирована
    }
    
    // Добавление даты
    const updatedDates = [...blockedDates, date];
    const datesAsStrings = updatedDates.map(d => d.toISOString());
    localStorage.setItem(BLOCKED_DATES_KEY, JSON.stringify(datesAsStrings));
    
    // Отправляем событие синхронизации
    window.dispatchEvent(new CustomEvent('blocked-dates-updated'));
  },

  // Удалить заблокированную дату
  removeBlockedDate: (date: Date): boolean => {
    const blockedDates = bookingService.getBlockedDates();
    const dateString = date.toISOString().split('T')[0]; // Формат YYYY-MM-DD
    
    const filteredDates = blockedDates.filter(d => 
      d.toISOString().split('T')[0] !== dateString
    );
    
    if (filteredDates.length === blockedDates.length) {
      return false; // Ничего не было удалено
    }
    
    const datesAsStrings = filteredDates.map(d => d.toISOString());
    localStorage.setItem(BLOCKED_DATES_KEY, JSON.stringify(datesAsStrings));
    
    // Отправляем событие синхронизации
    window.dispatchEvent(new CustomEvent('blocked-dates-updated'));
    return true;
  }
};

export default bookingService;
