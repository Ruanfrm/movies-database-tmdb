import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Menu, X } from "lucide-react"; // Para os ícones de hambúrguer

const Header: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Para o controle do menu responsivo
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${searchTerm}`);
      setSearchTerm(""); // Limpa o campo de busca
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };



  return (
    <header className="bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50 p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-xl font-bold"><Link to="/">Movie & Series App</Link></h1>

        {/* Ícone de hambúrguer para menu em telas menores */}
        <button
          className="md:hidden p-2"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Menu de navegação (oculto em telas menores) */}
        <nav className="hidden md:flex items-center space-x-4">
          <form onSubmit={handleSearch} className="flex space-x-2">
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar Filme ou Série..."
              className="p-2 rounded-md text-black border dark:text-zinc-100"
            />
            <Button type="submit" className="p-2 bg-cyan-300 text-zinc-950">
              Buscar
            </Button>
          </form>
          <Link to="/favorites" className="text-zinc-950 dark:text-zinc-50 hover:text-cyan-300">
            Favoritos
          </Link>
          <ModeToggle />
        </nav>
      </div>

      {/* Menu dropdown em telas menores */}
      {isMenuOpen && (
        <div className="md:hidden mt-2 space-y-2">
          <form onSubmit={handleSearch} className="flex space-x-2">
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar Filme ou Série..."
              className="p-2 rounded-md text-black border dark:text-zinc-100"
            />
            <Button type="submit" className="p-2 bg-cyan-300 text-zinc-950">
              Buscar
            </Button>
          </form>
          <Link
            to="/favorites"
            className="block text-zinc-950 dark:text-zinc-50 p-2 rounded-md hover:bg-cyan-300"
          >
            Favoritos
          </Link>
          <ModeToggle />
        </div>
      )}
    </header>
  );
};

export default Header;
