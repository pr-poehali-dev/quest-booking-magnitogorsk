// Сервис для работы с бронированиями квестов

import { Booking } from "@/types/booking";

interface BlockedDate {
  date: string;
  reason: string;
}

// Ключи для localStorage
const BOOKINGS_KEY = "quest_bookings";
const BLOCKED_DATES_KEY = "quest_blocked_dates";
const SUPPORT_PHONE_KEY = "quest_support_phone";

// Получаем данные из localStorage или возвращаем начальные значения
const getStoredBookings = (): Booking[] => {
  const stored = localStorage.getItem(BOOKINGS_KEY);
  if (!stored) return [];
  
  try {
    const bookings = JSON.parse(stored);
    return Array.isArray(bookings) ? bookings : [];
  } catch (error) {
    console.error("Error parsing bookings from localStorage:", error);
    return [];
  }
};

const getStoredBlockedDates = (): BlockedDate[] => {
  const stored = localStorage.getItem(BLOCKED_DATES_KEY);
  if (!stored) return [];
  
  try {
    const blockedDates = JSON.parse(stored);
    return Array.isArray(blockedDates) ? blockedDates : [];
  } catch (error) {
    console.error("Error parsing blocked dates from localStorage:", error);
    return [];
  }
};

// Начальное значение телефона поддержки
let supportPhone = "+7 (999) 123-45-67";

// Сохраняем данные в localStorage
const saveBookings = (bookings: Booking[]) => {
  try {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
    return true;
  } catch (error) {
    console.error("Error saving bookings to localStorage:", error);
    return false;
  }
};

const saveBlockedDates = (blockedDates: BlockedDate[]) => {
  try {
    localStorage.setItem(BLOCKED_DATES_KEY, JSON.stringify(blockedDates));
    return true;
  } catch (error) {
    console.error("Error saving blocked dates to localStorage:", error);
    return false;
  }
};

// Генерация временных слотов
const generateTimeSlots = (): string[] => {
  return ["12:00", "13:30", "15:00", "16:30", "18:00", "19:30", "21:00", "22:30"];
};

// Проверка доступности временного слота
const isTimeSlotAvailable = (date: string, time: string, questId: string): boolean => {
  const bookings = getStoredBookings();
  
  // Проверяем, не занято ли время уже для этого квеста
  const bookedForThisQuest = bookings.some(
    booking => booking.date === date && booking.time === time && booking.questId === questId
  );
  
  // Проверяем, не занято ли время для другого квеста
  // (чтобы не было двух квестов в одно и то же время)
  const bookedForOtherQuest = bookings.some(
    booking => booking.date === date && booking.time === time && booking.questId !== questId
  );
  
  // Проверяем, не заблокирована ли дата полностью
  const isDateBlocked = isDateFullyBlocked(date);
  
  return !bookedForThisQuest && !bookedForOtherQuest && !isDateBlocked;
};

// Проверка, заблокирована ли дата
const isDateBlocked = (date: string): boolean => {
  const blockedDates = getStoredBlockedDates();
  return blockedDates.some(blockedDate => blockedDate.date === date);
};

const isDateFullyBlocked = (date: string): boolean => {
  return isDateBlocked(date);
};

// Добавление бронирования
const addBooking = (booking: Booking): boolean => {
  const bookings = getStoredBookings();
  
  // Проверяем доступность времени перед добавлением
  if (!isTimeSlotAvailable(booking.date, booking.time, booking.questId)) {
    return false;
  }
  
  // Добавляем новое бронирование
  bookings.push(booking);
  saveBookings(bookings);
  return true;
};

// Получение бронирований
const getBookings = (): Booking[] => {
  return getStoredBookings();
};

// Получение бронирований для конкретного квеста
const getBookingsForQuest = (questId: string): Booking[] => {
  const bookings = getStoredBookings();
  return bookings.filter(booking => booking.questId === questId);
};

// Обновление статуса бронирования
const updateBookingStatus = (bookingId: string, status: "pending" | "confirmed" | "cancelled"): boolean => {
  const bookings = getStoredBookings();
  const index = bookings.findIndex(booking => booking.id === bookingId);
  
  if (index === -1) {
    return false;
  }
  
  bookings[index].status = status;
  saveBookings(bookings);
  return true;
};

// Обновление бронирования
const updateBooking = (bookingId: string, updatedBooking: Booking): boolean => {
  const bookings = getStoredBookings();
  const index = bookings.findIndex(booking => booking.id === bookingId);
  
  if (index === -1) {
    return false;
  }
  
  // Проверка на доступность нового времени, если оно изменилось
  const oldBooking = bookings[index];
  if (
    (oldBooking.date !== updatedBooking.date || oldBooking.time !== updatedBooking.time) &&
    !isTimeSlotAvailable(updatedBooking.date, updatedBooking.time, updatedBooking.questId)
  ) {
    return false;
  }
  
  bookings[index] = updatedBooking;
  saveBookings(bookings);
  return true;
};

// Удаление бронирования
const deleteBooking = (bookingId: string): boolean => {
  const bookings = getStoredBookings();
  const newBookings = bookings.filter(booking => booking.id !== bookingId);
  
  if (newBookings.length === bookings.length) {
    return false;
  }
  
  saveBookings(newBookings);
  return true;
};

// Блокирование даты
const blockDate = (date: string, reason: string): boolean => {
  const blockedDates = getStoredBlockedDates();
  
  // Проверяем, не заблокирована ли дата уже
  if (isDateBlocked(date)) {
    return false;
  }
  
  blockedDates.push({ date, reason });
  saveBlockedDates(blockedDates);
  return true;
};

// Разблокирование даты
const unblockDate = (date: string): boolean => {
  const blockedDates = getStoredBlockedDates();
  const newBlockedDates = blockedDates.filter(blockedDate => blockedDate.date !== date);
  
  if (newBlockedDates.length === blockedDates.length) {
    return false;
  }
  
  saveBlockedDates(newBlockedDates);
  return true;
};

// Получение заблокированных дат
const getBlockedDates = (): BlockedDate[] => {
  return getStoredBlockedDates();
};

// Функции для работы с телефоном поддержки
const getSupportPhone = (): string => {
  const stored = localStorage.getItem(SUPPORT_PHONE_KEY);
  return stored || supportPhone;
};

const setSupportPhone = (phone: string): void => {
  supportPhone = phone;
  localStorage.setItem(SUPPORT_PHONE_KEY, phone);
};

// Экспорт функций сервиса
const bookingService = {
  generateTimeSlots,
  isTimeSlotAvailable,
  isDateBlocked,
  addBooking,
  getBookings,
  getBookingsForQuest,
  updateBookingStatus,
  updateBooking,
  deleteBooking,
  blockDate,
  unblockDate,
  getBlockedDates,
  getSupportPhone,
  setSupportPhone,
};

export default bookingService;
