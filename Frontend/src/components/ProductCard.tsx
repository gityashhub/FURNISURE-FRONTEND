import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';
import { Product } from '@/types/product';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300 rounded-3xl shadow-lg">
      <Link to={`/product/${product.id}`}>
        <div className="aspect-square overflow-hidden rounded-t-lg">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <CardContent className="p-4">
          <div className="space-y-2">
            <Badge variant="secondary" className="text-xs">
              {product.brand}
            </Badge>
            <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {product.description}
            </p>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold">₹{product.price.toLocaleString()}</span>
              {product.set_price && (
                <span className="text-sm text-muted-foreground">
                  (Set: ₹{product.set_price.toLocaleString()})
                </span>
              )}
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-sm">⭐ {product.product_rating}</span>
              <span className="text-xs text-muted-foreground">• {product.room_type}</span>
            </div>
          </div>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-0 text-white">
        <Button onClick={handleAddToCart} className="w-full" size="sm">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
