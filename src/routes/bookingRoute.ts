import express from 'express';
import BookingController from '../controller/bookingController';

const router = express.Router();

router.post('/book', BookingController.createBooking);
router.get('/all', BookingController.getBookingRecords);
router.put('/update', BookingController.updateBooking);
router.delete('/delete', BookingController.deleteBooking);

export default router;