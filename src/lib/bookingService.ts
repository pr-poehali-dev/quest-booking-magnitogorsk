import { Booking } from "@/types/booking";

// Ключи для хранения данных в localStorage
const BOOKINGS_STORAGE_KEY = "checkoutQuest_bookings";
const BLOCKED_DATES_KEY = "checkoutQuest_blockedDates";
const SETTINGS_KEY = "checkoutQuest_settings";

// Интерфейс настроек
interface Settings {
  supportPhone: string;
}

// Функция для отправки событий с задержкой
const dispatchEventWithDelay = (eventName: string, delay = 100) => {
  setTimeout(() => {
    window.dispatchEvent(new CustomEvent(eventName));
  }, delay);
};

// Интерфейс для синхронизированного хранилища бронирований
interface BookingStorage {
  getBookings: () => Booking[];
  addBooking: (booking: Booking) => void;
  updateBooking: (bookingId: string, updatedBooking: Booking) => boolean;
  deleteBooking: (bookingId: string) => boolean;
  isTimeSlotAvailable: (date: Date, time: string, questType: string) => boolean;
  isTimeAvailable: (date: Date, time: string) => boolean;
  getBookingsForDate: (date: Date, questType?: string) => Booking[];
  getBlockedDates: () => Date[];
  addBlockedDate: (date: Date) => void;
  removeBlockedDate: (date: Date) => boolean;
  getSupportPhone: () => string;
  setSupportPhone: (phone: string) => void;
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
    if (!bookingService.isTimeSlotAvailable(booking.date, booking.time, booking.questType)) {
      throw new Error("Это время уже забронировано");
    }
    
    // Генерация уникального ID, если он не был предоставлен
    if (!booking.id) {
      booking.id = Date.now().toString();
    }
    
    // Задаем статус pending (ожидание) для новых броней от пользователей
    if (!booking.status) {
      booking.status = 'pending';
    }
    
    // Сохранение бронирования
    const updatedBookings = [...bookings, booking];
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(updatedBookings));
    
    // Отправляем событие синхронизации с задержкой
    dispatchEventWithDelay('bookings-updated');
  },

  // Обновить существующее бронирование
  updateBooking: (bookingId: string, updatedBooking: Booking): boolean => {
    const bookings = bookingService.getBookings();
    const index = bookings.findIndex(b => b.id === bookingId);
    
    if (index === -1) return false;
    
    // Проверка на занятость времени, если оно было изменено
    const originalBooking = bookings[index];
    if (
      originalBooking.time !== updatedBooking.time || 
      originalBooking.date.toDateString() !== updatedBooking.date.toDateString() ||
      originalBooking.questType !== updatedBooking.questType
    ) {
      const isAvailable = bookingService.isTimeSlotAvailable(
        updatedBooking.date, 
        updatedBooking.time,
        updatedBooking.questType
      );
      
      if (!isAvailable) {
        throw new Error("Выбранное время уже занято");
      }
    }
    
    // Обновление бронирования
    bookings[index] = updatedBooking;
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
    
    // Отправляем событие синхронизации с задержкой
    dispatchEventWithDelay('bookings-updated');
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
    
    // Отправляем событие синхронизации с задержкой
    dispatchEventWithDelay('bookings-updated');
    return true;
  },

  // Проверить, не прошло ли уже выбранное время
  isTimeAvailable: (date: Date, timeStr: string): boolean => {
    const now = new Date();
    const bookingDate = new Date(date);
    
    // Установка времени для бронирования
    const [hours, minutes] = timeStr.split(':').map(Number);
    bookingDate.setHours(hours, minutes, 0, 0);
    
    // Проверка на минимальное время до начала (1 час)
    const msInHour = 60 * 60 * 1000;
    const minimumTimeBeforeBooking = 1 * msInHour; // 1 час в миллисекундах
    
    // Если бронирование в прошлом или меньше чем за час до начала - недоступно
    return bookingDate.getTime() > (now.getTime() + minimumTimeBeforeBooking);
  },

  // Проверить доступность временного слота
  isTimeSlotAvailable: (date: Date, time: string, questType: string): boolean => {
    const bookings = bookingService.getBookings();
    const dateString = date.toDateString();
    
    // Проверка на блокировку даты
    const blockedDates = bookingService.getBlockedDates();
    if (blockedDates.some(blockedDate => blockedDate.toDateString() === dateString)) {
      return false;
    }
    
    // Проверка на прошедшее время
    if (!bookingService.isTimeAvailable(date, time)) {
      return false;
    }
    
    // Проверка на существующие бронирования
    return !bookings.some(booking => 
      booking.date.toDateString() === dateString && 
      booking.time === time &&
      booking.questType === questType
    );
  },

  // Получить бронирования для конкретной даты и квеста
  getBookingsForDate: (date: Date, questType?: string): Booking[] => {
    const bookings = bookingService.getBookings();
    const dateString = date.toDateString();
    
    return bookings.filter(booking => 
      booking.date.toDateString() === dateString &&
      (questType ? booking.questType === questType : true)
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
    
    // Отправляем событие синхронизации с задержкой
    dispatchEventWithDelay('blocked-dates-updated');
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
    
    // Отправляем событие синхронизации с задержкой
    dispatchEventWithDelay('blocked-dates-updated');
    return true;
  },

  // Получить телефон поддержки
  getSupportPhone: (): string => {
    try {
      const settings = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}') as Settings;
      return settings.supportPhone || '+7 (999) 123-45-67';
    } catch (error) {
      return '+7 (999) 123-45-67';
    }
  },

  // Установить телефон поддержки
  setSupportPhone: (phone: string): void => {
    try {
      const settings = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}') as Settings;
      settings.supportPhone = phone;
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error("Ошибка при сохранении настроек:", error);
    }
  }
};

export default bookingService;
