import mongoose from 'mongoose';

const shopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    logo_url: {
      type: String,
      default: '',
    },
    facebook: {
      type: String,
      default: '',
    },
    instagram: {
      type: String,
      default: '',
    },
    snapchat: {
      type: String,
      default: '',
    },
    x: {
      type: String,
      default: '',
    },
    youtube: {
      type: String,
      default: '',
    },
    shopify_store_key: {
      type: String,
      required: true,
    },
    shopify_api_key: {
      type: String,
      required: true,
    },
    meta_ads_manager_id: {
      type: String,
      default: null,
    },
    meta_business_manager_id: {
      type: String,
      default: null,
    },
    meta_api_key: {
      type: String,
      default: null,
    },
    expected_roas: {
      type: Number,
      default: null,
    },
    // Removed courier API keys
    status: {
      type: String,
      enum: ['Active', 'Disabled'],
      default: 'Active',
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

const Shop = mongoose.models?.Shop || mongoose.model('Shop', shopSchema);
export default Shop;
