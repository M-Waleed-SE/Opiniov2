import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaUpload, FaImage, FaLink } from "react-icons/fa";
import axios from "axios";

const WritePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState("Technology"); // Default category

  const navigate = useNavigate();
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  // Redirect if not logged in or if admin
  React.useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    } else if (user?.email === 'admin@opinio.com') {
      alert("Admins are not allowed to post articles.");
      navigate("/");
    }
  }, [isLoggedIn, user, navigate]);

  const handleImageUrlChange = (e) => {
    setImageUrl(e.target.value);
    setImagePreview(e.target.value); // Use URL as preview
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Please enter a title");
      return;
    }

    if (!content.trim()) {
      setError("Please enter some content");
      return;
    }

    if (!imageUrl) {
      setError("Please provide an image URL");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const blogData = {
        title,
        content,
        imageUrl,
        category, // Include the selected category
        email: user?.email,
      };

      const response = await axios.post(
        "https://opiniov2-production.up.railway.app/api/newBlog",
        blogData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        alert("Article published successfully!");
        navigate("/");
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.error ||
        "Failed to publish article. Please try again.";
      setError(errorMsg);
      console.error("Error:", error);
    } finally {
      setIsUploading(false);
    }
  };
  const categories = [
    "Technology",
    "Health",
    "Business",
    "Lifestyle",
    "Sports",
    "Entertainment",
  ];

  return (
    <div className="w-full max-w-6xl mx-auto mt-8 sm:mt-12 md:mt-16 lg:mt-24 p-4 sm:p-6 md:p-8 bg-[#fdf6e3] dark:bg-[#282a36] dark:text-[#f8f8f2] rounded-lg shadow-md border border-[#eee8d5] dark:border-[#44475a]">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 md:mb-10 text-[#268bd2] dark:text-[#bd93f9] text-center">
        Create New Article
      </h2>

      {error && (
        <div className="mb-4 sm:mb-6 p-3 bg-[#ffb86c]/20 text-[#dc322f] dark:bg-[#ff5555]/20 dark:text-[#ffb86c] rounded">
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Title Input */}
        <div className="mb-4 sm:mb-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter Title Here"
            className="w-full p-3 sm:p-4 text-lg sm:text-2xl font-bold border border-[#b58900] dark:border-[#6272a4] rounded-lg bg-[#fdf6e3] dark:bg-[#21222c] text-[#073642] dark:text-[#f8f8f2] focus:outline-none focus:ring-2 focus:ring-[#268bd2] dark:focus:ring-[#bd93f9] focus:border-transparent"
          />
        </div>
        {/* Category Dropdown */}
        <div className="mb-4 sm:mb-6">
          <label
            htmlFor="category"
            className="block text-sm sm:text-base font-medium text-[#268bd2] dark:text-[#8be9fd] mb-1"
          >
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 sm:p-4 border border-[#b58900] dark:border-[#6272a4] rounded-lg bg-[#fdf6e3] dark:bg-[#21222c] text-[#073642] dark:text-[#f8f8f2] focus:outline-none focus:ring-2 focus:ring-[#268bd2] dark:focus:ring-[#bd93f9] focus:border-transparent text-base sm:text-lg"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Image Upload Section */}
        <div className="mb-4 sm:mb-6 p-4 sm:p-6 border-2 border-dashed border-[#b58900] dark:border-[#6272a4] rounded-lg bg-[#fdf6e3]/50 dark:bg-[#21222c]/50">
          <div className="flex flex-col mb-4 gap-2">
            <h3 className="text-lg sm:text-xl font-semibold text-[#268bd2] dark:text-[#8be9fd]">
              Cover Image URL
            </h3>
          </div>

          <div className="mb-4">
            <input
              type="url"
              value={imageUrl}
              onChange={handleImageUrlChange}
              placeholder="Enter image URL"
              className="w-full p-3 sm:p-4 border border-[#b58900] dark:border-[#6272a4] rounded-lg bg-[#fdf6e3] dark:bg-[#21222c] text-[#073642] dark:text-[#f8f8f2] focus:outline-none focus:ring-2 focus:ring-[#268bd2] dark:focus:ring-[#bd93f9] focus:border-transparent"
            />
          </div>

          {imagePreview && (
            <div className="mt-4">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-32 sm:max-h-48 md:max-h-64 mx-auto rounded object-contain"
                onError={() => {
                  if (imageUrl) {
                    setError("Invalid image URL. Please provide a valid URL.");
                    setImagePreview(null);
                  }
                }}
              />
            </div>
          )}

          {!imagePreview && (
            <div className="flex flex-col items-center justify-center h-24 sm:h-32 md:h-40 bg-[#eee8d5] dark:bg-[#44475a] rounded">
              <FaImage className="text-[#268bd2] dark:text-[#8be9fd] text-3xl sm:text-4xl md:text-5xl mb-2" />
              <p className="text-[#073642] dark:text-[#f8f8f2] text-sm sm:text-base">
                No image selected
              </p>
            </div>
          )}
        </div>

        {/* Article Content */}
        <div className="mb-4 sm:mb-6">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your article here..."
            className="w-full p-3 sm:p-4 min-h-[200px] sm:min-h-[250px] md:min-h-[300px] border border-[#b58900] dark:border-[#6272a4] rounded-lg bg-[#fdf6e3] dark:bg-[#21222c] text-[#073642] dark:text-[#f8f8f2] focus:outline-none focus:ring-2 focus:ring-[#268bd2] dark:focus:ring-[#bd93f9] focus:border-transparent resize-y text-base sm:text-lg"
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isUploading}
          className="w-full py-3 sm:py-4 bg-[#268bd2] hover:bg-[#2aa198] dark:bg-[#bd93f9] dark:hover:bg-[#ff79c6] text-white text-base sm:text-lg font-semibold rounded-lg transition-colors disabled:bg-[#b58900] disabled:hover:bg-[#b58900] flex items-center justify-center"
        >
          {isUploading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-[#268bd2] dark:text-[#bd93f9]"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Publishing...
            </>
          ) : (
            "Publish Article"
          )}
        </button>
      </form>

      {/* Image Upload Instructions */}
      <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-[#eee8d5] dark:bg-[#44475a] rounded-lg">
        <h3 className="text-base sm:text-lg font-semibold text-[#268bd2] dark:text-[#bd93f9] mb-2">
          How to Add Images:
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:gap-4">
          <div>
            <h4 className="font-medium text-[#268bd2] dark:text-[#bd93f9] mb-1">
              Use an Image URL:
            </h4>
            <ol className="list-decimal list-inside text-sm sm:text-base text-[#073642] dark:text-[#f8f8f2]">
              <li>
                Paste a direct link to an image (must end with .jpg, .png, etc.) in the Cover Image URL input.
              </li>
              <li>
                The image will appear in the preview area if the URL is valid.
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WritePage;
