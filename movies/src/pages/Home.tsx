import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import api from "../services/api";
import MoviesGrid from "../components/MoviesGrid";

const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"movies" | "series">("movies");
  const [data, setData] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const urlPage = Number(searchParams.get("page")) || 1;
    const urlType = searchParams.get("type") || "movies";
    setPage(urlPage);
    setActiveTab(urlType as "movies" | "series");
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoint = activeTab === "movies" ? "movie/popular" : "tv/popular";
        const response = await api.get(endpoint, { params: { page } });
        setData(response.data.results);
        setTotalPages(response.data.total_pages);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, [activeTab, page]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
      setSearchParams({ page: newPage.toString(), type: activeTab });
    }
  };

  const renderPaginationItems = () => {
    const items = [];
    const startPage = Math.max(1, page - 2);
    const endPage = Math.min(totalPages, page + 2);

    if (startPage > 1) {
      items.push(
        <PaginationItem key="first">
          <PaginationLink href="#" onClick={() => handlePageChange(1)}>
            1
          </PaginationLink>
        </PaginationItem>
      );
      if (startPage > 2) items.push(<PaginationEllipsis key="start-ellipsis" />);
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            href="#"
            onClick={() => handlePageChange(i)}
            className={page === i ? "font-bold" : ""}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) items.push(<PaginationEllipsis key="end-ellipsis" />);
      items.push(
        <PaginationItem key="last">
          <PaginationLink href="#" onClick={() => handlePageChange(totalPages)}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  // Corrigindo a navegação para a página de detalhes
  const handleItemClick = (id: string) => {
    // Aqui, estamos passando o tipo correto para a navegação
    const type = activeTab === "movies" ? "movie" : "tv";
    navigate(`/details/${type}/${id}`);
  };

  return (
    <div className="container mx-auto p-6">
      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          setActiveTab(value as "movies" | "series"); // Atualiza o tipo de conteúdo
          setPage(1); // Resetar para a página 1 ao mudar de aba
          setSearchParams({ page: "1", type: value }); // Atualiza a URL
        }}
        className="w-full"
      >
        <TabsList className=" mb-4 ">
          <TabsTrigger
            value="movies"
            className="px-4 py-2 text-lg font-semibold dark:text-white text-gray-800"
          >
            Filmes
          </TabsTrigger>
          <TabsTrigger
            value="series"
            className="px-4 py-2 text-lg font-semibold dark:text-white text-gray-800"
          >
            Séries
          </TabsTrigger>
        </TabsList>
        <TabsContent value="movies" className="">
          <MoviesGrid data={data} onItemClick={handleItemClick} />
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={page > 1 ? () => handlePageChange(page - 1) : undefined}
                  className={page === 1 ? "text-gray-400 cursor-not-allowed dark:text-gray-600" : ""}
                />
              </PaginationItem>
              {renderPaginationItems()}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={page < totalPages ? () => handlePageChange(page + 1) : undefined}
                  className={page === totalPages ? "text-gray-400 cursor-not-allowed dark:text-gray-600" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </TabsContent>
        <TabsContent value="series">
          <MoviesGrid data={data} onItemClick={handleItemClick} />
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={page > 1 ? () => handlePageChange(page - 1) : undefined}
                  className={page === 1 ? "text-gray-400 cursor-not-allowed dark:text-gray-600" : ""}
                />
              </PaginationItem>
              {renderPaginationItems()}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={page < totalPages ? () => handlePageChange(page + 1) : undefined}
                  className={page === totalPages ? "text-gray-400 cursor-not-allowed dark:text-gray-600" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Home;
