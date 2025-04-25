import { Booking } from '@/types/booking';

// Имитация хранилища данных
let bookings: Booking[] = [];
let blockedDates: { date: string, reason: string }[] = [];

// Генерация диапазона времени для квестов
export const generateTimeSlots = (): string[] => {
  const slots: string[] = [];
  // Время начала и окончания работы
  const startHour = 10;
  const endHour = 23;
  
  for (let hour = startHour; hour < endHour; hour++) {
    slots.push(`${hour}:00`);
    slots.push(`${hour}:30`);
  }
  
  return slots;
};

// Получение всех бронирований
export const getBookings = (): Booking[] => {
  return [...bookings];
};

// Добавление нового бронирования
export const addBooking = (booking: Booking): void => {
  bookings.push(booking);
  dispatchEventWithDelay('bookings-updated');
};

// Обновление существующего бронирования
export const updateBooking = (id: string, updatedBooking: Partial<Booking>): void => {
  const index = bookings.findIndex(booking => booking.id === id);
  if (index !== -1) {
    bookings[index] = { ...bookings[index], ...updatedBooking };
    dispatchEventWithDelay('bookings-updated');
  }
};

// Удаление бронирования
export const deleteBooking = (id: string): void => {
  bookings = bookings.filter(booking => booking.id !== id);
  dispatchEventWithDelay('bookings-updated');
};

// Получение бронирований на конкретную дату
export const getBookingsByDate = (date: string): Booking[] => {
  return bookings.filter(booking => booking.date === date);
};

// Получение бронирований по квесту
export const getBookingsByQuest = (questId: string): Booking[] => {
  return bookings.filter(booking => booking.questId === questId);
};

// Проверка доступности временного слота на конкретную дату и квест
export const isTimeSlotAvailable = (date: string, time: string, questId: string): boolean => {
  // Проверка, заблокирована ли дата
  if (isDateBlocked(date)) {
    return false;
  }
  
  // Проверка, забронировано ли уже это время для данного квеста
  const isBooked = bookings.some(booking => 
    booking.date === date && 
    booking.time === time && 
    booking.questId === questId
  );
  
  return !isBooked;
};

// Проверка, забронировано ли время на любом квесте
export const isTimeBookedOnAnyQuest = (date: string, time: string): boolean => {
  return bookings.some(booking => 
    booking.date === date && 
    booking.time === time
  );
};

// Проверка, заблокирована ли дата
export const isDateBlocked = (date: string): boolean => {
  return blockedDates.some(blocked => blocked.date === date);
};

// Получение причины блокировки даты
export const getBlockedDateReason = (date: string): string | null => {
  const blockedDate = blockedDates.find(blocked => blocked.date === date);
  return blockedDate ? blockedDate.reason : null;
};

// Блокировка даты
export const blockDate = (date: string, reason: string): void => {
  // Проверяем, не заблокирована ли уже эта дата
  if (!isDateBlocked(date)) {
    blockedDates.push({ date, reason });
    dispatchEventWithDelay('dates-updated');
  }
};

// Разблокировка даты
export const unblockDate = (date: string): void => {
  blockedDates = blockedDates.filter(blocked => blocked.date !== date);
  dispatchEventWithDelay('dates-updated');
};

// Получение всех заблокированных дат
export const getBlockedDates = (): { date: string, reason: string }[] => {
  return [...blockedDates];
};

// Отправка события с задержкой для предотвращения циклов обновления
const dispatchEventWithDelay = (eventName: string, delay = 100): void => {
  setTimeout(() => {
    window.dispatchEvent(new CustomEvent(eventName));
  }, delay);
};

// Форматировать телефонный номер для отображения
export const formatPhoneNumber = (phone: string): string => {
  // Удаляем все нецифровые символы
  const cleaned = phone.replace(/\D/g, '');
  
  // Проверяем длину номера
  if (cleaned.length !== 11) {
    return phone; // Возвращаем оригинальный номер, если не соответствует формату
  }
  
  // Форматируем номер как +7 (XXX) XXX-XX-XX
  return `+${cleaned[0]} (${cleaned.substring(1, 4)}) ${cleaned.substring(4, 7)}-${cleaned.substring(7, 9)}-${cleaned.substring(9, 11)}`;
};

export default {
  generateTimeSlots,
  getBookings,
  addBooking,
  updateBooking,
  deleteBooking,
  getBookingsByDate,
  getBookingsByQuest,
  isTimeSlotAvailable,
  isDateBlocked,
  getBlockedDateReason,
  blockDate,
  unblockDate,
  getBlockedDates,
  isTimeBookedOnAnyQuest,
  formatPhoneNumber
};
