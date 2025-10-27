import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import { ordersAPI } from '@/lib/api';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await ordersAPI.getMy();
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5" />;
      case 'shipped':
      case 'processing':
        return <Package className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'shipped':
        return 'secondary';
      case 'processing':
        return 'outline';
      default:
        return 'destructive';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Orders</h1>
          <p className="text-muted-foreground mt-1">Track and manage your medicine orders</p>
        </div>

        {loading ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="w-12 h-12 mx-auto text-muted-foreground mb-3 animate-pulse" />
              <p className="text-muted-foreground">Loading orders...</p>
            </CardContent>
          </Card>
        ) : orders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
              <p className="text-muted-foreground">Your order history will appear here</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order._id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">Order #{order._id?.slice(-6)}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <Badge variant={getStatusColor(order.orderStatus)}>
                      <span className="flex items-center gap-1.5">
                        {getStatusIcon(order.orderStatus)}
                        {order.orderStatus}
                      </span>
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    {order.items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {item.name} x {item.quantity}
                        </span>
                        <span className="font-medium">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 flex justify-between items-center">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Payment Status</p>
                      <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'destructive'}>
                        {order.paymentStatus}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total Amount</p>
                      <p className="text-2xl font-bold text-primary">₹{order.total}</p>
                    </div>
                  </div>
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
