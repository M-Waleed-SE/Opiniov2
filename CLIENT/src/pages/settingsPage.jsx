import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaEdit, FaTrash, FaSpinner, FaSave } from "react-icons/fa";
import axios from "axios";

const SettingsPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [deletingId, setDeletingId] = useState(null);


  const navigate = useNavigate();
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  const fetchArticles = async () => {
    try {
      if (!user?.email) return;

      setLoading(true);
      setError(null);

      const response = await axios.post(
        "https://opiniov2-production.up.railway.app/api/articles/user-by-email",
        { email: user.email },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Check if response is valid and contains articles
      if (response.data && response.data.articles) {
        setArticles(response.data.articles);
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to fetch articles"
      );
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn && user?.email) {
      fetchArticles();
    }
  }, [isLoggedIn, user]);

  const handleEditArticle = (articleId) => {
    navigate(`/edit/${articleId}`);
  };

  const handleDeleteArticle = async (article) => {
    if (!window.confirm("Are you sure you want to delete this article?")) {
      return;
    }

    try {
      setDeletingId(article._id);

      const response = await axios.delete(
        `https://opiniov2-production.up.railway.app/api/articles/${article._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        setArticles(articles.filter((item) => item._id !== article._id));
        setSuccess("Article deleted successfully");

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete article");

      // Clear error message after 3 seconds
      setTimeout(() => setError(null), 3000);
    } finally {
      setDeletingId(null);
    }
  };



  return (
    <div className="container mx-auto px-4 py-8 mt-[80px] bg-gradient-to-b from-[#fdf6e3] dark:from-[#282a36] dark:to-[#282a36] dark:text-[#f8f8f2] to-[#fdf6e3] shadow-lg rounded-lg">
      <h1 className="text-3xl md:text-4xl font-extrabold text-[#268bd2] dark:text-[#bd93f9] mb-8 text-center">
        Settings
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          {success}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#268bd2] dark:border-[#bd93f9]"></div>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold text-[#268bd2] dark:text-[#bd93f9] mb-6">
            My Articles
          </h2>
          {articles.length === 0 ? (
            <p className="text-gray-600 text-center">
              You haven't written any articles yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-[#fdf6e3] dark:bg-[#282a36] border border-[#268bd2] dark:border-[#bd93f9] rounded-lg shadow-md">
                <thead>
                  <tr className="bg-[#eee8d5] dark:bg-[#44475a]">
                    <th className="py-4 px-6 text-left text-sm font-semibold text-[#073642] dark:text-[#f8f8f2]">
                      Title
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-[#073642] dark:text-[#f8f8f2]">
                      Category
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-[#073642] dark:text-[#f8f8f2]">
                      Date
                    </th>

                    <th className="py-4 px-6 text-left text-sm font-semibold text-[#073642] dark:text-[#f8f8f2]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map((article) => (
                    <tr
                      key={article._id}
                      className="border-t border-[#eee8d5] dark:border-[#44475a] bg-[#fdf6e3] dark:bg-[#21222c] hover:bg-[#eee8d5] dark:hover:bg-[#44475a] dark:text-[#f8f8f2]"
                    >
                      <td className="py-4 px-6 text-sm text-[#073642] dark:text-[#f8f8f2]">
                        {article.heading}
                      </td>
                      <td className="py-4 px-6 text-sm text-[#073642] dark:text-[#f8f8f2]">
                        {article.category}
                      </td>
                      <td className="py-4 px-6 text-sm text-[#073642] dark:text-[#f8f8f2]">
                        {new Date(article.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-4 px-6 text-sm">
                        <div className="flex space-x-4">
                          <button
                            onClick={() => handleEditArticle(article._id)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit article"
                          >
                            <FaEdit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteArticle(article)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete article"
                            disabled={deletingId === article._id}
                          >
                            {deletingId === article._id ? (
                              <FaSpinner className="animate-spin" size={18} />
                            ) : (
                              <FaTrash size={18} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default SettingsPage;
