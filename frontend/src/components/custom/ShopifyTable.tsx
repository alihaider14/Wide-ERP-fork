
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Shop } from '@/types/shop';

interface OrderType {
  order: string;
  customer: string;
  shop: string;
  shopId?: string;
  shopKey?: string;
  date: string;
  phone?: string;
  total: string;
  items: number;
  status: string;
  tracking?: string;
  destination?: string;
  note?: string;
}

const ShopifyTable = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState<string>('all');
  const [orders, setOrders] = useState<OrderType[]>([]);

  useEffect(() => {
    axios.get('/api/shops').then((res) => setShops(res.data));
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [selectedStoreId]);

  async function fetchOrders() {
    const params: { page: number; size: number; store_id?: string } = {
      page: 1,
      size: 10,
    };

    if (selectedStoreId !== 'all') {
      params.store_id = selectedStoreId;
    }

    try {
      const res = await axios.get('http://localhost:3000/api/shopify-orders', {
        params,
      });
      setOrders(res.data.orders);
    } catch (err) {
      console.error(err);
    }
  }

  const selectedShop = shops.find((s) => s._id === selectedStoreId);

  const visibleOrders = orders.filter(
    (o) =>
      !selectedStoreId ||
      selectedStoreId === 'all' ||
      o.shop === selectedShop?.name
  );

  return (
    <>
      {/* Shop selection dropdown */}
      <select
        value={selectedStoreId}
        onChange={(e) => setSelectedStoreId(e.target.value)}
      >
        {shops.map((shop) => (
          <option key={shop._id} value={shop._id}>
            {shop.name}
          </option>
        ))}
      </select>

      {/* Example table rendering */}
      <table>
        <thead>
          <tr>
            <th>Order</th>
            <th>Customer</th>
            <th>Shop</th>
            <th>Date</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {visibleOrders.map((order) => (
            <tr key={order.order}>
              <td>{order.order}</td>
              <td>{order.customer}</td>
              <td>{order.shop}</td>
              <td>{order.date}</td>
              <td>{order.total}</td>
              <td>{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default ShopifyTable;
