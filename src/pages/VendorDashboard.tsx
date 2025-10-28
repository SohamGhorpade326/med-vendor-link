import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { productsAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, AlertTriangle, Package } from 'lucide-react';

const VendorDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const lowStockProducts = products.filter(p => p.quantity < p.lowStockThreshold && p.quantity > 0);

  const fetchProducts = async () => {
    try {
      const data = await productsAPI.getVendorProducts();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleQuickUpdate = async (id: string, field: 'price' | 'quantity', value: number) => {
    try {
      await productsAPI.update(id, { [field]: value });
      setProducts(prev =>
        prev.map(p => ((p._id || p.id) === id ? { ...p, [field]: value } : p))
      );
      toast({
        title: 'Updated',
        description: `${field} updated successfully`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update product',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await productsAPI.delete(id);
      setProducts(prev => prev.filter(p => (p._id || p.id) !== id));
      toast({
        title: 'Product deleted',
        description: 'Product has been removed',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete product',
        variant: 'destructive'
      });
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      try {
        const productId = editingProduct._id || editingProduct.id;
        if (productId) {
          const updated = await productsAPI.update(productId, editingProduct);
          setProducts(prev => prev.map(p => ((p._id || p.id) === productId ? updated : p)));
          toast({ title: 'Product updated' });
        } else {
          const created = await productsAPI.create(editingProduct);
          setProducts(prev => [...prev, created]);
          toast({ title: 'Product added' });
        }
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.response?.data?.error || 'Failed to save product',
          variant: 'destructive'
        });
        return;
      }
    }
    setIsDialogOpen(false);
    setEditingProduct(null);
  };

  const openAddDialog = () => {
    setEditingProduct({
      id: '',
      name: '',
      brand: '',
      composition: '',
      price: 0,
      quantity: 0,
      batchNumber: '',
      expiryDate: new Date(),
      requiresPrescription: false,
      imageUrl: '',
      lowStockThreshold: 10,
    } as Product);
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Product Management</h1>
            <p className="text-muted-foreground mt-1">Manage your inventory</p>
          </div>
          <Button onClick={openAddDialog}>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>

        {lowStockProducts.length > 0 && (
          <Card className="mb-6 border-warning bg-warning/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-warning mt-0.5" />
                <div>
                  <h3 className="font-semibold text-warning-foreground">Low Stock Alert</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {lowStockProducts.length} product(s) running low on stock
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((product) => {
              const isLowStock = product.quantity < product.lowStockThreshold;
              const productId = product._id || product.id;
              return (
                <Card key={productId} className={isLowStock && product.quantity > 0 ? 'border-warning' : ''}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-24 h-24 object-cover rounded border"
                    />
                    <div className="flex-1 grid md:grid-cols-6 gap-4 items-center">
                      <div className="md:col-span-2">
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">{product.brand}</p>
                        <p className="text-xs text-muted-foreground mt-1">{product.composition}</p>
                        {product.requiresPrescription && (
                          <Badge variant="destructive" className="mt-1">Rx Required</Badge>
                        )}
                      </div>
                      
                      <div className="space-y-1">
                        <Label className="text-xs">Price (₹)</Label>
                        <Input
                          type="number"
                          value={product.price}
                          onChange={(e) => handleQuickUpdate(productId, 'price', Number(e.target.value))}
                          className="h-9"
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <Label className="text-xs">Quantity</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={product.quantity}
                            onChange={(e) => handleQuickUpdate(productId, 'quantity', Number(e.target.value))}
                            className="h-9"
                          />
                          {isLowStock && product.quantity > 0 && (
                            <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0" />
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Package className="w-3 h-3" />
                          <span>Batch: {product.batchNumber}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Exp: {new Date(product.expiryDate).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setEditingProduct(product);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDelete(productId)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        )}
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct?.id ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Product Name *</Label>
                  <Input
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Brand *</Label>
                  <Input
                    value={editingProduct.brand}
                    onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Composition *</Label>
                <Input
                  value={editingProduct.composition}
                  onChange={(e) => setEditingProduct({ ...editingProduct, composition: e.target.value })}
                  required
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Price (₹) *</Label>
                  <Input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    required
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Quantity *</Label>
                  <Input
                    type="number"
                    value={editingProduct.quantity}
                    onChange={(e) => setEditingProduct({ ...editingProduct, quantity: Number(e.target.value) })}
                    required
                    min="0"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Batch Number *</Label>
                  <Input
                    value={editingProduct.batchNumber}
                    onChange={(e) => setEditingProduct({ ...editingProduct, batchNumber: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Expiry Date *</Label>
                  <Input
                    type="date"
                    value={new Date(editingProduct.expiryDate).toISOString().split('T')[0]}
                    onChange={(e) => setEditingProduct({ ...editingProduct, expiryDate: new Date(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Image URL *</Label>
                <Input
                  value={editingProduct.imageUrl}
                  onChange={(e) => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Low Stock Threshold</Label>
                <Input
                  type="number"
                  value={editingProduct.lowStockThreshold}
                  onChange={(e) => setEditingProduct({ ...editingProduct, lowStockThreshold: Number(e.target.value) })}
                  min="0"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="prescription"
                  checked={editingProduct.requiresPrescription}
                  onCheckedChange={(checked) =>
                    setEditingProduct({ ...editingProduct, requiresPrescription: checked === true })
                  }
                />
                <label htmlFor="prescription" className="text-sm cursor-pointer">
                  Requires Prescription
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  {editingProduct.id ? 'Update Product' : 'Add Product'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorDashboard;
