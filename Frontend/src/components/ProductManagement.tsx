import { useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Star, Loader2 } from 'lucide-react';
import ImageUploader from '@/components/ImageUploader';

const ProductManagement = () => {
  const { products, loading, addProduct, updateProduct, deleteProduct } = useProducts();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [productImages, setProductImages] = useState<string[]>([]);

  const resetForm = () => {
    setFormData({});
    setEditingProduct(null);
    setIsAddDialogOpen(false);
    setProductImages([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData = {
      ...formData,
      image: productImages[0] || '', // Keep the first image as the main image for backward compatibility
      images: productImages
    };
    
    if (editingProduct) {
      const success = await updateProduct(editingProduct.id, productData);
      if (success) resetForm();
    } else {
      const success = await addProduct(productData as Omit<Product, 'id' | 'created_at' | 'updated_at'>);
      if (success) resetForm();
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(id);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData(product);
    // Set image URLs from the product's images array, or fallback to single image
    const existingImages = product.images && product.images.length > 0 ? product.images : [product.image];
    setProductImages(existingImages.filter(img => img)); // Filter out empty strings
    setIsAddDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Loading products...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Product Management</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="bg-white text-[#bb9a65] border-[#bb9a65] hover:bg-[#bb9a65]/10"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    value={formData.brand || ''}
                    onChange={(e) => setFormData({...formData, brand: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price || ''}
                    onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="set_price">Set Price (₹)</Label>
                  <Input
                    id="set_price"
                    type="number"
                    value={formData.set_price || ''}
                    onChange={(e) => setFormData({...formData, set_price: e.target.value ? parseFloat(e.target.value) : undefined})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category || ''} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beds">Beds</SelectItem>
                      <SelectItem value="sofas">Sofas</SelectItem>
                      <SelectItem value="chairs">Chairs</SelectItem>
                      <SelectItem value="office">Office</SelectItem>
                      <SelectItem value="dining">Dining</SelectItem>
                      <SelectItem value="storage">Storage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="room_type">Room Type</Label>
                  <Input
                    id="room_type"
                    value={formData.room_type || ''}
                    onChange={(e) => setFormData({...formData, room_type: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="product_rating">Rating (0-5)</Label>
                  <Input
                    id="product_rating"
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.product_rating || ''}
                    onChange={(e) => setFormData({...formData, product_rating: parseFloat(e.target.value)})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="weight">Weight</Label>
                  <Input
                    id="weight"
                    value={formData.weight || ''}
                    onChange={(e) => setFormData({...formData, weight: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              {/* Image Upload Component */}
              <div className="col-span-full">
                <ImageUploader
                  images={productImages}
                  onImagesChange={setProductImages}
                  maxImages={5}
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dimensions_cm">Dimensions (CM)</Label>
                  <Input
                    id="dimensions_cm"
                    value={formData.dimensions_cm || ''}
                    onChange={(e) => setFormData({...formData, dimensions_cm: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="dimensions_inches">Dimensions (Inches)</Label>
                  <Input
                    id="dimensions_inches"
                    value={formData.dimensions_inches || ''}
                    onChange={(e) => setFormData({...formData, dimensions_inches: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="primary_material">Primary Material</Label>
                  <Input
                    id="primary_material"
                    value={formData.primary_material || ''}
                    onChange={(e) => setFormData({...formData, primary_material: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="assembly">Assembly</Label>
                  <Input
                    id="assembly"
                    value={formData.assembly || ''}
                    onChange={(e) => setFormData({...formData, assembly: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="storage">Storage</Label>
                  <Input
                    id="storage"
                    value={formData.storage || ''}
                    onChange={(e) => setFormData({...formData, storage: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="warranty">Warranty</Label>
                  <Input
                    id="warranty"
                    value={formData.warranty || ''}
                    onChange={(e) => setFormData({...formData, warranty: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="seating_height">Seating Height (inches)</Label>
                  <Input
                    id="seating_height"
                    type="number"
                    value={formData.seating_height || ''}
                    onChange={(e) => setFormData({...formData, seating_height: e.target.value ? parseInt(e.target.value) : undefined})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="recommended_mattress_size">Recommended Mattress Size</Label>
                  <Input
                    id="recommended_mattress_size"
                    value={formData.recommended_mattress_size || ''}
                    onChange={(e) => setFormData({...formData, recommended_mattress_size: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="has_set_option"
                  checked={formData.has_set_option || false}
                  onCheckedChange={(checked) => setFormData({...formData, has_set_option: checked as boolean})}
                />
                <Label htmlFor="has_set_option">Has Set Option</Label>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Products ({products.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.brand}</TableCell>
                    <TableCell>₹{product.price.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        {product.product_rating}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductManagement;
