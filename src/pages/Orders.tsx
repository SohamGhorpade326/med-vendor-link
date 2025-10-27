import { useState } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';

const Orders = () => {
  // Mock orders for demo
  const [orders] = useState([
    {
      id: 'ORD001',
      date: new Date('2025-01-15'),
      items: 3,
      total: 450,
      status: 'completed' as const,
      vendorName: 'MediCare Pharmacy',
    },
    {
      id: 'ORD002',
      date: new Date('2025-01-20'),
      items: 2,
      total: 285,
      status: 'shipped' as const,
      vendorName: 'MediCare Pharmacy',
    },
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'shipped':
        return <Package className="w-4 h-4" />;
      case 'processing':
        return <Clock className="w-4 h-4" />;
      default:
        return <XCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success text-white';
      case 'shipped':
        return 'bg-primary text-primary-foreground';
      case 'processing':
        return 'bg-warning text-white';
      default:
        return 'bg-destructive text-destructive-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>

          {loading ? (
            <Card>
              <CardContent className="p-12 text-center">
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
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {order.date.toLocaleDateString()} • {order.vendorName}
                      </p>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      {order.items} item{order.items > 1 ? 's' : ''}
                    </div>
                    <div className="text-xl font-bold text-primary">₹{order.total}</div>
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
