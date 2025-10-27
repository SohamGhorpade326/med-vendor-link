import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pill, ShoppingCart, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuth();
  // Header.tsx
const { items } = useCart();
const itemCount = items.reduce((sum, it) => sum + (it.quantity || 0), 0);

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <Pill className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-primary">MediHub</h1>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground font-medium">{user.name}</span>
              <Badge variant="secondary" className="capitalize">
                {user.role}
              </Badge>
            </div>
          )}

          {user?.role === 'customer' && (
            <Button
              variant="outline"
              size="sm"
              className="relative"
              onClick={() => navigate('/cart')}
            >
              <ShoppingCart className="w-4 h-4" />
              {itemCount > 0 && (
                <Badge
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-primary"
                >
                  {itemCount}
                </Badge>
              )}
            </Button>
          )}

          {user && (
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          )}
          {user?.role === 'customer' && (
  <Button
    variant="outline"
    size="sm"
    className="mr-2"
    onClick={() => navigate('/orders')}
  >
    My Orders
  </Button>
)}

        </div>
      </div>
    </header>
  );
};

export default Header;
