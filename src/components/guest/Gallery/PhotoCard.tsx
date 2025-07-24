
import { Photo } from '../../../data/mockData';

interface PhotoCardProps {
  photo: Photo;
  onClick: () => void;
}

export const PhotoCard = ({ photo, onClick }: PhotoCardProps) => {
  return (
    <div 
      className="group relative cursor-pointer overflow-hidden rounded-xl bg-gradient-card shadow-card transition-all duration-300 hover:shadow-hover hover:scale-[1.02]"
      onClick={onClick}
    >
      <div className="aspect-square overflow-hidden">
        <img
          src={photo.imageUrl}
          alt={photo.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gallery-overlay/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <h3 className="font-semibold text-lg mb-1 line-clamp-1">{photo.title}</h3>
        {photo.description && (
          <p className="text-sm opacity-90 line-clamp-2">{photo.description}</p>
        )}
      </div>

      {/* Category badge */}
      <div className="absolute top-3 right-3 px-2 py-1 bg-primary/90 backdrop-blur-sm text-primary-foreground text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {photo.category}
      </div>
    </div>
  );
};