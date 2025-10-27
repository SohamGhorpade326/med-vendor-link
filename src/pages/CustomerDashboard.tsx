// src/pages/CustomerDashboard.tsx
import { useState, useEffect, useMemo } from 'react';
import { Product } from '@/types';
import { productsAPI } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Search } from 'lucide-react';
import Header from '@/components/Header';

const CustomerDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // ✅ Use non-empty defaults to satisfy Radix Select
  const [filters, setFilters] = useState({
    brand: 'all',          // was ''
    maxPrice: '',          // keep as string if you type it from an <Input>
    prescription: 'all',   // was ''
    inStock: false,
    sort: 'default',       // was ''
  });

  const brands = useMemo(
    () => [...new Set(products.map(p => p.brand))].sort(),
    [products]
  );

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};

      if (searchQuery.trim()) params.q = searchQuery.trim();
      if (filters.brand !== 'all') params.brand = filters.brand;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.prescription !== 'all') params.prescription = filters.prescription;
      if (filters.inStock) params.inStock = 'true';
      if (filters.sort !== 'default') params.sort = filters.sort;

      const data = await productsAPI.getAll(params); // works after the api.ts change
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // If you want live refresh, keep this; otherwise remove the interval.
    const interval = setInterval(fetchProducts, 30000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, filters]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Browse Medicines</h1>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-card border rounded-lg p-4 space-y-4">
              <h3 className="font-semibold">Filters</h3>

              {/* Brand */}
              <div className="space-y-2">
                <Label>Brand</Label>
                <Select
                  value={filters.brand}
                  onValueChange={(v) => setFilters({ ...filters, brand: v })}
                >
                  <SelectTrigger><SelectValue placeholder="All Brands" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Brands</SelectItem>{/* ✅ not empty */}
                    {brands.map((b) => (
                      <SelectItem key={b} value={b}>{b}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Prescription Requirement */}
              <div className="space-y-2">
                <Label>Prescription</Label>
                <Select
                  value={filters.prescription}
                  onValueChange={(v) => setFilters({ ...filters, prescription: v })}
                >
                  <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="true">Rx Required</SelectItem>
                    <SelectItem value="false">OTC</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* In-Stock Only */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="instock"
                    checked={filters.inStock}
                    onCheckedChange={(c) => setFilters({ ...filters, inStock: c === true })}
                  />
                  <label htmlFor="instock" className="text-sm cursor-pointer">
                    In stock only
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Products + Top Bar */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search + Sort */}
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search medicines..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select
                value={filters.sort}
                onValueChange={(v) => setFilters({ ...filters, sort: v })}
              >
                <SelectTrigger className="w-48"><SelectValue placeholder="Sort" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>{/* ✅ not empty */}
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Product Grid */}
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No products found</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((p) => (
                  <ProductCard key={p._id || p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerDashboard;
