import express from 'express';
import BookingController from '../controllers/BookingController.js';

const router = express.Router();

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

router.patch('/changeStatus/:id',            BookingController.changeStatus);

router.get('/next', BookingController.nextBooking);

export default router;