import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, Loader2, GripVertical } from 'lucide-react';
import api from '@/services/api';

interface ImageUploaderProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

const ImageUploader = ({ images, onImagesChange, maxImages = 5 }: ImageUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Upload image to backend
  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const url = response.data.url;

      // console.log('========url in new============================');
      // console.log(url);
      // console.log('====================================');
      // If the URL is already absolute, return as is
      if (/^https?:\/\//.test(url)) {
        return url;
      }
      // Otherwise, prepend backend base URL
      // const backendBaseUrl = 'http://localhost:5000';
      return  url;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > maxImages) {
      toast({
        title: "Too many images",
        description: `You can only upload up to ${maxImages} images.`,
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    const uploadPromises = Array.from(files).map(file => uploadImage(file));
    const uploadedUrls = await Promise.all(uploadPromises);

    const validUrls = uploadedUrls.filter(url => url !== null) as string[];
    
    if (validUrls.length > 0) {
      onImagesChange([...images, ...validUrls]);
      toast({
        title: "Images uploaded",
        description: `${validUrls.length} image(s) uploaded successfully.`,
      });
    }

    if (validUrls.length < files.length) {
      toast({
        title: "Some uploads failed",
        description: "Some images could not be uploaded. Please try again.",
        variant: "destructive",
      });
    }

    setUploading(false);
    
    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    
    // Remove from old position
    newImages.splice(draggedIndex, 1);
    
    // Insert at new position
    newImages.splice(index, 0, draggedImage);
    
    onImagesChange(newImages);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Product Images</label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || images.length >= maxImages}
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Upload className="h-4 w-4 mr-2" />
          )}
          Upload Images
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((imageUrl, index) => (
            <div
              key={index}
              className="relative group cursor-move"
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
            >
              <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-[#bb9a65] transition-colors">
                <img
                  src={imageUrl}
                  alt={`Product image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                {index + 1}
              </div>
              
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeImage(index)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>

              <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="h-4 w-4 text-white bg-black/50 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
          <p className="text-gray-500">No images uploaded yet</p>
          <p className="text-sm text-gray-400">Click "Upload Images" to add product photos</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
