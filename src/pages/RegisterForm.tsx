import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { toast } from "sonner";

const RegisterForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      localStorage.setItem("userToken", userCredential.user.uid); // Armazena o ID do usuário
      toast.success("Conta criada com sucesso!");
      navigate("/"); // Redireciona para a rota principal
    } catch (error) {
      toast.error("Erro ao criar conta.");
      console.error("Erro de registro:", error);
    }
  };
  

  return (
    <div className="w-full max-w-md mx-auto p-8 shadow-md rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Crie sua conta</h2>
      <p className="text-sm text-gray-600 mb-6 text-center">Preencha as informações para se registrar</p>
      <div className="flex flex-col gap-4">
        <Input
          type="text"
          placeholder="Nome Completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Confirme a Senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button onClick={handleRegister} className="w-full bg-green-600 text-white hover:bg-green-700">
          Registrar
        </Button>
        <p className="text-sm text-gray-500 text-center mt-4">
          Já possui uma conta? <a href="/login" className="text-blue-600 hover:underline">Faça login</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
