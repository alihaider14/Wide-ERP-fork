import mongoose from 'mongoose';
import Product from './product';
import User from './user';

const productQuantitySchema = new mongoose.Schema(
  {
    bill_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bill',
      required: false,
    },
    product_id: {
      ref: Product,
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    cost: {
      type: Number,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },
    remaining_qty: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      required: false,
    },
    created_by: {
      ref: User,
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

const ProductsQuantity =
  mongoose.models?.products_quantity ||
  mongoose.model('products_quantity', productQuantitySchema);

export default ProductsQuantity;
