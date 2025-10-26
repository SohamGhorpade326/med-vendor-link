import { useState, useMemo } from 'react';
import { mockProducts } from '@/lib/mockData';
import ProductCard from '@/components/ProductCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Search } from 'lucide-react';
import Header from '@/components/Header';

const CustomerDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [showPrescriptionOnly, setShowPrescriptionOnly] = useState(false);
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'default' | 'price-low' | 'price-high'>('default');

  const brands = useMemo(() => {
    const uniqueBrands = [...new Set(mockProducts.map(p => p.brand))];
    return uniqueBrands.sort();
  }, []);

  const filteredProducts = useMemo(() => {
    let products = mockProducts.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           p.composition.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBrand = selectedBrand === 'all' || p.brand === selectedBrand;
      const matchesPrice = p.price <= maxPrice;
      const matchesPrescription = !showPrescriptionOnly || p.requiresPrescription;
      const matchesStock = !showInStockOnly || p.quantity > 0;

      return matchesSearch && matchesBrand && matchesPrice && matchesPrescription && matchesStock;
    });

    if (sortBy === 'price-low') {
      products = [...products].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      products = [...products].sort((a, b) => b.price - a.price);
    }

    return products;
  }, [searchQuery, selectedBrand, maxPrice, showPrescriptionOnly, showInStockOnly, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Browse Medicines</h1>
          <p className="text-muted-foreground">Find the medicines you need from trusted vendors</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-card border rounded-lg p-4 space-y-4">
              <h3 className="font-semibold text-foreground">Filters</h3>
              
              <div className="space-y-2">
                <Label>Brand</Label>
                <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Brands</SelectItem>
                    {brands.map(brand => (
                      <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Max Price: ₹{maxPrice}</Label>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="prescription"
                    checked={showPrescriptionOnly}
                    onCheckedChange={(checked) => setShowPrescriptionOnly(checked === true)}
                  />
                  <label htmlFor="prescription" className="text-sm cursor-pointer">
                    Prescription medicines only
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="instock"
                    checked={showInStockOnly}
                    onCheckedChange={(checked) => setShowInStockOnly(checked === true)}
                  />
                  <label htmlFor="instock" className="text-sm cursor-pointer">
                    In stock only
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search medicines, brands, or composition..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="text-sm text-muted-foreground">
              Showing {filteredProducts.length} of {mockProducts.length} products
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No products found matching your criteria</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerDashboard;
