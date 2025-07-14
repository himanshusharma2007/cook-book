/**
 * SearchBar component for recipe search and filter functionality.
 * Used in Home page to search recipes and switch between all/my recipes.
 */
import { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';

/**
 * Props for SearchBar component.
 */
interface SearchBarProps {
  searchTerm: string;
  activeFilter: string;
  onSearch: (term: string, filter: string) => void;
}

/**
 * SearchBar component.
 * @param props - Component props.
 * @returns JSX.Element
 */
const SearchBar = ({ searchTerm, activeFilter, onSearch }: SearchBarProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getFilterOptions = () => [
    { value: 'all', label: 'All Recipes' },
    { value: 'my', label: 'My Recipes' },
  ];

  const getCurrentFilterLabel = () => {
    const option = getFilterOptions().find(opt => opt.value === activeFilter);
    return option ? option.label : 'All Recipes';
  };

  const handleFilterChange = (filter: string) => {
    setIsDropdownOpen(false);
    onSearch('', filter);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4">
      <div className="bg-white shadow-2xl backdrop-blur-sm bg-opacity-95 rounded-xl">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center p-3 md:p-0">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search any recipe..."
              value={searchTerm}
              onChange={e => onSearch(e.target.value, activeFilter)}
              className="w-full pl-12 pr-4 py-4 border border-gray-200 focus:outline-none focus:border-transparent text-gray-700 placeholder-gray-400 rounded-xl"
            />
          </div>
          <div className="relative w-full md:w-auto">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-between gap-2 w-full md:w-auto px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 min-w-[140px]"
            >
              <span className="font-medium">{getCurrentFilterLabel()}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-full bg-white shadow-lg border border-gray-200 overflow-hidden z-50 rounded-xl">
                {getFilterOptions().map(option => (
                  <button
                    key={option.value}
                    onClick={() => handleFilterChange(option.value)}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 ${
                      activeFilter === option.value
                        ? 'bg-orange-50 text-orange-600 font-medium'
                        : 'text-gray-700'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
