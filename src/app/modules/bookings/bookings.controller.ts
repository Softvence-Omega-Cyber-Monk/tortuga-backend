import { Request, Response } from "express";
import { bookingService } from "./bookings.service";

export class BookingController {
  async createBooking(req: Request, res: Response) {
    try {
      const booking = await bookingService.createBooking(req.body);
      res.status(201).json({
        success: true,
        message: "Booking created successfully",
        data: booking
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Failed to create booking",
        error: error instanceof Error ? error.message : error
      });
    }
  }

  async getAllBookings(req: Request, res: Response) {
    try {
      const bookings = await bookingService.getAllBookings();
      res.status(200).json({
        success: true,
        data: bookings
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Failed to fetch bookings",
        error: error instanceof Error ? error.message : error
      });
    }
  }

  async getBookingById(req: Request, res: Response) {
    try {
      const booking = await bookingService.getBookingById(req.params.id);
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Booking not found"
        });
      }
      res.status(200).json({
        success: true,
        data: booking
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Failed to fetch booking",
        error: error instanceof Error ? error.message : error
      });
    }
  }

  async deleteBooking(req: Request, res: Response) {
    try {
      const booking = await bookingService.deleteBooking(req.params.id);
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Booking not found"
        });
      }
      res.status(200).json({
        success: true,
        message: "Booking deleted successfully"
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Failed to delete booking",
        error: error instanceof Error ? error.message : error
      });
    }
  }
}

export const bookingController = new BookingController();
