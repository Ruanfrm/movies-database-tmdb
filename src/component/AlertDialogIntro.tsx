import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { BugIcon } from "lucide-react";

export default function AlertDialogIntro() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    // Checa se o alerta já foi visualizado pelo usuário
    const isDialogViewed = localStorage.getItem("alertDialogViewed");

    // Se não foi visualizado, abre o alerta após 5 segundos
    if (!isDialogViewed) {
      const timer = setTimeout(() => {
        setIsDialogOpen(true);
      }, 5000);

      return () => clearTimeout(timer); // Limpa o timer caso o componente seja desmontado
    }
  }, []);

  // Função para fechar o alerta e salvar a visualização no localStorage
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    localStorage.setItem("alertDialogViewed", "true"); // Salva no localStorage
  };

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogTrigger className="hidden">Bem-vindo</AlertDialogTrigger> {/* Esconde o botão trigger */}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Este sistema está em desenvolvimento.</AlertDialogTitle>
          <AlertDialogDescription>
            Caso você encontre algum Bug, ou acha que algo pode ser melhorado, por gentileza contate-nos.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleDialogClose}> <BugIcon  /> Ok!</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
