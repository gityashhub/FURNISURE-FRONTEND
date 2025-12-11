import { useState, useRef } from 'react';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/ProductCard';
import FilterSidebar from '@/components/FilterSidebar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Menu, X } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

const BrowseProducts = () => {
  const { products, loading } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedStorage, setSelectedStorage] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'beds', label: 'Beds' },
    { value: 'sofas', label: 'Sofas' },
    { value: 'recliners', label: 'Recliners' },
    { value: 'dining', label: 'Dining Sets' },
    { value: 'storage', label: 'Storage' },
    { value: 'chairs', label: 'Chairs' },
  ];

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.room_type.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesMaterial = selectedMaterials.length === 0 || selectedMaterials.includes(product.primary_material);
      const matchesStorage = selectedStorage.length === 0 || selectedStorage.includes(product.storage);
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];

      return matchesSearch && matchesCategory && matchesMaterial && matchesStorage && matchesBrand && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'rating': return b.product_rating - a.product_rating;
        default: return a.name.localeCompare(b.name);
      }
    });

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSortBy('name');
    setSelectedMaterials([]);
    setSelectedStorage([]);
    setSelectedBrands([]);
    setPriceRange([0, 100000]);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (selectedCategory !== 'all') count++;
    if (selectedMaterials.length > 0) count += selectedMaterials.length;
    if (selectedStorage.length > 0) count += selectedStorage.length;
    if (selectedBrands.length > 0) count += selectedBrands.length;
    if (priceRange[0] > 0 || priceRange[1] < 100000) count++;
    return count;
  };

  const filterProps = {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    selectedMaterials,
    setSelectedMaterials,
    selectedStorage,
    setSelectedStorage,
    selectedBrands,
    setSelectedBrands,
    priceRange,
    setPriceRange
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <span>Loading products...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background p-2">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative h-[30vh] sm:h-[40vh] flex items-center justify-center overflow-hidden rounded-2xl sm:rounded-3xl px-4 sm:px-6 lg:px-10 mb-6 sm:mb-8"
      >
        <motion.img
          style={{ y, scale: 1.1 }}
          src="/images/products-hero.jpg"
          alt="Products Hero"
          className="absolute w-full h-full object-cover"
        />
        <motion.div
          style={{ opacity }}
          className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/30"
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center text-white"
        >
          <motion.h1
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 font-domine"
          >
            Our Products
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base sm:text-xl md:text-2xl"
          >
            Explore our extensive collection
          </motion.p>
        </motion.div>
      </section>

      {/* Filter Toggle for Mobile */}
      <div className="lg:hidden flex justify-end px-4 mb-4">
        <Button variant="outline" onClick={() => setShowSidebar(true)}>
          <Menu className="w-4 h-4 mr-2" /> Filters
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 px-4 sm:px-6 lg:px-2 lg:pr-6">


        {/* Sidebar Drawer for Mobile */}
        {showSidebar && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden">
            <div className="absolute top-0 left-0 w-4/5 max-w-xs h-full bg-white p-4 shadow-lg overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Filters</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowSidebar(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <FilterSidebar {...filterProps} onClearFilters={() => {
                clearAllFilters();
                setShowSidebar(false);
              }} />
            </div>
          </div>
        )}

        {/* Sidebar Static for Desktop */}
        <div className="hidden lg:block w-80">
          <FilterSidebar {...filterProps} onClearFilters={clearAllFilters} />
        </div>

        {/* Main Content */}
        <div className="flex-1 pb-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4 bg-gradient-to-r from-[#bb9a65] to-[#bb9a65]/70 bg-clip-text text-transparent">
              Browse Products
            </h1>
            <p className="text-muted-foreground text-lg">
              Discover our complete collection of premium furniture pieces.
            </p>
          </div>

          {/* Results Summary */}
          <div className="mb-6 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center space-x-2">
              <span className="text-muted-foreground">
                Showing {filteredProducts.length} of {products.length} products
              </span>
              {getActiveFiltersCount() > 0 && (
                <Badge variant="secondary" className="bg-[#bb9a65]/10 text-[#bb9a65]">
                  {getActiveFiltersCount()} filters applied
                </Badge>
              )}
            </div>
          </div>

          {/* Active Filters */}
          {(selectedCategory !== 'all' || selectedMaterials.length > 0 || selectedStorage.length > 0 || selectedBrands.length > 0) && (
            <div className="mb-6 flex flex-wrap gap-2">
              {selectedCategory !== 'all' && (
                <Badge variant="outline" className="bg-background">
                  {categories.find(cat => cat.value === selectedCategory)?.label}
                </Badge>
              )}
              {selectedMaterials.map(material => (
                <Badge key={material} variant="outline" className="bg-background">
                  {material}
                </Badge>
              ))}
              {selectedStorage.map(storage => (
                <Badge key={storage} variant="outline" className="bg-background">
                  {storage}
                </Badge>
              ))}
              {selectedBrands.map(brand => (
                <Badge key={brand} variant="outline" className="bg-background">
                  {brand}
                </Badge>
              ))}
            </div>
          )}

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-card/50 backdrop-blur-sm rounded-xl p-8 border">
                <p className="text-xl text-muted-foreground mb-4">No products found</p>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or filters to find what you're looking for.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowseProducts;
