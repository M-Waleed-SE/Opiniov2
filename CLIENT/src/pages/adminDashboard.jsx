import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Star, Trash2 } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.email !== 'admin@opinio.com') {
      navigate('/');
      return;
    }
    fetchData();
  }, [user, navigate, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'users') {
        const response = await axios.get('https://opiniov2-production.up.railway.app/api/admin/users', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setUsers(response.data);
      } else {
        const response = await axios.get('https://opiniov2-production.up.railway.app/api/admin/articles', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setArticles(response.data);
      }
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || `Failed to fetch ${activeTab}`);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async (userId, currentStatus) => {
    try {
      await axios.put(`https://opiniov2-production.up.railway.app/api/admin/users/${userId}/block`, {
        block: !currentStatus
      }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user status');
    }
  };

  const handleToggleFeature = async (articleId, currentStatus) => {
    try {
      await axios.put(`https://opiniov2-production.up.railway.app/api/admin/articles/${articleId}/feature`, {
        featured: !currentStatus
      }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update feature status');
    }
  };

  const handleDeleteArticle = async (articleId) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      try {
        await axios.delete(`https://opiniov2-production.up.railway.app/api/admin/articles/${articleId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        fetchData();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete article');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-20 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-[#073642] dark:text-[#f8f8f2]">Admin Dashboard</h1>
      
      {/* Tabs */}
      <div className="flex border-b border-[#eee8d5] dark:border-[#44475a] mb-6">
        <button
          className={`px-4 py-2 font-semibold ${activeTab === 'users' ? 'text-[#268bd2] border-b-2 border-[#268bd2]' : 'text-[#586e75] hover:text-[#268bd2] dark:hover:text-[#bd93f9]'}`}
          onClick={() => setActiveTab('users')}
        >
          Manage Users
        </button>
        <button
          className={`px-4 py-2 font-semibold ${activeTab === 'posts' ? 'text-[#268bd2] border-b-2 border-[#268bd2]' : 'text-[#586e75] hover:text-[#268bd2] dark:hover:text-[#bd93f9]'}`}
          onClick={() => setActiveTab('posts')}
        >
          Manage Posts
        </button>
      </div>

      {error && (
        <div className="bg-[#dc322f]/20 text-[#dc322f] dark:bg-[#ff5555]/20 dark:text-[#ffb86c] p-4 rounded mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#268bd2] dark:border-[#bd93f9]"></div>
        </div>
      ) : activeTab === 'users' ? (
        // Users Table
        <div className="bg-[#fdf6e3] dark:bg-[#282a36] shadow-md rounded-lg overflow-hidden border border-[#eee8d5] dark:border-[#44475a]">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#eee8d5] dark:divide-[#44475a]">
              <thead className="bg-[#eee8d5]/50 dark:bg-[#44475a]/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#586e75] dark:text-[#6272a4] uppercase tracking-wider">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#586e75] dark:text-[#6272a4] uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#586e75] dark:text-[#6272a4] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-[#586e75] dark:text-[#6272a4] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-transparent divide-y divide-[#eee8d5] dark:divide-[#44475a]">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-[#eee8d5]/30 dark:hover:bg-[#44475a]/30">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#073642] dark:text-[#f8f8f2]">{u.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#586e75] dark:text-[#8be9fd]">{u.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        u.isBlocked 
                          ? 'bg-[#dc322f]/20 text-[#dc322f] dark:bg-[#ff5555]/20 dark:text-[#ff5555]' 
                          : 'bg-[#859900]/20 text-[#859900] dark:bg-[#50fa7b]/20 dark:text-[#50fa7b]'
                      }`}>
                        {u.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleToggleBlock(u._id, u.isBlocked)}
                        className={`px-4 py-2 rounded text-white text-xs font-bold transition-colors ${
                          u.isBlocked 
                            ? 'bg-[#859900] hover:bg-[#738a00] dark:bg-[#50fa7b] dark:hover:bg-[#5af78e] dark:text-[#282a36]' 
                            : 'bg-[#dc322f] hover:bg-[#cb4b16] dark:bg-[#ff5555] dark:hover:bg-[#ff6e6e]'
                        }`}
                      >
                        {u.isBlocked ? 'Unblock' : 'Block'}
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr><td colSpan="4" className="px-6 py-4 text-center text-[#586e75] dark:text-[#6272a4]">No users found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        // Posts Table
        <div className="bg-[#fdf6e3] dark:bg-[#282a36] shadow-md rounded-lg overflow-hidden border border-[#eee8d5] dark:border-[#44475a]">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#eee8d5] dark:divide-[#44475a]">
              <thead className="bg-[#eee8d5]/50 dark:bg-[#44475a]/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#586e75] dark:text-[#6272a4] uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#586e75] dark:text-[#6272a4] uppercase tracking-wider">Author</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#586e75] dark:text-[#6272a4] uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#586e75] dark:text-[#6272a4] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-[#586e75] dark:text-[#6272a4] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-transparent divide-y divide-[#eee8d5] dark:divide-[#44475a]">
                {articles.map((a) => (
                  <tr key={a._id} className="hover:bg-[#eee8d5]/30 dark:hover:bg-[#44475a]/30">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#073642] dark:text-[#f8f8f2] max-w-[200px] truncate" title={a.heading}>{a.heading}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#586e75] dark:text-[#8be9fd]">{a.blogger?.username || 'Unknown'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#586e75] dark:text-[#8be9fd]">
                      {new Date(a.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {a.featured && (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-[#b58900]/20 text-[#b58900] dark:bg-[#f1fa8c]/20 dark:text-[#f1fa8c]">
                          Featured
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end space-x-2">
                      <button
                        onClick={() => handleToggleFeature(a._id, a.featured)}
                        className={`p-2 rounded transition-colors ${
                          a.featured 
                            ? 'bg-[#b58900] hover:bg-[#cb4b16] text-white' 
                            : 'bg-[#eee8d5] dark:bg-[#44475a] text-[#b58900] hover:bg-[#fdf6e3] dark:hover:bg-[#6272a4]'
                        }`}
                        title={a.featured ? "Unfeature" : "Feature"}
                      >
                        <Star size={16} className={a.featured ? "fill-white" : ""} />
                      </button>
                      <button
                        onClick={() => handleDeleteArticle(a._id)}
                        className="p-2 rounded bg-[#dc322f]/10 text-[#dc322f] hover:bg-[#dc322f] hover:text-white dark:bg-[#ff5555]/10 dark:text-[#ff5555] dark:hover:bg-[#ff5555] dark:hover:text-white transition-colors"
                        title="Delete Article"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {articles.length === 0 && (
                  <tr><td colSpan="5" className="px-6 py-4 text-center text-[#586e75] dark:text-[#6272a4]">No articles found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
