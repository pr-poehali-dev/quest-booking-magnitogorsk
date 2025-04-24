import { useState, useEffect } from 'react';
import bookingService from '@/lib/bookingService';
import { Booking } from '@/types/booking';

// Хук для синхронизации бронирований между всеми пользователями
const useBookingSync = (dependencies: any[] = []) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Функция обновления данных
  const refreshData = () => {
    setBookings(bookingService.getBookings());
    setBlockedDates(bookingService.getBlockedDates());
    setIsLoading(false);
  };

  // Инициализация и подписка на события
  useEffect(() => {
    // Загрузка данных при монтировании
    refreshData();

    // Подписка на события обновления бронирований
    const handleBookingsUpdate = () => refreshData();
    window.addEventListener('bookings-updated', handleBookingsUpdate);
    window.addEventListener('blocked-dates-updated', handleBookingsUpdate);

    // Отписка при размонтировании
    return () => {
      window.removeEventListener('bookings-updated', handleBookingsUpdate);
      window.removeEventListener('blocked-dates-updated', handleBookingsUpdate);
    };
  }, [...dependencies]);

  // Методы для работы с бронированиями
  const addBooking = (booking: Booking) => {
    bookingService.addBooking(booking);
    refreshData();
  };

  const updateBooking = (bookingId: string, booking: Booking) => {
    const result = bookingService.updateBooking(bookingId, booking);
    refreshData();
    return result;
  };

  const deleteBooking = (bookingId: string) => {
    const result = bookingService.deleteBooking(bookingId);
    refreshData();
    return result;
  };

  const isTimeSlotAvailable = (date: Date, timeSlot: string, questId: string) => {
    return bookingService.isTimeSlotAvailable(date, timeSlot, questId);
  };

  const getBookingsForDate = (date: Date, questId?: string) => {
    return bookingService.getBookingsForDate(date, questId);
  };

  // Методы для работы с заблокированными датами
  const addBlockedDate = (date: Date) => {
    bookingService.addBlockedDate(date);
    refreshData();
  };

  const removeBlockedDate = (date: Date) => {
    const result = bookingService.removeBlockedDate(date);
    refreshData();
    return result;
  };

  return {
    bookings,
    blockedDates,
    isLoading,
    refreshData,
    addBooking,
    updateBooking,
    deleteBooking,
    isTimeSlotAvailable,
    getBookingsForDate,
    addBlockedDate,
    removeBlockedDate
  };
};

export default useBookingSync;
