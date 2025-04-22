export interface Booking {
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
