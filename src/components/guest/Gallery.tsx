import { useState, useMemo } from 'react';
import { Photo } from '../../data/mockData';
import { PhotoCard } from './Gallery/PhotoCard';
import { CategoryFilter } from './Gallery/CategoryFilter';
import { Lightbox } from './Gallery/Lightbox';

 const photos: Photo[] = [
  {
    id: 1,
    title: "Pemandangan Gunung",
    category: "nature",
    imageUrl: "https://images.unsplash.com/photo-1466721591366-2d5fba72006d?auto=format&fit=crop&w=800&q=80",
    description: "Pemandangan indah hewan di alam liar"
  },
  {
    id: 2,
    title: "Laptop Modern",
    category: "technology",
    imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80",
    description: "Laptop dengan teknologi terdepan"
  },
  {
    id: 3,
    title: "Circuit Board",
    category: "technology",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    description: "Detail circuit board elektronik"
  },
  {
    id: 4,
    title: "Programming Code",
    category: "technology",
    imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80",
    description: "Monitor menampilkan kode Java"
  },
  {
    id: 5,
    title: "Workspace",
    category: "lifestyle",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
    description: "Ruang kerja yang nyaman dan produktif"
  },
  {
    id: 6,
    title: "Matrix Code",
    category: "technology",
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    description: "Tampilan kode matrix yang futuristik"
  },
  {
    id: 7,
    title: "Web Development",
    category: "technology",
    imageUrl: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=800&q=80",
    description: "Kode web berwarna-warni di monitor"
  },
  {
    id: 8,
    title: "Digital Display",
    category: "technology",
    imageUrl: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=800&q=80",
    description: "Tampilan layar digital modern"
  },
  {
    id: 9,
    title: "Team Meeting",
    category: "lifestyle",
    imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
    description: "Tim bekerja dengan laptop di meja"
  },
  {
    id: 10,
    title: "Innovation",
    category: "technology",
    imageUrl: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&w=800&q=80",
    description: "Lampu sebagai simbol inovasi"
  },
  {
    id: 11,
    title: "MacBook Setup",
    category: "technology",
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    description: "MacBook dengan setup coding"
  },
  {
    id: 12,
    title: "Cute Cat",
    category: "animals",
    imageUrl: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=800&q=80",
    description: "Kucing lucu yang sedang istirahat"
  },
  {
    id: 13,
    title: "Living Room",
    category: "lifestyle",
    imageUrl: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&w=800&q=80",
    description: "Ruang tamu yang nyaman dan modern"
  },
  {
    id: 14,
    title: "Wildlife Safari",
    category: "animals",
    imageUrl: "https://images.unsplash.com/photo-1466721591366-2d5fba72006d?auto=format&fit=crop&w=800&q=80",
    description: "Hewan liar di alam bebas"
  },
  {
    id: 15,
    title: "Mountain Ox",
    category: "animals",
    imageUrl: "https://images.unsplash.com/photo-1493962853295-0fd70327578a?auto=format&fit=crop&w=800&q=80",
    description: "Banteng di pegunungan"
  },
  {
    id: 16,
    title: "Kitten",
    category: "animals",
    imageUrl: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?auto=format&fit=crop&w=800&q=80",
    description: "Anak kucing yang menggemaskan"
  },
  {
    id: 17,
    title: "Flying Bees",
    category: "nature",
    imageUrl: "https://images.unsplash.com/photo-1498936178812-4b2e558d2937?auto=format&fit=crop&w=800&q=80",
    description: "Lebah yang sedang terbang"
  },
  {
    id: 18,
    title: "Whale Jump",
    category: "nature",
    imageUrl: "https://images.unsplash.com/photo-1518877593221-1f28583780b4?auto=format&fit=crop&w=800&q=80",
    description: "Paus yang sedang melompat"
  },
  {
    id: 19,
    title: "Forest Deer",
    category: "nature",
    imageUrl: "https://images.unsplash.com/photo-1439886183900-e79ec0057170?auto=format&fit=crop&w=800&q=80",
    description: "Rusa di dalam hutan"
  },
  {
    id: 20,
    title: "Forest Cattle",
    category: "nature",
    imageUrl: "https://images.unsplash.com/photo-1465379944081-7f47de8d74ac?auto=format&fit=crop&w=800&q=80",
    description: "Sapi di tengah hutan"
  }
];

const categories = [
  { id: 'all', name: 'Semua', count: 0 },
  { id: 'nature', name: 'Alam', count: 0 },
  { id: 'technology', name: 'Teknologi', count: 0 },
  { id: 'animals', name: 'Hewan', count: 0 },
  { id: 'lifestyle', name: 'Gaya Hidup', count: 0 }
];
// Update count for categories
categories.forEach(category => {
  if (category.id === 'all') {
    category.count = photos.length;
  } else {
    category.count = photos.filter(photo => photo.category === category.id).length;
  }
});

export const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const filteredPhotos = useMemo(() => {
    if (activeCategory === 'all') {
      return photos;
    }
    return photos.filter(photo => photo.category === activeCategory);
  }, [activeCategory]);

  const openLightbox = (photoIndex: number) => {
    setCurrentPhotoIndex(photoIndex);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const navigateInLightbox = (index: number) => {
    setCurrentPhotoIndex(index);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            Gallery Foto
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Jelajahi koleksi foto yang menakjubkan dari berbagai kategori. 
            Klik pada foto untuk melihat dalam mode slideshow.
          </p>
        </div>

        {/* Category Filter */}
        <CategoryFilter 
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredPhotos.map((photo, index) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              onClick={() => openLightbox(index)}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredPhotos.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📷</div>
            <h3 className="text-xl font-semibold mb-2">Tidak ada foto ditemukan</h3>
            <p className="text-muted-foreground">
              Coba pilih kategori lain untuk melihat foto-foto yang tersedia.
            </p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <Lightbox
        photos={filteredPhotos}
        currentIndex={currentPhotoIndex}
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        onNavigate={navigateInLightbox}
      />
    </div>
  );
};