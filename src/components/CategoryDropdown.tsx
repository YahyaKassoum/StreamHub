import { useState, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface Category {
  id: number;
  name: string;
}

interface CategoryDropdownProps {
  title: string;
  categories: Category[];
  mediaType: string;
  icon: React.ComponentType<{ className?: string }>; // Accepts an icon component
}

export default function CategoryDropdown({
  title,
  categories,
  mediaType,
  icon: Icon, // Destructure the icon prop
}: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const location = useLocation();

  // Helper to open the dropdown
  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  // Helper to close the dropdown with a delay
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 0);
  };

  return (
    <div className="relative">
      <button
        className="flex items-center gap-1 text-gray-300 hover:text-white"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Link
          to={mediaType}
          className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
        >
          <span
            className={`flex items-center gap-2 transition-colors ${
              location.pathname === "/" + mediaType
                ? 'text-red-600'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            {Icon && <Icon className="h-5 w-5" />}
            {title}
          </span>
        </Link>
        <ChevronDown className="h-4 w-4" />
      </button>
      {isOpen && (
        <div
          className="absolute overflow-y-scroll scrollbar-hide h-fit max-h-[500px] left-0 top-6 z-50 mt-2 w-48 rounded-lg bg-gray-800 py-2 shadow-xl"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/${mediaType==="movies"?"movie":"tv"}/categories/${category.id}`}
              className="block w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              
              {category.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
