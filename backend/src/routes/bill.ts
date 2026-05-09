import { Router } from 'express'; 

import { createBill } from '~/controllers/bill/createBill';
import { updateBill } from '~/controllers/bill/updateBill';
import { getBillItems } from '~/controllers/bill/getBillItems';
import { getBills } from '../controllers/bill/getBills';
import { getBillById } from '../controllers/bill/getBillById';
import { deleteBill } from '~/controllers/bill/deleteBill';
import authenticateJWT from '~/middlewares/validate-token';

const router = Router();
router.get('/bills', authenticateJWT("view_bills"), getBills);
router.get('/bill/:id', authenticateJWT("view_bills"), getBillById);
router.post('/bill', authenticateJWT("create_bills"), createBill);
router.put('/bill', authenticateJWT("update_bills"), updateBill);
router.delete('/bill/:bill_id', authenticateJWT("delete_bills"), deleteBill);
router.get('/bill-items', authenticateJWT("view_bills"), getBillItems);

export default router;
