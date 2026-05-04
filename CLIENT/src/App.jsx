// 
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Layout from './components/layout';
import Home from './pages/home';
import ArticlePage from './pages/ArticlePage';
import Login from './pages/loginPage';
import Register from './pages/registerPage'
import { checkAuthState } from './redux/authActions';
import PostSlider from './components/slider';
import BasedOnCategory from './pages/BasedonCategory';
import WritePage from './pages/writePage';
import SettingsPage from './pages/settingsPage';
import EditArticle from './pages/editArticle';
import AdminDashboard from './pages/adminDashboard';

function App() {
  const dispatch = useDispatch();
  
  useEffect(() => {
    // Check if user is already logged in when app loads
    dispatch(checkAuthState());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/article/:id" element={<ArticlePage />} />
          <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          <Route path="/category/:category" element={<BasedOnCategory />} />
          <Route path="/write" element={<WritePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/edit/:articleId" element={<EditArticle />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
