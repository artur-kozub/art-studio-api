import express from 'express';
import AdminController from '../controller/adminController';

const router = express.Router();

router.post('/set-admin', AdminController.setAdmin);
router.get('/get/:chatId', AdminController.getAdmin);
router.delete('/delete/:chatId', AdminController.deleteAdmin);

export default router;