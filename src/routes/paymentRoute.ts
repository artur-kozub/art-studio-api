import express from 'express';
import PaymentController from '../controller/paymentController';

const router = express.Router();

router.get('/payment-form', PaymentController.createWayForPayForm);
router.post('/set-status', PaymentController.handleWayForPayStatus);

export default router;