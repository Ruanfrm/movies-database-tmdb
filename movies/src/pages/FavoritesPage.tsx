import FavoritesList from "@/components/FavoritesList";

const FavoritesPage: React.FC = () => (
  
  <div className="container mx-auto p-6">
      
    <h1 className="text-3xl font-bold mb-4">Lista de Favoritos</h1>
    <FavoritesList />
  </div>
);

export default FavoritesPage;
