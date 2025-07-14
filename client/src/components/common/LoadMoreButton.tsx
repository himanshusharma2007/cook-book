/**
 * LoadMoreButton component for loading additional recipes.
 * Used in Home page to fetch more recipes.
 */
interface LoadMoreButtonProps {
    loading: boolean;
    onLoadMore: () => void;
  }
  
  /**
   * LoadMoreButton component.
   * @param props - Component props.
   * @returns JSX.Element
   */
  const LoadMoreButton = ({ loading, onLoadMore }: LoadMoreButtonProps) => {
    return (
      <div className="flex space-x-2 items-center justify-center mt-8">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
        <button
          onClick={onLoadMore}
          className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold shadow hover:from-orange-600 hover:to-red-600 transition-all duration-200"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Load More'}
        </button>
      </div>
    );
  };
  
  export default LoadMoreButton;