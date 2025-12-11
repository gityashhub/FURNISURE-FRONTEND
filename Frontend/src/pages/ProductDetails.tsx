import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useUser } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Star, Package, Truck, Shield, Loader2 } from 'lucide-react';
import ImageGallery from '@/components/ImageGallery';
import SuggestedProducts from '@/components/SuggestedProducts';
import { motion } from 'framer-motion';
import { inventoryService } from '@/services/inventoryService';
import { Product } from '@/types/product';

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useUser();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSet, setSelectedSet] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const data = await inventoryService.getProductById(id);
        setProduct(data);
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: "Error",
          description: "Product not found",
          variant: "destructive",
        });
        navigate('/browse');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate, toast]);

  const handleAddToCart = () => {
    if (!product) return;

    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your cart.",
        variant: "destructive",
      });
      navigate('/auth', { state: { from: { pathname: `/product/${id}` } } });
      return;
    }

    addToCart(product, 1, selectedSet);

    toast({
      title: "Added to cart",
      description: `${product.name} ${selectedSet ? '(Complete Set)' : ''} has been added to your cart.`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading product...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">Product not found</p>
          </div>
        </div>
      </div>
    );
  }

  const currentPrice = selectedSet && product.set_price ? product.set_price : product.price;
  
  // Use images array if available, otherwise fallback to single image
  const productImages = product.images && product.images.length > 0 ? product.images : [product.image];

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 hover:bg-[#bb9a65]/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <ImageGallery images={productImages} productName={product.name} />
          </div>

          {/* Product Info */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                viewport={{ once: true }}
              >
              <Badge variant="secondary" className="mb-2 bg-[#bb9a65]/10 text-[#bb9a65]">
                {product.brand}
              </Badge>
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true }}
                className="text-3xl font-bold text-foreground mb-2"
              >
                {product.name}
              </motion.h1>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                viewport={{ once: true }}
                className="flex items-center space-x-2 mb-4"
              >
                <div className="flex items-center">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1 text-sm font-medium">{product.product_rating}</span>
                </div>
                <Badge variant="outline">{product.room_type}</Badge>
              </motion.div>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                viewport={{ once: true }}
                className="text-muted-foreground text-lg"
              >
                {product.description}
              </motion.p>
            </motion.div>

            {/* Set Option */}
            {product.has_set_option && product.set_price && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                viewport={{ once: true }}
              >
              <Card className="border-[#bb9a65]/20 bg-[#bb9a65]/5">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Complete Set Option</h3>
                      <p className="text-sm text-muted-foreground">
                        Save more by buying the complete set
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="setOption"
                        checked={selectedSet}
                        onChange={(e) => setSelectedSet(e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <label htmlFor="setOption" className="text-sm font-medium">
                        Complete Set
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>
              </motion.div>
            )}

            {/* Price & Actions */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold text-[#bb9a65]">
                  ₹{currentPrice.toLocaleString()}
                </span>
                {selectedSet && product.price && (
                  <span className="text-lg text-muted-foreground line-through">
                    ₹{product.price.toLocaleString()}
                  </span>
                )}
              </div>

              <div className="flex space-x-4">
                <Button onClick={handleAddToCart} size="lg" className="flex-1">
                  <Package className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </motion.div>

            {/* Product Specifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
              viewport={{ once: true }}
            >
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Product Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-muted-foreground">Dimensions (CM):</span>
                    <p>{product.dimensions_cm}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Dimensions (Inches):</span>
                    <p>{product.dimensions_inches}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Material:</span>
                    <p>{product.primary_material}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Assembly:</span>
                    <p>{product.assembly}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Weight:</span>
                    <p>{product.weight}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Storage:</span>
                    <p>{product.storage}</p>
                  </div>
                  {product.seating_height && (
                    <div>
                      <span className="font-medium text-muted-foreground">Seating Height:</span>
                      <p>{product.seating_height} inches</p>
                    </div>
                  )}
                  {product.recommended_mattress_size && (
                    <div>
                      <span className="font-medium text-muted-foreground">Recommended Mattress:</span>
                      <p>{product.recommended_mattress_size}</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 mr-1 text-green-600" />
                      <span>{product.warranty}</span>
                    </div>
                    <div className="flex items-center">
                      <Truck className="h-4 w-4 mr-1 text-blue-600" />
                      <span>Free Delivery</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            </motion.div>
          </motion.div>
        </div>

        {/* Suggested Products */}
        <SuggestedProducts 
          currentProductId={product.id}
          category={product.category}
          roomType={product.room_type}
        />
      </div>
    </div>
  );
};

export default ProductDetails;
