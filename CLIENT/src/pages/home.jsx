import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PostSlider from '../components/slider';
import axios from 'axios';

const Home = ({ category, searchQuery }) => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadMore, setLoadMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    // Reset pagination when search query or category changes
    setPage(1);
    setArticles([]);
    setLoadMore(false);
    setHasMore(true);
    fetchArticles(1, true);
  }, [searchQuery, category]);

  const fetchArticles = async (pageNum, reset = false) => {
    setLoading(true);
    
    try {
      let url = `http://localhost:8000/api/articles?page=${pageNum}&limit=6`;
      
      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      } else if (category) {
        url += `&category=${encodeURIComponent(category)}`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      const newArticles = response.data.articles || [];
      
      if (reset) {
        setArticles(newArticles);
      } else {
        setArticles(prev => [...prev, ...newArticles]);
      }

      // Check if there are more articles to load
      setHasMore(newArticles.length >= 6);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
      setLoadMore(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setLoadMore(true);
    setPage(nextPage);
    fetchArticles(nextPage);
  };
  
  const handleReadMore = (articleId) => {
    navigate(`/article/${articleId}`);
  };

  return (
    <div className="container mx-auto px-3 sm:px-4 md:px-5 pt-12 sm:pt-16 md:pt-24 min-h-screen">
      {/* Hero section */}
      <div className="my-3 sm:my-5 md:my-8">
        <h1 className="text-xl sm:text-2xl md:text-4xl font-bold text-[#268bd2] dark:text-[#bd93f9] text-center mb-2 sm:mb-3 md:mb-6">
          {searchQuery 
            ? `Search Results for "${searchQuery}"` 
            : category 
              ? `${category.charAt(0).toUpperCase() + category.slice(1)} Articles` 
              : 'Welcome to '}
        </h1>
        
        {category && !searchQuery && (
          <p className="text-xs sm:text-sm md:text-lg text-center text-gray-600 max-w-3xl mx-auto px-2">
            Explore our collection of thought-provoking articles about {category}.
          </p>
        )}
        
        {searchQuery && (
          <p className="text-xs sm:text-sm md:text-lg text-center text-[#073642] dark:text-[#f8f8f2] max-w-3xl mx-auto px-2">
            Showing articles matching your search for "{searchQuery}".
          </p>
        )}
      </div>
      
      {/* Featured posts slider */}
      {!searchQuery && (
        <div className="mb-4 sm:mb-6 md:mb-10">
          <PostSlider />
        </div>
      )}
      
      {/* Articles Section */}
      <div className="mb-6 sm:mb-8 md:mb-16">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#268bd2] dark:text-[#bd93f9] mb-3 sm:mb-4 md:mb-6">
          {searchQuery 
            ? 'Search Results' 
            : category 
              ? `${category.charAt(0).toUpperCase() + category.slice(1)} Articles` 
              : 'Featured Articles'}
        </h2>
        
        {loading && page === 1 ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#268bd2] dark:border-[#bd93f9]"></div>
          </div>
        ) : articles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
              {articles.map((article) => (
                <div key={article._id} className="bg-[#fdf6e3] dark:bg-[#282a36] rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 dark:text-[#f8f8f2]">
                  {article.image && (
                    <div className="h-40 bg-[#eee8d5] dark:bg-[#44475a] overflow-hidden">
                      <img 
                        src={article.image} 
                        alt={article.heading} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-3 sm:p-4">
                    <div className="flex items-center mb-2">
                      <span className="text-xs bg-[#eee8d5] dark:bg-[#44475a] text-[#268bd2] dark:text-[#bd93f9] px-2 py-0.5 rounded-full">
                        {article.category}
                      </span>
                    </div>
                    <h3 className="font-semibold text-[#268bd2] dark:text-[#bd93f9] mb-2">{article.heading}</h3>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                      {article.content.substring(0, 100)}...
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {Math.ceil(article.content.length / 1000)} min read
                      </span>
                      <button 
                        className="text-[#268bd2] dark:text-[#bd93f9] text-sm font-medium hover:text-[#2aa198] dark:hover:text-[#8be9fd]"
                        onClick={() => handleReadMore(article._id)}
                      >
                        Read More
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {hasMore && (
              <div className="flex justify-center mt-6">
                <button 
                  onClick={handleLoadMore}
                  className="bg-[#268bd2] dark:bg-[#bd93f9] hover:bg-[#2aa198] dark:hover:bg-[#8be9fd] text-[#f8f8f2] dark:text-[#282a36] font-medium py-2 px-4 rounded transition-colors"
                  disabled={loading || loadMore}
                >
                  {loading || loadMore ? (
                    <span className="flex items-center">
                      <span className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></span>
                      Loading...
                    </span>
                  ) : (
                    'Load More Articles'
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">No articles found. {searchQuery ? 'Try a different search term.' : 'Check back later for new articles.'}</p>
          </div>
        )}
      </div>
      
      {/* Community section */}
      {!searchQuery && (
        <div className="bg-[#fdf6e3] dark:bg-[#282a36] dark:text-[#f8f8f2] rounded-lg p-3 sm:p-5 md:p-8 mb-6 sm:mb-8 md:mb-16">
          <h2 className="text-lg sm:text-xl md:text-3xl font-bold text-[#268bd2] dark:text-[#bd93f9] text-center mb-3 sm:mb-4 md:mb-6">
            Join Our Community
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            <div className="bg-[#fdf6e3] dark:bg-[#21222c] p-3 sm:p-4 md:p-5 rounded-lg shadow-sm dark:text-[#f8f8f2]">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-[#268bd2] dark:text-[#bd93f9] mb-1 sm:mb-2">Write Articles</h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-2 sm:mb-3">
                Share your thoughts with our community.
              </p>
              <button className="text-[#268bd2] dark:text-[#bd93f9] font-medium text-xs sm:text-sm md:text-base hover:text-[#2aa198] dark:hover:text-[#8be9fd]\">
                Learn More →
              </button>
            </div>
            
            <div className="bg-[#fdf6e3] dark:bg-[#21222c] p-3 sm:p-4 md:p-5 rounded-lg shadow-sm dark:text-[#f8f8f2]">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-[#268bd2] dark:text-[#bd93f9] mb-1 sm:mb-2">Join Discussions</h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-2 sm:mb-3">
                Engage in thoughtful conversations.
              </p>
              <button className="text-[#268bd2] dark:text-[#bd93f9] font-medium text-xs sm:text-sm md:text-base hover:text-[#2aa198] dark:hover:text-[#8be9fd]\">
                Explore Forums →
              </button>
            </div>
            
            <div className="bg-[#fdf6e3] dark:bg-[#21222c] p-3 sm:p-4 md:p-5 rounded-lg shadow-sm sm:col-span-2 md:col-span-1 dark:text-[#f8f8f2]">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-[#268bd2] dark:text-[#bd93f9] mb-1 sm:mb-2">Subscribe</h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-2 sm:mb-3">
                Get the latest articles in your inbox.
              </p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="flex-1 p-1.5 sm:p-2 border border-[#268bd2] dark:border-[#bd93f9] rounded-l text-xs sm:text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-[#fdf6e3] dark:bg-[#21222c] dark:text-[#f8f8f2] text-[#073642] bg-[#fdf6e3]"
                />
                <button className="bg-[#268bd2] dark:bg-[#bd93f9] text-[#f8f8f2] dark:text-[#282a36] px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-r text-xs sm:text-sm md:text-base hover:bg-[#2aa198] dark:hover:bg-[#8be9fd]">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mt-4 sm:mt-6 md:mt-8">
            <button className="bg-[#268bd2] dark:bg-[#bd93f9] hover:bg-[#2aa198] dark:hover:bg-[#8be9fd] text-[#f8f8f2] dark:text-[#282a36] font-bold py-1.5 sm:py-2 md:py-3 px-3 sm:px-4 md:px-6 rounded text-xs sm:text-sm md:text-base transition-colors">
              Explore All Features
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;