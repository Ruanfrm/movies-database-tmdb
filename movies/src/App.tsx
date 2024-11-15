// App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Importando o que precisa para o roteamento
import { ThemeProvider } from "@/components/theme-provider"
import Home from './pages/Home';
import Details from './pages/Details';
import SearchResults from './pages/SearchResults';
import Header from './components/Header';
import Footer from './components/Footer';
import FavoritesPage from './pages/FavoritesPage';

const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/details/:type/:id" element={<Details />} /> {/* Rota para detalhes */}
          <Route path="/favorites" element={<FavoritesPage/>} /> {/* Rota para detalhes */}
        </Routes>
      </main>
      <Footer />
    </div>
    </ThemeProvider>

  );
};

export default App;
