import React from 'react';
import { BrowserRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Contact from './pages/Contact';

import NotFound from './pages/NotFound';


import AiRecommendationPage from './pages/AiRecommendation/AIRecommendationPage';
import { AuthLayout } from './AuthModule/Layout/AuthLayout';
import AuthPage from './AuthModule/pages/AuthPage';
import CartSidebar from './components/CartSidebar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { CharacterServiceProvider } from './AuthModule/context/CharactersContext';


const ScrollToTop: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname, location.search, location.hash]);

  return null;
};




// the main layout , placeholder for the hole application , except the auth pages
export const MainLayout: React.FC = () => {
  return (
     <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartSidebar />
    </div>  
  );
};


const AppContent: React.FC = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/ai-recommendation" element={<AiRecommendationPage />} />
      </Route>


      <Route element={<AuthLayout />}>
        <Route path="/auth" element={<AuthPage />} />
      </Route>
      

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>

          <CharacterServiceProvider>
            <ScrollToTop />
            <AppContent />
          </CharacterServiceProvider>

        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
