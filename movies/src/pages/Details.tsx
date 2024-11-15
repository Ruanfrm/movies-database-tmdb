import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { Button } from "@/components/ui/button"; // Usando o botão do ShadCN
import { toast } from "sonner";

const Details: React.FC = () => {
  const { id, type } = useParams<{ id: string; type: string }>();
  const [itemDetails, setItemDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const endpoint = type === "movie" ? `movie/${id}` : `tv/${id}`;
        const response = await api.get(endpoint);
        setItemDetails(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar detalhes:", error);
        setError("Erro ao carregar os detalhes. Tente novamente mais tarde.");
        setLoading(false);
      }
    };

    if (id && type) {
      fetchItemDetails();
    }
  }, [id, type]);

  const handleBackClick = () => {
    navigate("/");
  };

  const handleWatchClick = () => {
    setIsVideoVisible(true);
  };

  // Função de compartilhamento
  const handleShareClick = async () => {
    const shareData = {
      title: itemDetails.title || itemDetails.name,
      text: "Confira este conteúdo que encontrei!",
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        console.log("Conteúdo compartilhado com sucesso!");
      } catch (error) {
        console.error("Erro ao compartilhar:", error);
      }
    } else {
      navigator.clipboard.writeText(shareData.url).then(() => {
        toast.success("Link copiado para a área de transferência!");
      });
    }
  };

  // Função de favoritar
  const handleFavoriteClick = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

    const isAlreadyFavorited = favorites.some(
      (fav: any) => fav.id === itemDetails.id && fav.type === type
    );

    if (isAlreadyFavorited) {
      toast.error("Este item já está nos favoritos!");
    } else {
      const newFavorite = {
        id: itemDetails.id,
        title: itemDetails.title || itemDetails.name,
        type,
        poster_path: itemDetails.poster_path,
        overview: itemDetails.overview,
      };

      favorites.push(newFavorite);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      toast.success("Item adicionado aos favoritos!");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold">Carregando...</div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  if (!itemDetails) {
    return <div>Detalhes não encontrados.</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <Button onClick={handleBackClick} variant="outline" className="mb-4">
        Voltar
      </Button>

      <div className="flex flex-col md:flex-row items-center">
        <img
          src={
            itemDetails.poster_path
              ? `https://image.tmdb.org/t/p/w500${itemDetails.poster_path}`
              : "imagem-padrao.jpg"
          }
          alt={itemDetails.title || itemDetails.name}
          className="w-48 md:w-72 rounded-lg shadow-lg"
        />
        <div className="ml-6 mt-4 md:mt-0">
          <h1 className="text-4xl font-bold text-zinc-800 dark:text-zinc-200">
            {itemDetails.title || itemDetails.name}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-300 mt-2">
            {itemDetails.overview}
          </p>
          <div className="mt-4">
            <p className="font-semibold text-zinc-500 dark:text-zinc-300 mt-2">
              Lançamento:{" "}
              <span>
                {itemDetails.release_date || itemDetails.first_air_date}
              </span>
            </p>
            <p className="font-semibold text-zinc-500 dark:text-zinc-300 mt-2">
              Classificação: <span>{itemDetails.vote_average}</span>
            </p>
            <p className="font-semibold text-zinc-500 dark:text-zinc-300 mt-2">
              Gêneros:{" "}
              {itemDetails.genres?.map((genre: any) => genre.name).join(", ")}
            </p>
            <p className="font-semibold text-zinc-500 dark:text-zinc-300 mt-2">
              Duração:{" "}
              <span>
                {itemDetails.runtime || itemDetails.episode_run_time[0]} minutos
              </span>
            </p>
          </div>

          {/* Favoritar e compartilhar */}
          <div className="mt-4 flex space-x-4">
            <Button variant="secondary" onClick={handleFavoriteClick} className="w-32">
              Favoritar
            </Button>
            <Button variant="secondary" onClick={handleShareClick} className="w-32">
              Compartilhar
            </Button>
            <Button
              onClick={handleWatchClick}
              variant="secondary"
              className="w-32"
            >
              Assistir
            </Button>
          </div>
        </div>
      </div>

      {isVideoVisible && (
        <div className="mt-8">
          <h1 className="text-center mb-3 text-2xl">Assista ao conteúdo</h1>
          <div className="relative aspect-w-16 aspect-h-9">
            <iframe
              src={
                type === "movie"
                  ? `https://embed.warezcdn.com/filme/${id}`
                  : `https://embed.warezcdn.com/serie/${id}`
              }
              frameBorder="0"
              allow="autoplay; fullscreen"
              className="w-full h-[600px] rounded-lg"
              title="Assistir Vídeo"
            ></iframe>
            <h4 className="text-center">
              Caso não consiga assistir, tente pela Url:{" "} 
              <Link className="text-cyan-400" target="_blank" to={
                type === "movie"
                  ? `https://embed.warezcdn.com/filme/${id}`
                  : `https://embed.warezcdn.com/serie/${id}`
              }>
              {
                type === "movie"
                  ? `https://embed.warezcdn.com/filme/${id}`
                  : `https://embed.warezcdn.com/serie/${id}`
              }
              </Link>
            </h4>
          </div>
        </div>
      )}
    </div>
  );
};

export default Details;
