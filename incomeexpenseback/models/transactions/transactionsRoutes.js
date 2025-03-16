import express from 'express';
import transactionController from './transactionsController.js';
import authenticate from '../../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authenticate, transactionController.addTransaction)
router.get('/', authenticate, transactionController.getTransaction)
router.delete('/:id', authenticate, transactionController.deleteTransaction)
router.get('/balance', authenticate, transactionController.getBalance)
router.get("/search", authenticate, transactionController.searchTransaction);
router.get("/summary", authenticate, transactionController.getSummary);
router.get("/export/excel", authenticate, transactionController.exportToExcel);

export default router