import express from 'express';
import BookingController from '../controllers/BookingController.js';

const router = express.Router();

// GET /booking/bookings?dentistId=&date=&isBooked=
router.get('/bookings',          BookingController.list);

// ✅ GET /booking/available-dates?dentistId=&from=&to=
router.get('/available-dates',   BookingController.availableDates);

// POST /booking/slot  — один слот
router.post('/slot',             BookingController.create);

// POST /booking/slots — batch генерация
router.post('/slots',            BookingController.createBatch);

// PATCH /booking/:id
router.patch('/:id',             BookingController.update);

// DELETE /booking/:id
router.delete('/:id',            BookingController.remove);

export default router;