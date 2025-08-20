import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

interface Image {
  id: string;
  url: string;
  type: string;
  uploadedAt: string;
}

interface ImageGalleryProps {
  images: Image[];
  title: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images, title }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openImage = (imageUrl: string) => {
    const index = images.findIndex(img => img.url === imageUrl);
    setCurrentIndex(index);
    setSelectedImage(imageUrl);
  };

  const closeImage = () => {
    setSelectedImage(null);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    let newIndex = currentIndex;
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
    } else {
      newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
    }
    setCurrentIndex(newIndex);
    setSelectedImage(images[newIndex].url);
  };

  if (images.length === 0) {
    return (
      <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
        <p className="text-slate-500">No images uploaded</p>
      </div>
    );
  }

  return (
    <div>
      <h4 className="font-medium text-slate-900 mb-3">{title}</h4>
      <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
        {images.map((image) => (
          <div key={image.id} className="relative group">
            <img
              src={image.url}
              alt={image.type}
              className="w-full h-20 object-cover rounded-lg border border-slate-200 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => openImage(image.url)}
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all rounded-lg flex items-center justify-center">
              <Eye className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
            </div>
            <div className="absolute bottom-1 left-1 right-1">
              <span className="text-xs bg-black bg-opacity-70 text-white px-1 py-0.5 rounded text-center block">
                {image.type}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <button
              onClick={closeImage}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <X size={24} />
            </button>
            
            <button
              onClick={() => navigateImage('prev')}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
            >
              <ChevronLeft size={32} />
            </button>
            
            <button
              onClick={() => navigateImage('next')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
            >
              <ChevronRight size={32} />
            </button>
            
            <img
              src={selectedImage}
              alt="Full size"
              className="max-w-full max-h-full object-contain"
            />
            
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-center">
              <p className="text-sm">{images[currentIndex].type}</p>
              <p className="text-xs text-gray-300">
                {currentIndex + 1} of {images.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};