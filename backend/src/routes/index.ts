import express from 'express';
import auth from './auth';
import products from './products';
import adjustQty from './adjust-quantity';
import order from './order';
import user from './user';
import dashboard from './dashboard';
import reduceQtyLog from './reduce-qty-log';
import shops from './shop';
import stockZone from './stock-zones';
import activity from './activity';
import vendor from './vendor';
import shopifyOrders from './shopify-orders';
import payment from './payment';
import employee from './employee';
import attendance from './attendance';

import courier from './courier';
import bill from './bill';
import backgroundTasks from './background-tasks';

const router = express.Router();

export default (): express.Router => {
  auth(router);
  shops(router);
  products(router);
  adjustQty(router);
  order(router);
  user(router);
  dashboard(router);
  reduceQtyLog(router);
  stockZone(router);
  activity(router);
  vendor(router);
  courier(router);
  payment(router);
  employee(router);
  attendance(router);
  router.use(shopifyOrders);
  router.use(bill);
  router.use(backgroundTasks)
  return router;
};
