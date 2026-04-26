import express from 'express';
import BookingController from '../controllers/BookingController.js';

const router = express.Router();

router.get('/bookings', BookingController.list);
router.get('/available-dates', BookingController.availableDates);
router.get('/next', BookingController.nextBooking);
router.get('/:id', BookingController.getOne);

router.post('/slot', BookingController.create);
router.post('/slots', BookingController.createBatch);

router.patch('/:id', BookingController.update);
router.patch('/changeStatus/:id', BookingController.changeStatus);

router.delete('/:id', BookingController.remove);

export default router;
