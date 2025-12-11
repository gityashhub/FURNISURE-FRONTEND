import { useState } from 'react';

interface ImageGalleryProps {
  images: string[];
  productName: string;
}

const ImageGallery = ({ images, productName }: ImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square rounded-xl overflow-hidden bg-card border shadow-lg">
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <span className="text-gray-400">No image available</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-square rounded-xl overflow-hidden bg-card border shadow-lg group">
        <img
          src={images[selectedImage]}
          alt={`${productName} - Image ${selectedImage + 1}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Thumbnail Images */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                selectedImage === index
                  ? 'border-[#bb9a65] ring-2 ring-[#bb9a65]/20'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img
                src={image}
                alt={`${productName} - Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
