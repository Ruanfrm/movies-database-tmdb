import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type FavoriteItem = {
  id: string;
  title: string;
  type: string;
  watched: boolean;
};

const FavoritesList: React.FC = () => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(storedFavorites);
  }, []);

  const handleMarkAsWatched = (id: string) => {
    const updatedFavorites = favorites.map((item) =>
      item.id === id ? { ...item, watched: true } : item
    );
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    toast.success("Item marcado como assistido!");
  };

  const handleRemove = (id: string) => {
    const updatedFavorites = favorites.filter((item) => item.id !== id);
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    toast.success("Item removido da lista de favoritos!");
  };

  return (
    <Table>
      <TableCaption>Seus itens favoritos</TableCaption>
      <TableHeader>
        <TableRow>
        <TableHead className="w-[50px]">ID</TableHead>
          <TableHead className="w-[50px]">Título</TableHead>
          <TableHead className="w-[100px]">Tipo</TableHead>
          <TableHead className="w-[100px]">Assistido</TableHead>
          <TableHead className="w-[150px]">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {favorites.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.id}</TableCell>
            <TableCell className="font-medium">{item.title}</TableCell>
            <TableCell>{item.type === "movie" ? "Filme" : "Série"}</TableCell>
            <TableCell>{item.watched ? "Sim" : "Não"}</TableCell>
            <TableCell className="flex space-x-2">
              {!item.watched && (
                <Button variant="secondary" onClick={() => handleMarkAsWatched(item.id)}>
                  Marcar como assistido
                </Button>
              )}
              <Button variant="outline" onClick={() => handleRemove(item.id)}>
                Remover
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default FavoritesList;
