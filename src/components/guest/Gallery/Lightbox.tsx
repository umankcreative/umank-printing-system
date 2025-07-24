import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Photo } from '../../../data/mockData';

interface LightboxProps {
  photos: Photo[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export const Lightbox = ({ photos, currentIndex, isOpen, onClose, onNavigate }: LightboxProps) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, currentIndex]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setIsLoading(true);
      onNavigate(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < photos.length - 1) {
      setIsLoading(true);
      onNavigate(currentIndex + 1);
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  if (!isOpen || !photos[currentIndex]) return null;

  const currentPhoto = photos[currentIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gallery-backdrop/95 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Content */}
      <div className="relative z-10 w-full h-full flex flex-col max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-white">
            <h2 className="text-xl font-semibold">{currentPhoto.title}</h2>
            <p className="text-sm opacity-75">{currentIndex + 1} dari {photos.length}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Image Container */}
        <div className="flex-1 flex items-center justify-center relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
          )}
          
          <img
            src={currentPhoto.imageUrl}
            alt={currentPhoto.title}
            className="max-w-full max-h-full object-contain rounded-lg"
            onLoad={handleImageLoad}
          />

          {/* Navigation Buttons */}
          {photos.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white bg-black/50 hover:bg-black/70 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={24} />
              </button>
              
              <button
                onClick={handleNext}
                disabled={currentIndex === photos.length - 1}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white bg-black/50 hover:bg-black/70 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
        </div>

        {/* Description */}
        {currentPhoto.description && (
          <div className="mt-4 text-center">
            <p className="text-white/90 max-w-2xl mx-auto">{currentPhoto.description}</p>
          </div>
        )}

        {/* Thumbnail Navigation */}
        {photos.length > 1 && (
          <div className="mt-6 flex justify-center gap-2 overflow-x-auto pb-2">
            {photos.map((photo, index) => (
              <button
                key={photo.id}
                onClick={() => {
                  setIsLoading(true);
                  onNavigate(index);
                }}
                className={`
                  flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all
                  ${index === currentIndex 
                    ? 'border-primary scale-110' 
                    : 'border-white/30 hover:border-white/60'
                  }
                `}
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};