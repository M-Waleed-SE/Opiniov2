import React from 'react';
import { Link } from 'react-router-dom';
import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  const handleSubscribe = (e) => {
    e.preventDefault();
    // Implement subscription logic here
    console.log("Email subscribed:", e.target.email.value);
    // Reset form or show success message
    e.target.reset();
  };

  return (
    <footer className="bg-[#268bd2] dark:bg-[#bd93f9] text-white dark:text-[#282a36] w-full pt-6 sm:pt-8 md:pt-10 pb-4 sm:pb-5 md:pb-6 mt-8 sm:mt-12 md:mt-20">
      {/* Main Footer Content */}
      <div className="container mx-auto px-3 sm:px-4 md:px-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {/* About Section */}
          <div className="mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 md:mb-4 text-white">Opinio</h2>
            <p className="text-xs sm:text-sm md:text-base text-white dark:text-[#f8f8f2] mb-3 sm:mb-4">
              Exploring ideas that matter through thoughtful discourse and analysis.
              Join our community of curious minds.
            </p>
            {/* Social Links */}
            <div className="flex space-x-3 sm:space-x-4">
              <a href="https://github.com/M-Waleed-SE" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-100 dark:text-[#f8f8f2] dark:hover:text-[#50fa7b] transition-colors">
                <FaGithub size={16} className="sm:text-lg md:text-xl" />
              </a>
              <a href="https://www.linkedin.com/in/m-waleed-se/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-100 dark:text-[#f8f8f2] dark:hover:text-[#50fa7b] transition-colors">
                <FaLinkedin size={16} className="sm:text-lg md:text-xl" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-3 md:mb-4 text-white dark:text-[#bd93f9]">Quick Links</h3>
            <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm md:text-base">
              <li>
                <Link to="/" className="text-white hover:text-gray-100 dark:text-[#f8f8f2] dark:hover:text-[#50fa7b] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/" className="text-white hover:text-gray-100 dark:text-[#f8f8f2] dark:hover:text-[#50fa7b] transition-colors">
                  All Articles
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Categories */}
          <div className="mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-3 md:mb-4 text-white dark:text-[#bd93f9]">Categories</h3>
            <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm md:text-base">
              <li><Link to="/category/technology" className="text-white hover:text-gray-100 dark:text-[#f8f8f2] dark:hover:text-[#50fa7b] transition-colors">Technology</Link></li>
              <li><Link to="/category/health" className="text-white hover:text-gray-100 dark:text-[#f8f8f2] dark:hover:text-[#50fa7b] transition-colors">Health</Link></li>
              <li><Link to="/category/business" className="text-white hover:text-gray-100 dark:text-[#f8f8f2] dark:hover:text-[#50fa7b] transition-colors">Business</Link></li>
            </ul>
          </div>
          
          {/* Newsletter Subscription */}
          <div className="mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-3 md:mb-4 text-white dark:text-[#bd93f9]">Subscribe</h3>
            <p className="text-xs sm:text-sm md:text-base text-white dark:text-[#f8f8f2] mb-2 sm:mb-3 md:mb-4">
              Stay updated with our latest articles and insights.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col">
              <div className="flex mb-2 gap-1 sm:gap-2">
                <input
                  type="email"
                  name="email"
                  placeholder="Your email address"
                  className="flex-1 p-2 sm:p-2.5 rounded-l bg-[#fdf6e3] dark:bg-[#282a36] text-[#073642] dark:text-[#f8f8f2] text-xs sm:text-sm md:text-base placeholder-[#b58900] dark:placeholder-[#6272a4] border border-[#b58900] dark:border-[#6272a4] focus:outline-none focus:ring-2 focus:ring-[#268bd2] dark:focus:ring-[#8be9fd]"
                  required
                />
                <button
                  type="submit"
                  className="bg-[#2aa198] hover:bg-[#859900] dark:bg-[#ff79c6] dark:hover:bg-[#50fa7b] text-white py-2 sm:py-2.5 px-2 sm:px-3 md:px-4 rounded-r transition-colors flex items-center cursor-pointer text-xs sm:text-sm md:text-base font-medium"
                >
                  <FaEnvelope className="mr-1 sm:mr-2 text-xs sm:text-sm" />
                  Join
                </button>
              </div>
              <p className="text-xs text-white dark:text-[#f8f8f2]">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </form>
          </div>
        </div>
      </div>
      
      <div className="border-t border-white/30 dark:border-[#44475a] mt-4 sm:mt-6 md:mt-8 pt-3 sm:pt-4 md:pt-6">
        <div className="container mx-auto px-3 sm:px-4 md:px-5 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white dark:text-[#f8f8f2] text-xs sm:text-sm md:text-base mb-2 md:mb-0 text-center md:text-left">
            &copy; {new Date().getFullYear()} Opinio. All rights reserved.
          </p>
          <div className="flex space-x-3 sm:space-x-4 md:space-x-6 text-center">
            <Link to="/" className="text-white hover:text-gray-100 dark:text-[#f8f8f2] dark:hover:text-[#50fa7b] text-xs sm:text-sm md:text-base transition-colors">
              Home
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
