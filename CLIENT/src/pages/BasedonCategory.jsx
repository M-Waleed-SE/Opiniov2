import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Card from '../components/card'; // Assumes you have a reusable <Card> component

const BasedOnCategory = () => {
  const { category } = useParams();
  const [articles, setArticles] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Capitalize the first letter of category
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  const formattedCategory = capitalize(category);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      setError(null);
      setVisibleCount(6); // Reset visible count on category change

      try {
        const res = await axios.get(`http://localhost:8000/api/articles?category=${formattedCategory}`);
        setArticles(res.data.articles || []);
      } catch (err) {
        console.error(`Error fetching articles for category "${formattedCategory}":`, err);
        setError('Failed to load articles. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [formattedCategory]);

  const handleLoadMore = () => {
    const increment = window.innerWidth < 640 ? 3 : 6;
    setVisibleCount(prev => prev + increment);
  };

  const hasMore = visibleCount < articles.length;

  return (
    <div className="container mx-auto px-4 py-10">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-[#268bd2] dark:text-[#8be9fd] mb-6">
        {formattedCategory} Articles
      </h2>

      {loading && (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#268bd2] dark:border-[#8be9fd] mx-auto mb-2" />
          <p className="text-[#268bd2] dark:text-[#8be9fd]">Loading articles...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-10 bg-[#ffb86c]/20 text-[#dc322f] dark:bg-[#ff5555]/20 dark:text-[#ffb86c] rounded-lg px-4">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && articles.length === 0 && (
        <div className="text-center py-10 text-[#268bd2] dark:text-[#8be9fd]">
          <p>No articles found in the "{formattedCategory}" category.</p>
        </div>
      )}

      {!loading && !error && articles.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {articles.slice(0, visibleCount).map(article => (
              <Card
                key={article._id}
                id={article._id}
                title={article.title || article.heading}
                description={article.excerpt || article.content?.substring(0, 120)}
                photo={article.photo || article.image}
              />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleLoadMore}
                className="bg-[#268bd2] hover:bg-[#2aa198] dark:bg-[#bd93f9] dark:hover:bg-[#ff79c6] text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BasedOnCategory;
