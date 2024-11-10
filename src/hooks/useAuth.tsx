import { useState, useEffect } from "react";
import { auth } from "@/firebaseConfig"; // Certifique-se de importar corretamente seu Firebase config
import { User, onAuthStateChanged } from "firebase/auth";
import { toast } from "sonner"; // Importando a função toast do Sonner

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Observa o estado de autenticação do Firebase
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Atualiza o estado com o usuário autenticado

      // Se o usuário estiver autenticado, exibe um toast
      if (currentUser) {
        toast("Você está logado!");
        console.log("Usuario nao está logado!")
      }
    });

    // Limpeza do listener quando o componente for desmontado
    return () => unsubscribe();
  }, []);

  return { user }; // Retorna o usuário autenticado
};
