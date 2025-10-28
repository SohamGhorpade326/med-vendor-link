import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle } from 'lucide-react';
import { saveOrder, updateProduct, getProducts } from '@/lib/mockData';

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [address, setAddress] = useState(
    (user?.role === 'customer' && (user as any)?.profile?.addresses?.[0]) || {
      label: 'Home',
      line1: '',
      line2: '',
      city: '',
      state: '',
      zip: '',
    }
  );

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const taxes = subtotal * 0.18;
  const total = subtotal + taxes;
  const requiresPrescription = items.some((item) => item.requiresPrescription);

  const handleCheckout = () => {
    if (!address.line1 || !address.city || !address.state || !address.zip) {
      toast({
        title: 'Incomplete address',
        description: 'Please fill in all required address fields',
        variant: 'destructive',
      });
      return;
    }
    if (!user) {
      toast({
        title: 'Login required',
        description: 'Please login to place an order.',
        variant: 'destructive',
      });
      return;
    }
    setShowPaymentModal(true);
  };

  const createOrder = () => {
    return saveOrder({
      customerId: user?.id || '',
      vendorId: '1',
      vendorName: 'PharmaCorp',
      items: items.map(it => ({
        productId: it.productId,
        name: it.name,
        brand: it.brand || '',
        price: it.price,
        quantity: it.quantity,
        imageUrl: it.imageUrl || '',
      })),
      subtotal,
      taxes,
      total,
      paymentStatus: 'paid' as const,
      orderStatus: 'completed' as const,
      shippingAddress: address,
      createdAt: new Date(),
    });
  };

  const simulatePayment = async () => {
    try {
      setIsProcessing(true);
      // payment simulation
      await new Promise((r) => setTimeout(r, 1100));
      const success = true; // Always succeed for demo
      setPaymentSuccess(success);

      if (!success) {
        setIsProcessing(false);
        return;
      }

      // Create the order and update product quantities
      createOrder();
      
      // Update product quantities in stock
      const products = getProducts();
      items.forEach(cartItem => {
        const product = products.find(p => p.id === cartItem.productId);
        if (product) {
          updateProduct(product.id, {
            quantity: Math.max(0, product.quantity - cartItem.quantity)
          });
        }
      });

      await new Promise((r) => setTimeout(r, 600));
      clearCart();
      setIsProcessing(false);
      toast({
        title: 'Order placed successfully!',
        description: 'Your order has been confirmed',
      });
      navigate('/orders');
    } catch (err: any) {
      setIsProcessing(false);
      setPaymentSuccess(false);
      toast({
        title: 'Order failed',
        description: err?.message || err?.response?.data?.error || 'Could not place the order',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="line1">Address Line 1 *</Label>
                  <Input
                    id="line1"
                    value={address.line1}
                    onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                    placeholder="House/Flat No., Building Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="line2">Address Line 2</Label>
                  <Input
                    id="line2"
                    value={address.line2}
                    onChange={(e) => setAddress({ ...address, line2: e.target.value })}
                    placeholder="Area, Street"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip">PIN Code *</Label>
                  <Input
                    id="zip"
                    value={address.zip}
                    onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                    placeholder="400001"
                  />
                </div>
              </CardContent>
            </Card>

            {requiresPrescription && (
              <Card className="border-warning bg-warning/5">
                <CardContent className="p-4">
                  <p className="text-sm font-medium text-warning-foreground">
                    ⚠️ Your order contains prescription medicines. Please upload a valid prescription before placing the order.
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Upload Prescription
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm max-h-40 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.productId} className="flex justify-between">
                      <span className="text-muted-foreground">
                        {item.name} x {item.quantity}
                      </span>
                      <span className="font-medium">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">GST (18%)</span>
                    <span className="font-medium">₹{(subtotal * 0.18).toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between text-base">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-primary text-xl">₹{(subtotal * 1.18).toFixed(2)}</span>
                  </div>
                </div>
                <Button className="w-full" size="lg" onClick={handleCheckout}>
                  Place Order
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment</DialogTitle>
            <DialogDescription>
              {isProcessing ? 'Processing your payment...' : 'Complete your payment'}
            </DialogDescription>
          </DialogHeader>

          {paymentSuccess === null && (
            <div className="space-y-4">
              <div className="bg-accent p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-primary">₹{(subtotal * 1.18).toFixed(2)}</p>
                <p className="text-sm text-muted-foreground mt-1">Total Amount</p>
              </div>
              <Button className="w-full" onClick={simulatePayment} disabled={isProcessing}>
                {isProcessing ? 'Processing...' : 'Pay Now (Demo)'}
              </Button>
            </div>
          )}

          {paymentSuccess === true && (
            <div className="text-center py-6 space-y-4">
              <CheckCircle className="w-16 h-16 text-success mx-auto" />
              <div>
                <h3 className="text-xl font-semibold text-success">Payment Successful!</h3>
                <p className="text-muted-foreground mt-2">Redirecting to orders...</p>
              </div>
            </div>
          )}

          {paymentSuccess === false && (
            <div className="text-center py-6 space-y-4">
              <XCircle className="w-16 h-16 text-destructive mx-auto" />
              <div>
                <h3 className="text-xl font-semibold text-destructive">Payment Failed</h3>
                <p className="text-muted-foreground mt-2">Please try again</p>
              </div>
              <Button variant="outline" onClick={() => setPaymentSuccess(null)}>
                Retry Payment
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Checkout;
