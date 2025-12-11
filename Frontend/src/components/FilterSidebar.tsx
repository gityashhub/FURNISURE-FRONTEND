
import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface FilterSidebarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  selectedMaterials: string[];
  setSelectedMaterials: (materials: string[]) => void;
  selectedStorage: string[];
  setSelectedStorage: (storage: string[]) => void;
  selectedBrands: string[];
  setSelectedBrands: (brands: string[]) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  onClearFilters: () => void;
}

const FilterSidebar = ({
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
  setPriceRange,
  onClearFilters
}: FilterSidebarProps) => {
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'beds', label: 'Beds' },
    { value: 'sofas', label: 'Sofas' },
    { value: 'recliner', label: 'Recliners' },
    { value: 'dining', label: 'Dining Sets' },
    { value: 'storage', label: 'Storage' },
    { value: 'chairs', label: 'Chairs' },
  ];

  const materials = [
    'Engineered Wood',
    'Solid Wood',
    'Metal',
    'Plastic',
    'Fabric',
    'Leather',
    'Glass',
    'Premium Leather',
    'Fabric & Solid Wood'
  ];

  const storageOptions = [
    'No Storage',
    'Yes - Under bed storage',
    'Drawer Storage',
    'Open Storage',
    'Cabinet Storage'
  ];

  const brands = [
    'Crystal Furnitech',
    'ErgoMax',
    'ComfortPlus',
    'Urban Ladder',
    'IKEA',
    'Godrej',
    'Durian'
  ];

  const handleMaterialChange = (material: string, checked: boolean) => {
    if (checked) {
      setSelectedMaterials([...selectedMaterials, material]);
    } else {
      setSelectedMaterials(selectedMaterials.filter(m => m !== material));
    }
  };

  const handleStorageChange = (storage: string, checked: boolean) => {
    if (checked) {
      setSelectedStorage([...selectedStorage, storage]);
    } else {
      setSelectedStorage(selectedStorage.filter(s => s !== storage));
    }
  };

  const handleBrandChange = (brand: string, checked: boolean) => {
    if (checked) {
      setSelectedBrands([...selectedBrands, brand]);
    } else {
      setSelectedBrands(selectedBrands.filter(b => b !== brand));
    }
  };

  return (
    <div className="w-80 h-full bg-card border-r border-border p-6 overflow-y-auto">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Filters</h2>
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        </div>

        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Search Products</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              id="search"
              placeholder="Search by name, brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Separator />

        {/* Categories */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Category</Label>
          <RadioGroup value={selectedCategory} onValueChange={setSelectedCategory}>
            {categories.map((category) => (
              <div key={category.value} className="flex items-center space-x-2">
                <RadioGroupItem value={category.value} id={category.value} />
                <Label htmlFor={category.value} className="text-sm font-normal cursor-pointer">
                  {category.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <Separator />

        {/* Accordion for collapsible sections */}
        <Accordion type="multiple" defaultValue={["materials", "storage", "brands", "price", "sort"]} className="w-full">
          {/* Material Type */}
          <AccordionItem value="materials">
            <AccordionTrigger className="text-sm font-medium">Material Type</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {materials.map((material) => (
                  <div key={material} className="flex items-center space-x-2">
                    <Checkbox
                      id={material}
                      checked={selectedMaterials.includes(material)}
                      onCheckedChange={(checked) => handleMaterialChange(material, checked as boolean)}
                    />
                    <Label htmlFor={material} className="text-sm font-normal cursor-pointer">
                      {material}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Storage Options */}
          <AccordionItem value="storage">
            <AccordionTrigger className="text-sm font-medium">Storage</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {storageOptions.map((storage) => (
                  <div key={storage} className="flex items-center space-x-2">
                    <Checkbox
                      id={storage}
                      checked={selectedStorage.includes(storage)}
                      onCheckedChange={(checked) => handleStorageChange(storage, checked as boolean)}
                    />
                    <Label htmlFor={storage} className="text-sm font-normal cursor-pointer">
                      {storage}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Brands */}
          <AccordionItem value="brands">
            <AccordionTrigger className="text-sm font-medium">Brands</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {brands.map((brand) => (
                  <div key={brand} className="flex items-center space-x-2">
                    <Checkbox
                      id={brand}
                      checked={selectedBrands.includes(brand)}
                      onCheckedChange={(checked) => handleBrandChange(brand, checked as boolean)}
                    />
                    <Label htmlFor={brand} className="text-sm font-normal cursor-pointer">
                      {brand}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Price Range */}
          <AccordionItem value="price">
            <AccordionTrigger className="text-sm font-medium">Price Range</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={priceRange[0] || ''}
                    onChange={(e) => setPriceRange([Number(e.target.value) || 0, priceRange[1]])}
                    className="flex-1"
                  />
                  <span className="text-muted-foreground">to</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={priceRange[1] || ''}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value) || 100000])}
                    className="flex-1"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setPriceRange([0, 25000])}
                  >
                    Under ₹25K
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setPriceRange([25000, 50000])}
                  >
                    ₹25K - ₹50K
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setPriceRange([50000, 100000])}
                  >
                    Above ₹50K
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Sort Options */}
          <AccordionItem value="sort">
            <AccordionTrigger className="text-sm font-medium">Sort By</AccordionTrigger>
            <AccordionContent>
              <RadioGroup value={sortBy} onValueChange={setSortBy}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="name" id="sort-name" />
                  <Label htmlFor="sort-name" className="text-sm font-normal cursor-pointer">
                    Name (A-Z)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="price-low" id="sort-price-low" />
                  <Label htmlFor="sort-price-low" className="text-sm font-normal cursor-pointer">
                    Price (Low to High)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="price-high" id="sort-price-high" />
                  <Label htmlFor="sort-price-high" className="text-sm font-normal cursor-pointer">
                    Price (High to Low)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="rating" id="sort-rating" />
                  <Label htmlFor="sort-rating" className="text-sm font-normal cursor-pointer">
                    Rating (High to Low)
                  </Label>
                </div>
              </RadioGroup>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default FilterSidebar;
