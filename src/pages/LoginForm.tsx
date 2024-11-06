import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Lógica de autenticação
    console.log("Login com email:", email, "e senha:", password);
  };

  const handleGoogleLogin = () => {
    // Lógica para autenticação com o Google
    console.log("Login com Google");
  };

  return (
    <div className="w-full max-w-md mx-auto  p-8 shadow-md rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Bem-vindo de volta!</h2>
      <p className="text-sm text-gray-600 mb-6 text-center">Faça login para continuar</p>
      <div className="flex flex-col gap-4">
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
        <Button onClick={handleLogin} className="w-full bg-blue-600 text-white hover:bg-blue-700">
          Entrar
        </Button>
        <div className="flex items-center justify-center text-gray-500 mt-4">
          <span className="text-sm">ou</span>
        </div>
        <Button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-100 text-gray-600"
        >
          <FcGoogle className="text-xl" />
          Entrar com Google
        </Button>
        <p className="text-sm text-gray-500 text-center mt-4">
          Não tem uma conta? <a href="/register" className="text-blue-600 hover:underline">Registre-se</a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
