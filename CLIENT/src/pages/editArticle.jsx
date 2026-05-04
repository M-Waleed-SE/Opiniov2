import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaSpinner, FaSave, FaTimes } from 'react-icons/fa';

const EditArticle = () => {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useSelector(state => state.auth);
  
  const [article, setArticle] = useState(null);
  const [heading, setHeading] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  const categories = [
    'Technology',
    'Health',
    'Business', 
    'Lifestyle',
    'Travel',
    'Sports',
    'Entertainment'
  ];
  
  // Redirect if not logged in or if admin
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    } else if (user?.email === 'admin@opinio.com') {
      alert("Admins cannot edit user articles.");
      navigate("/");
    }
  }, [isLoggedIn, user, navigate]);
  
  // Fetch article data
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`http://localhost:8000/api/articles/${articleId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        const responseText = await response.text();
        
        if (!response.ok) {
          const errorData = responseText ? JSON.parse(responseText) : {};
          throw new Error(errorData.message || 'Failed to fetch article');
        }

        const data = responseText ? JSON.parse(responseText) : {};
        
        if (!data.success) {
          throw new Error(data.message || 'Article not found');
        }
        
        setArticle(data);
        setHeading(data.heading || '');
        setContent(data.content || '');
        setCategory(data.category || '');
      } catch (err) {
        setError(err.message);
        console.error('Error fetching article:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (isLoggedIn && articleId) {
      fetchArticle();
    }
  }, [isLoggedIn, articleId]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!heading.trim() || !content.trim() || !category) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      const response = await fetch(`http://localhost:8000/api/articles/${articleId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          heading,
          content,
          category,
        }),
      });
      
      const responseText = await response.text();
      const data = responseText ? JSON.parse(responseText) : {};
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update article');
      }

      if (!data.success) {
        throw new Error(data.message || 'Update failed');
      }

      navigate('/settings');
    } catch (err) {
      setError(err.message);
      console.error('Error updating article:', err);
    } finally {
      setSaving(false);
    }
  };
  
  const handleCancel = () => {
    if (window.confirm('Are you sure you want to discard your changes?')) {
      navigate('/settings');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 mt-[80px] flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#268bd2] dark:border-[#bd93f9]"></div>
      </div>
    );
  }

  if (error && !loading) {
    return (
      <div className="container mx-auto px-4 py-8 mt-[80px]">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-700 hover:text-red-900"
            >
              <FaTimes />
            </button>
          </div>
        </div>
        <button
          onClick={() => navigate('/settings')}
          className="px-6 py-3 bg-[#268bd2] dark:bg-[#bd93f9] text-[#f8f8f2] rounded-md hover:bg-[#2aa198] dark:hover:bg-[#8be9fd] dark:text-[#282a36] transition-colors duration-200"
        >
          Back to Settings
        </button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 mt-[80px]">
      <div className="max-w-4xl mx-auto bg-[#fdf6e3] dark:bg-[#282a36] rounded-xl shadow-md overflow-hidden dark:text-[#f8f8f2]">
        <div className="bg-gradient-to-r from-[#268bd2] to-[#2aa198] dark:from-[#bd93f9] dark:to-[#ff79c6] p-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Edit Article</h1>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6">
              <div className="flex justify-between items-center">
                <p>{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="text-red-700 hover:text-red-900"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="heading" className="block text-[#073642] dark:text-[#bd93f9] font-medium mb-2">
                Title
              </label>
              <input
                type="text"
                id="heading"
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                className="w-full px-4 py-3 border border-[#b58900] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#268bd2] dark:focus:ring-[#bd93f9] focus:border-transparent dark:bg-[#21222c] dark:text-[#f8f8f2] text-[#073642] bg-[#fdf6e3] dark:border-[#6272a4]"
                placeholder="Enter article title"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="category" className="block text-[#073642] dark:text-[#bd93f9] font-medium mb-2">
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-[#b58900] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#268bd2] dark:focus:ring-[#bd93f9] focus:border-transparent dark:bg-[#21222c] dark:text-[#f8f8f2] text-[#073642] bg-[#fdf6e3] dark:border-[#6272a4]"
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-8">
              <label htmlFor="content" className="block text-[#073642] dark:text-[#bd93f9] font-medium mb-2">
                Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-3 border border-[#b58900] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#268bd2] dark:focus:ring-[#bd93f9] focus:border-transparent dark:bg-[#21222c] dark:text-[#f8f8f2] text-[#073642] bg-[#fdf6e3] dark:border-[#6272a4]"
                rows="12"
                placeholder="Write your article content here..."
                required
              ></textarea>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 border border-[#b58900] dark:border-[#6272a4] text-[#073642] dark:text-[#f8f8f2] rounded-lg hover:bg-[#eee8d5] dark:hover:bg-[#44475a] transition-colors duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-[#268bd2] hover:bg-[#2aa198] dark:bg-[#bd93f9] dark:hover:bg-[#ff79c6] text-white rounded-lg transition-colors duration-200 font-medium flex items-center"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditArticle;