import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { ordersAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

const Orders = () => {
  const { user } = useAuth(); // <-- don't take customerProfile; use user?.profile if needed
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const data = await ordersAPI.getMy();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Orders</h1>

        {loading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : orders.length === 0 ? (
          <p className="text-muted-foreground">No orders yet.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order._id || order.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">
                        Order #{order._id || order.id}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(order.createdAt || order.date).toLocaleString()}
                      </div>
                      {order.shippingAddress && (
                        <div className="text-sm text-muted-foreground mt-1">
                          Ship to: {order.shippingAddress.line1}
                          {order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ''}
                          , {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                        </div>
                      )}
                      <div className="text-sm">
                        Items:{' '}
                        {order.items?.reduce(
                          (a: number, i: any) => a + (i.quantity || 0),
                          0
                        ) ?? 0}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">₹{order.total ?? order.amount ?? 0}</div>
                      <div className="text-sm text-muted-foreground">
                        {order.status ?? 'placed'}
                      </div>
                    </div>
                  </div>

                  {/* items preview */}
                  {Array.isArray(order.items) && order.items.length > 0 && (
                    <div className="mt-3 text-sm text-muted-foreground space-y-1">
                      {order.items.map((it: any) => (
                        <div key={(it.product?._id) || it.product || it.name}>
                          {it.name ?? 'Item'} × {it.quantity} — ₹{(it.price || 0) * (it.quantity || 0)}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Orders;
