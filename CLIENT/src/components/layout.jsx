import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Navbar from './navbar';
import Footer from './footer';

const Layout = ({ children }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
      <div className="flex flex-col min-h-screen overflow-x-hidden bg-[#fdf6e3] dark:bg-[#282a36] text-[#073642] dark:text-[#f8f8f2] transition-colors duration-300">
        <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        
        <main className="flex-grow w-full mt-[60px] sm:mt-[70px] md:mt-[80px]">
          {children}
        </main>
        
        <div className="w-full">
          <Footer />
        </div>
      </div>
    );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
