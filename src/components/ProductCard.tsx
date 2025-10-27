import { Product } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, AlertTriangle, Package } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const isLowStock = product.quantity < product.lowStockThreshold;

const vendorId =
  (product as any)?.vendor?._id ||   // populated vendor
  (product as any)?.vendor ||        // raw ObjectId string
  (product as any)?.vendorProfile || // if schema used vendorProfile
  (product as any)?.vendorId ||      // just in case
  null;
  const handleAddToCart = () => {
    if (product.quantity === 0) {
      toast({
        title: 'Out of stock',
        description: 'This product is currently unavailable',
        variant: 'destructive',
      });
      return;
    }

    addToCart({
      productId: product._id || product.id,
  name: product.name,
  brand: product.brand,            // ✅ include brand
  price: product.price,
  quantity: 1,
  imageUrl: product.imageUrl,
  requiresPrescription: product.requiresPrescription,
  vendorName: product.vendorName,  // if you show it
  vendorId
    });

    toast({
      title: 'Added to cart',
      description: `${product.name} added successfully`,
    });
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border overflow-hidden">
      <div className="relative aspect-square overflow-hidden bg-accent/20">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.requiresPrescription && (
          <Badge className="absolute top-2 right-2 bg-destructive text-destructive-foreground">
            Rx
          </Badge>
        )}
        {isLowStock && product.quantity > 0 && (
          <Badge className="absolute top-2 left-2 bg-warning text-white flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Low Stock
          </Badge>
        )}
        {product.quantity === 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Badge variant="destructive" className="text-base px-4 py-2">
              Out of Stock
            </Badge>
          </div>
        )}
      </div>
      <CardContent className="p-4 space-y-2">
        <div>
          <h3 className="font-semibold text-foreground line-clamp-1">{product.name}</h3>
          <p className="text-sm text-muted-foreground">{product.brand}</p>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-1">{product.composition}</p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">₹{product.price}</span>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Package className="w-3 h-3" />
            <span>{product.quantity} left</span>
          </div>
        </div>
      </CardContent>
      {user?.role === 'customer' && (
        <CardFooter className="p-4 pt-0">
          <Button
            onClick={handleAddToCart}
            className="w-full"
            disabled={product.quantity === 0}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ProductCard;
