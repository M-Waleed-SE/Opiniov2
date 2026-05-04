import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import axios from "axios";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./SliderStyles.css"; // Import custom styles for the slider

const PostSlider = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:8000/api/featured-posts");
        // The API already returns only featured posts, so no need to filter
        setPosts(res.data);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to load posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const settings = {
    dots: true,
    infinite: posts.length > 3,
    speed: 500,
    slidesToShow: Math.min(posts.length, 3),
    slidesToScroll: 1,
    autoplay: posts.length > 1,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: Math.min(posts.length, 2) },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: Math.min(posts.length, 1), arrows: false, dots: true },
      },
    ],
  };

  if (loading) {
    return (
      <div className="w-full mt-4 bg-[#fdf6e3] dark:bg-[#282a36] dark:text-[#f8f8f2] py-6 px-4 rounded-lg text-center">
        <p className="text-[#268bd2] dark:text-[#8be9fd] text-sm">Loading posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full mt-4 bg-red-50 py-6 px-4 rounded-lg text-center">
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="w-full mt-4 bg-yellow-50 py-6 px-4 rounded-lg text-center">
        <p className="text-yellow-700 text-sm">No featured posts available.</p>
      </div>
    );
  }

  return (
    <div className="w-full mt-6 mb-12 custom-slider">
      <div className="flex items-center justify-between mb-6 px-2 md:px-6">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#073642] dark:text-[#f8f8f2] tracking-tight">
          Featured <span className="text-[#268bd2] dark:text-[#bd93f9]">Stories</span>
        </h2>
      </div>
      <Slider {...settings}>
        {posts.map((post) => (
          <div key={post._id} className="px-2 md:px-4 h-72 md:h-[400px] focus:outline-none py-4">
            <div className="relative w-full h-full rounded-2xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-[#eee8d5] dark:bg-[#44475a]">
              <Link to={`/article/${post._id}`} className="block w-full h-full">
                <img
                  src={post.image || 'https://via.placeholder.com/800x400?text=No+Image'}
                  alt={post.heading}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-opacity duration-300"></div>
                
                <div className="absolute top-4 left-4 z-10">
                  <span className="inline-block px-3 py-1 bg-[#b58900] dark:bg-[#f1fa8c] text-white dark:text-[#282a36] text-xs font-bold rounded-full shadow-md uppercase tracking-wider">
                    Featured
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full z-10">
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-3 leading-snug drop-shadow-lg group-hover:text-[#8be9fd] transition-colors duration-300 line-clamp-2">
                    {post.heading}
                  </h3>
                  {post.content && (
                    <p className="text-gray-300 text-sm md:text-base line-clamp-2 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                      {post.content}
                    </p>
                  )}
                  <div className="mt-4 flex items-center text-[#8be9fd] text-sm font-semibold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    Read Article <span className="ml-2">→</span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default PostSlider;