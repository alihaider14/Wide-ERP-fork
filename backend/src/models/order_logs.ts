import mongoose from 'mongoose';
import User from './user';
import Order from './order';

const orderLogsSchema = new mongoose.Schema(
  {
    order_id: {
      ref: Order,
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    user_id: {
      ref: User,
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      enum: ['completed', 'drafted', 'cancelled'],
      required: true,
    },
    discount: {
      type: String,
      default: '',
    },
    items_count: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    is_update: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const OrderLogs =
  mongoose.models?.order_logs || mongoose.model('order_logs', orderLogsSchema);

export default OrderLogs;
