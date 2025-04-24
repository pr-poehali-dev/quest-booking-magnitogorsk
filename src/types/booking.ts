export interface Booking {
  id: string;
  questType: string;
  date: Date;
  time: string;
  name: string;
  phone: string;
  age?: string;
  peopleCount?: number;
  prepayment?: number;
  payment?: number;
  teaZone?: boolean;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes?: string;
}
