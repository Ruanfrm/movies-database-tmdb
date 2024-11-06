import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const RegisterForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = () => {
    // Lógica de registro
    console.log("Registrar com nome:", name, "email:", email);
  };

  return (
    <div className="w-full max-w-md mx-auto  p-8 shadow-md rounded-lg mt-10">
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
