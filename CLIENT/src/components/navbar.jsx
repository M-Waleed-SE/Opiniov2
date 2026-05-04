import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaBars, FaPen, FaTimes, FaCog, FaUserCircle, FaMoon, FaSun } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../redux/authActions';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ isMenuOpen, setIsMenuOpen }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showCategoryMenu, setShowCategoryMenu] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showSearchInput, setShowSearchInput] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const menuRef = useRef(null);
    const profileRef = useRef(null);
    const searchInputRef = useRef(null);
    
    // Add 'all' to categories First
    const categories = [
      'all',
      'technology', 
      'health', 
      'business', 
      'lifestyle', 
      'travel', 
      'sports', 
      'entertainment'
    ];
    
    const { isLoggedIn, user } = useSelector(state => state.auth);
    
    // Check local storage for dark mode preference
    useEffect(() => {
      const isDark = localStorage.getItem('darkMode') === 'true';
      if (isDark || (!('darkMode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        setDarkMode(true);
        document.documentElement.classList.add('dark');
      } else {
        setDarkMode(false);
        document.documentElement.classList.remove('dark');
      }
    }, []);

    const toggleDarkMode = () => {
      if (darkMode) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('darkMode', 'false');
        setDarkMode(false);
      } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('darkMode', 'true');
        setDarkMode(true);
      }
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const toggleCategoryMenu = () => setShowCategoryMenu(!showCategoryMenu);
    const toggleProfileMenu = () => setShowProfileMenu(!showProfileMenu);
    const toggleSearchInput = () => setShowSearchInput(!showSearchInput);
    
    const handleSearch = (e) => {
      e.preventDefault();
      if(searchQuery.trim()) {
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        setShowSearchInput(false);
      }
    };
    
    const confirmLogout = () => {
      dispatch(logoutUser());
      setShowProfileMenu(false);
      navigate('/');
    };
    
    const handleLoginClick = () => navigate('/login');
    const handleRegister = () => navigate('/register');
    const handleWriteClick = () => navigate('/write');
    const handleSettingsClick = () => {
      setShowProfileMenu(false);
      navigate('/settings');
    }
    
    const handleCategoryClick = (category) => {
      if(category === 'all') {
        navigate(`/`);
      } else {
        navigate(`/category/${category}`);
      }
      setShowCategoryMenu(false);
      setIsMenuOpen(false);
    };
    
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) setShowCategoryMenu(false);
        if (profileRef.current && !profileRef.current.contains(event.target)) setShowProfileMenu(false);
        if (searchInputRef.current && !searchInputRef.current.contains(event.target)) setShowSearchInput(false);
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    const buttonStyle = "inline-block bg-[#268bd2] hover:bg-[#2aa198] dark:bg-[#bd93f9] dark:hover:bg-[#ff79c6] text-white font-medium rounded-full py-1.5 px-4 sm:px-5 cursor-pointer transition-all shadow-sm hover:shadow-md";
    const outlineButtonStyle = "inline-block bg-transparent hover:bg-[#eee8d5] dark:hover:bg-[#44475a] border-2 border-[#268bd2] dark:border-[#bd93f9] text-[#268bd2] dark:text-[#bd93f9] font-medium rounded-full py-1 px-4 sm:px-5 cursor-pointer transition-all";

    return (
      <>
        <div className="bg-[#fdf6e3]/90 dark:bg-[#21222c]/90 backdrop-blur-md h-[60px] sm:h-[70px] md:h-[80px] w-full fixed top-0 left-0 z-50 flex justify-between items-center px-4 sm:px-6 border-b border-[#eee8d5] dark:border-[#44475a] shadow-sm transition-colors duration-300">
          {/* Left section */}
          <div className="flex flex-row items-center gap-3 sm:gap-4">
            <button onClick={toggleSearchInput} className="text-[#073642] dark:text-[#8be9fd] hover:text-[#268bd2] dark:hover:text-[#bd93f9] transition-colors focus:outline-none">
              <FaSearch className="text-xl sm:text-2xl" />
            </button>
            <div className="relative" ref={menuRef}>
              <button onClick={toggleCategoryMenu} className="text-[#073642] dark:text-[#8be9fd] hover:text-[#268bd2] dark:hover:text-[#bd93f9] transition-colors focus:outline-none">
                <FaBars className="text-xl sm:text-2xl" />
              </button>
              
              <AnimatePresence>
                {showCategoryMenu && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-10 left-0 bg-[#fdf6e3] dark:bg-[#21222c] shadow-xl rounded-xl w-40 sm:w-48 py-2 z-50 border border-[#eee8d5] dark:border-[#44475a] overflow-hidden"
                  >
                    <h3 className="px-4 py-2 text-[#586e75] dark:text-[#6272a4] text-xs font-semibold border-b border-[#eee8d5] dark:border-[#44475a] select-none">CATEGORIES</h3>
                    {categories.map((category) => (
                      <div 
                        key={category}
                        className="px-4 py-2 text-[#073642] dark:text-[#f8f8f2] text-sm hover:bg-[#eee8d5] dark:hover:bg-[#44475a] cursor-pointer transition-colors"
                        onClick={() => handleCategoryClick(category)}
                      >
                        {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {/* Theme Toggle */}
            <button onClick={toggleDarkMode} className="text-[#073642] dark:text-[#8be9fd] hover:text-[#268bd2] dark:hover:text-[#bd93f9] transition-colors focus:outline-none ml-2">
              {darkMode ? <FaSun className="text-xl sm:text-2xl" /> : <FaMoon className="text-xl sm:text-2xl" />}
            </button>
          </div>
          
          {/* Center logo */}
          <Link to="/" className="flex items-center no-underline absolute left-1/2 transform -translate-x-1/2">
            <h1 className="text-[#268bd2] dark:text-[#bd93f9] text-xl md:text-3xl font-extrabold tracking-tight hover:scale-105 transition-transform duration-300">Opinio</h1>
          </Link>
          
          {/* Right section */}
          <div className="flex items-center gap-3">
              {isLoggedIn ? (
                <>
                  {user?.email !== 'admin@opinio.com' && (
                    <div onClick={handleWriteClick} className="hidden sm:flex items-center cursor-pointer text-[#073642] dark:text-[#8be9fd] hover:text-[#268bd2] dark:hover:text-[#bd93f9] transition-colors mr-2">
                      <FaPen className="mr-1.5" /> 
                      <span className="font-medium text-sm">Write</span>
                    </div>
                  )}
                  
                  <div className="relative" ref={profileRef}>
                    <button onClick={toggleProfileMenu} className="flex items-center focus:outline-none">
                      <FaUserCircle className="text-[#073642] dark:text-[#8be9fd] hover:text-[#268bd2] dark:hover:text-[#bd93f9] transition-colors text-2xl sm:text-3xl" />
                    </button>
                    
                    <AnimatePresence>
                      {showProfileMenu && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="absolute right-0 top-12 bg-[#fdf6e3] dark:bg-[#21222c] shadow-xl rounded-xl w-48 py-2 border border-[#eee8d5] dark:border-[#44475a] overflow-hidden"
                        >
                          <div className="px-4 py-3 border-b border-[#eee8d5] dark:border-[#44475a] mb-1">
                            <p className="text-sm font-semibold text-[#073642] dark:text-[#f8f8f2] truncate">Hello, {user?.username || 'User'}</p>
                          </div>
                          {user?.email !== 'admin@opinio.com' && (
                            <div onClick={handleWriteClick} className="sm:hidden px-4 py-2 text-sm text-[#073642] dark:text-[#f8f8f2] hover:bg-[#eee8d5] dark:hover:bg-[#44475a] cursor-pointer flex items-center">
                              <FaPen className="mr-2 text-[#268bd2]" /> Write
                            </div>
                          )}
                          {user?.email !== 'admin@opinio.com' && (
                            <div onClick={handleSettingsClick} className="px-4 py-2 text-sm text-[#073642] dark:text-[#f8f8f2] hover:bg-[#eee8d5] dark:hover:bg-[#44475a] cursor-pointer flex items-center">
                              <FaCog className="mr-2 text-[#586e75]" /> Settings
                            </div>
                          )}
                          {user?.email === 'admin@opinio.com' && (
                            <div onClick={() => { setShowProfileMenu(false); navigate('/admin'); }} className="px-4 py-2 text-sm text-[#073642] dark:text-[#f8f8f2] hover:bg-[#eee8d5] dark:hover:bg-[#44475a] cursor-pointer flex items-center">
                              <FaCog className="mr-2 text-[#268bd2]" /> Admin Dashboard
                            </div>
                          )}
                          <div onClick={confirmLogout} className="px-4 py-2 text-sm text-[#dc322f] dark:text-[#ff5555] hover:bg-[#eee8d5] dark:hover:bg-[#44475a] cursor-pointer flex items-center mt-1 border-t border-[#eee8d5] dark:border-[#44475a] pt-2 transition-colors">
                            Logout
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <>
                  <div className={outlineButtonStyle + " hidden sm:inline-block text-sm"} onClick={handleLoginClick}>
                    Login
                  </div>
                  <div className={buttonStyle + " text-sm"} onClick={handleRegister}>
                    Register
                  </div>
                </>
              )}
          </div>
        </div>
        
        {/* Search full width dropdown */}
        <AnimatePresence>
          {showSearchInput && (
            <motion.div 
              ref={searchInputRef}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-[60px] sm:top-[70px] md:top-[80px] left-0 w-full bg-[#fdf6e3] dark:bg-[#282a36] p-4 sm:p-6 z-40 shadow-lg border-b border-[#eee8d5] dark:border-[#44475a]"
            >
              <form onSubmit={handleSearch} className="flex justify-center max-w-3xl mx-auto">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title, author, or category..."
                  className="flex-grow p-3 rounded-l-xl bg-[#eee8d5] dark:bg-[#44475a] text-[#073642] dark:text-[#f8f8f2] border-0 focus:ring-2 focus:ring-[#268bd2] dark:focus:ring-[#bd93f9] transition-all font-medium"
                  autoFocus
                />
                <button type="submit" className="bg-[#268bd2] dark:bg-[#bd93f9] text-[#f8f8f2] dark:text-[#282a36] px-6 rounded-r-xl hover:bg-[#2aa198] dark:hover:bg-[#8be9fd] transition-colors font-semibold">
                  Search
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Mobile Full Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="fixed top-[60px] sm:top-[70px] md:top-[80px] left-0 w-full h-screen bg-[#fdf6e3]/95 dark:bg-[#282a36]/95 backdrop-blur-lg z-40 overflow-y-auto"
            >
              <div className="container mx-auto px-6 py-8">
                <div className="flex justify-between items-center mb-8 border-b border-[#eee8d5] dark:border-[#44475a] pb-4 dark:text-[#f8f8f2]">
                  <h2 className="text-2xl font-bold text-[#073642] dark:text-[#f8f8f2]">Menu</h2>
                  <FaTimes className="text-[#073642] dark:text-[#f8f8f2] text-2xl cursor-pointer hover:text-[#268bd2] dark:hover:text-[#bd93f9] transition-colors" onClick={toggleMenu} />
                </div>
              
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider">Categories</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {categories.map((category) => (
                      <div 
                        key={category}
                        className="py-2 text-base text-[#073642] dark:text-[#f8f8f2] hover:text-[#268bd2] dark:hover:text-[#bd93f9] cursor-pointer font-medium transition-colors"
                        onClick={() => handleCategoryClick(category)}
                      >
                        {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider">Quick Links</h3>
                  <div className="flex flex-col space-y-4">
                    <Link to="/" className="text-base text-[#073642] dark:text-[#f8f8f2] font-medium hover:text-[#268bd2] dark:hover:text-[#bd93f9] transition-colors" onClick={toggleMenu}>Home</Link>
                    {!isLoggedIn && (
                      <>
                        <Link to="/login" className="text-base text-[#073642] dark:text-[#f8f8f2] font-medium hover:text-[#268bd2] dark:hover:text-[#bd93f9] transition-colors" onClick={toggleMenu}>Login</Link>
                        <Link to="/register" className="text-base text-[#073642] dark:text-[#f8f8f2] font-medium hover:text-[#268bd2] dark:hover:text-[#bd93f9] transition-colors" onClick={toggleMenu}>Register</Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
};

export default Navbar;
