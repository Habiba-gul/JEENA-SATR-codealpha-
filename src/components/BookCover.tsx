import React from 'react';
import { BookOpen, Bookmark, Award, Sparkles, Feather } from 'lucide-react';

interface BookCoverProps {
  title: string;
  author: string;
  coverColor: string;
  coverPattern: 'minimal' | 'lines' | 'circle' | 'wave' | 'floral';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  category?: string;
  image?: string;
  coverImages?: string[];
}

export default function BookCover({
  title,
  author,
  coverColor,
  coverPattern,
  size = 'md',
  category,
  image,
  coverImages,
}: BookCoverProps) {
  const [imageError, setImageError] = React.useState(false);
  const [activeIdx, setActiveIdx] = React.useState(0);

  // Determine if a custom image should be shown
  const categoryFolderMap: Record<string, string> = {
    'Urdu Novels': 'urdu novel',
    'English Novels': 'english novel',
    'Science Fiction': 'science fiction',
    'Motivational': 'motivational',
    'Funny Comics': 'comics'
  };

  const folderName = category ? categoryFolderMap[category] : '';
  const finalImageUrl = image || (folderName ? `/images/${folderName}/${title} (${author}).jpg` : undefined);
  
  const hasMultipleImages = coverImages && coverImages.length > 1;
  const showImageCover = (hasMultipleImages || finalImageUrl) && !imageError;

  // Auto-slide cover images if multiple are provided
  React.useEffect(() => {
    if (!hasMultipleImages) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % coverImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [coverImages, hasMultipleImages]);

  // Determine sizing classes
  const sizeClasses = {
    sm: 'w-24 h-36 text-[10px]',
    md: 'w-36 h-52 text-xs',
    lg: 'w-44 h-64 text-sm',
    xl: 'w-56 h-80 text-base',
  };

  // Select pattern overlay elements
  const renderPattern = () => {
    switch (coverPattern) {
      case 'lines':
        return (
          <div className="absolute inset-0 flex justify-between px-3 opacity-20 pointer-events-none">
            <div className="w-[1px] h-full bg-stone-100" />
            <div className="w-[1px] h-full bg-stone-100" />
            <div className="w-[1px] h-full bg-stone-100" />
            <div className="w-[2px] h-full bg-stone-100" />
            <div className="w-[1px] h-full bg-stone-100" />
          </div>
        );
      case 'circle':
        return (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-15">
            <div className="border border-stone-100 rounded-full w-24 h-24" />
            <div className="border border-stone-100 rounded-full w-32 h-32 absolute" />
            <div className="border-2 border-stone-100 rounded-full w-12 h-12 absolute border-dashed" />
          </div>
        );
      case 'wave':
        return (
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
            <svg className="w-full h-full text-stone-100" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,50 Q25,30 50,50 T100,50" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M0,60 Q25,40 50,60 T100,60" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M0,40 Q25,20 50,40 T100,40" fill="none" stroke="currentColor" strokeWidth="1" />
            </svg>
          </div>
        );
      case 'floral':
        return (
          <div className="absolute inset-4 border border-dashed border-stone-100/30 rounded flex flex-col justify-between p-2 pointer-events-none opacity-30">
            <div className="flex justify-between">
              <span className="text-[8px] text-stone-200">✤</span>
              <span className="text-[8px] text-stone-200">✤</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[8px] text-stone-200">✤</span>
              <span className="text-[8px] text-stone-200">✤</span>
            </div>
          </div>
        );
      case 'minimal':
      default:
        return (
          <div className="absolute inset-2 border border-stone-100/10 pointer-events-none" />
        );
    }
  };

  const isUrdu = /[\u0600-\u06FF]/.test(title);

  return (
    <div
      className={`relative ${sizeClasses[size]} ${coverColor} text-stone-100 rounded-r-md shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden flex flex-col justify-between ${showImageCover ? 'p-0' : 'p-4'} border-l-4 border-black/40`}
      style={{ boxShadow: '5px 5px 15px rgba(0,0,0,0.15), inset 3px 0 6px rgba(255,255,255,0.15)' }}
    >
      {/* Dynamic image cover if available */}
      {hasMultipleImages ? (
        coverImages.map((imgUrl, idx) => (
          <img 
            key={imgUrl}
            src={imgUrl} 
            alt={`${title} cover ${idx + 1}`}
            className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-700 ease-in-out ${idx === activeIdx ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onError={() => setImageError(true)}
          />
        ))
      ) : finalImageUrl ? (
        <img 
          src={finalImageUrl} 
          alt={title}
          className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-300 ${showImageCover ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onError={() => setImageError(true)}
        />
      ) : null}

      {/* Texture grain overlay */}
      <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none z-10" />

      {/* Book spine simulated shadow - always on top of image to look like a real book spine! */}
      <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-r from-black/45 to-transparent pointer-events-none z-20" />

      {/* Fallback procedural content, shown only if there is no image or the image fails to load */}
      {!showImageCover ? (
        <>
          {/* Elegant patterns */}
          {renderPattern()}

          {/* Book header */}
          <div className="flex justify-between items-center z-10 opacity-75">
            <span className="font-mono text-[9px] tracking-widest uppercase">Jeena Satr</span>
            {isUrdu ? (
              <Feather className="w-3.5 h-3.5" />
            ) : (
              <BookOpen className="w-3.5 h-3.5" />
            )}
          </div>

          {/* Title & Author Area */}
          <div className="my-auto z-10 flex flex-col justify-center items-center text-center px-1">
            <h3
              className={`font-serif tracking-tight leading-tight mb-2 text-stone-100 font-semibold ${
                isUrdu ? 'text-lg md:text-xl py-1 font-normal' : size === 'sm' ? 'text-[11px]' : 'text-sm md:text-base'
              }`}
              style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
            >
              {title}
            </h3>
            <div className="w-8 h-[1px] bg-stone-100/50 my-1" />
            <p className="font-serif italic text-stone-300 text-[10px] md:text-xs">
              {author}
            </p>
          </div>

          {/* Book footer / publisher tag */}
          <div className="flex justify-between items-center z-10 opacity-70 mt-auto pt-2 border-t border-stone-100/10">
            <span className="font-mono text-[8px] tracking-wider">LITERARY ED.</span>
            <span className="text-[9px]">★</span>
          </div>
        </>
      ) : (
        /* Render an invisible helper so we still have a minimum layout if needed, but the image cover is fully self-contained */
        <div className="absolute inset-0 w-full h-full pointer-events-none" />
      )}
    </div>
  );
}
