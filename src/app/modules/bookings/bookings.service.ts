import { Booking } from "./bookings.model";
import { IBooking } from "./bookings.interface";

export class BookingService {
  async createBooking(payload: IBooking) {
    const booking = await Booking.create(payload);
    return booking;
  }

  async getAllBookings() {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    return bookings;
  }

  async getBookingById(id: string) {
    const booking = await Booking.findById(id);
    return booking;
  }

  async deleteBooking(id: string) {
    const booking = await Booking.findByIdAndDelete(id);
    return booking;
  }
}

export const bookingService = new BookingService();
