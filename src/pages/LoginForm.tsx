import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { toast } from "sonner";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem("userToken", userCredential.user.uid); // Armazena o ID do usuário
      toast.success("Login realizado com sucesso!");
      navigate("/"); // Redireciona para a rota principal
    } catch (error) {
      toast.error("Erro ao realizar login. Verifique suas credenciais.");
      console.error("Erro de login:", error);
    }
  };
  

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast.success("Login com Google realizado com sucesso!");
      navigate("/"); // Redireciona para a página principal após o login com Google
    } catch (error) {
      toast.error("Erro ao realizar login com Google.");
      console.error("Erro de login com Google:", error);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Por favor, insira seu e-mail para recuperação.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("E-mail de recuperação enviado com sucesso!");
    } catch (error) {
      toast.error("Erro ao enviar e-mail de recuperação.");
      console.error("Erro ao enviar e-mail de recuperação:", error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 shadow-md rounded-lg mt-10">
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
        <Button
          onClick={handleForgotPassword}
          className="text-blue-600 text-sm hover:underline bg-transparent"
        >
          Esqueceu a senha?
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
