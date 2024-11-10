import { useState, useEffect } from "react";
import { Edit, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback} from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { updateProfile, signOut, updatePassword } from "firebase/auth"; // Importando updatePassword
import { getAuth, onAuthStateChanged, sendEmailVerification, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { storage } from "@/firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [avatar, setAvatar] = useState<string>("");
  const [creationDate, setCreationDate] = useState<string>("");
  const [lastLogin, setLastLogin] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPassword, setCurrentPassword] = useState<string>(""); // Para a senha atual
  const [newPassword, setNewPassword] = useState<string>(""); // Para a nova senha
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>(""); // Para a confirmação da nova senha

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (authUser) => {
      if (authUser) {
        setUser(authUser);
        setName(authUser.displayName || "");
        setEmail(authUser.email || "");
        setAvatar(authUser.photoURL || "");
        setCreationDate(authUser.metadata.creationTime || "");
        setLastLogin(authUser.metadata.lastSignInTime || "");
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const storageRef = ref(storage, `avatars/${user?.uid}/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
          toast.success(`Upload está em ${progress}% completo`)
        },
        (error) => {
          console.error("Erro ao fazer upload da imagem:", error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setAvatar(downloadURL);
            updateProfileAvatar(downloadURL);
          });
        }
      );
    }
  };

  const updateProfileAvatar = (newAvatarURL: string) => {
    if (user) {
      updateProfile(user, { photoURL: newAvatarURL }).then(() => {
        console.log("Avatar atualizado com sucesso!");
        toast.success("Avatar atualizado com sucesso!");
      }).catch((error) => {
        console.error("Erro ao atualizar avatar:", error);
      });
    }
  };

  const handleUpdateProfile = () => {
    setLoading(true);

    if (user) {
      updateProfile(user, { displayName: name, photoURL: avatar})
        .then(() => {
          setLoading(false);
          toast.success("Perfil atualizado com sucesso!");
        })
        .catch((error) => {
          console.error("Erro ao atualizar perfil:", error);
          setLoading(false);
        });
    }
  };

  const handleEmailVerification = () => {
    if (user && !user.emailVerified) {
      sendEmailVerification(user)
        .then(() => {
          toast.success("E-mail de verificação enviado!");
        })
        .catch((error) => {
          console.error("Erro ao enviar e-mail de verificação:", error);
          toast.error("Erro ao enviar e-mail de verificação");
        });
    }
  };

  const handleLogout = () => {
    signOut(getAuth())
      .then(() => {
        toast.success("Desconectado com sucesso!");
      })
      .catch((error) => {
        console.error("Erro ao deslogar:", error);
        toast.error("Erro ao deslogar");
      });
  };

  // Função para alterar a senha
  const handleChangePassword = () => {
    if (user && currentPassword && newPassword && confirmNewPassword) {
      if (newPassword !== confirmNewPassword) {
        toast.error("As novas senhas não coincidem!");
        return;
      }

      const credential = EmailAuthProvider.credential(user.email!, currentPassword);

      reauthenticateWithCredential(user, credential) // Reautenticar usuário
        .then(() => {
          updatePassword(user, newPassword) // Atualizar a senha
            .then(() => {
              toast.success("Senha alterada com sucesso!");
              setCurrentPassword(""); // Limpar campos
              setNewPassword("");
              setConfirmNewPassword(""); // Limpar o campo de confirmação
            })
            .catch((error) => {
              console.error("Erro ao alterar a senha:", error);
              toast.error("Erro ao alterar a senha");
            });
        })
        .catch((error) => {
          console.error("Erro de reautenticação:", error);
          toast.error("Erro de reautenticação, senha atual inválida");
        });
    } else {
      toast.error("Preencha todos os campos de senha");
    }
  };

  if (!user) {
    return <div className="text-center p-8">Carregando...</div>;
  }

  return (
    <div className="p-8 max-w-3xl mx-auto bg-transparent overflow-hidden">
      <h1 className="text-4xl font-semibold text-center mb-6">Meu Perfil</h1>

      {/* Avatar e Editar Foto */}
      <div className="flex justify-center mb-8 relative">
        <Avatar className="min-w-40 w-40 h-40 rounded-full">
          <AvatarImage 
            src={avatar || "https://github.com/shadcn.png"} 
            alt={`Foto de perfil de ${name}`} 
          />
          <AvatarFallback>{name}</AvatarFallback>
        </Avatar>
        <label htmlFor="avatar" className="absolute bottom-0 right-0 p-2 bg-indigo-600 text-white rounded-full cursor-pointer hover:bg-indigo-700 transition duration-200">
          <Edit size={20} />
        </label>
        <input
          id="avatar"
          type="file"
          className="hidden"
          onChange={handleAvatarChange}
        />
      </div>

      {/* Formulário de informações */}
      <div className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-lg font-medium text-gray-700 dark:text-gray-300">Nome</label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Digite seu nome"
            className="mt-2 p-4 border-2 border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-lg font-medium text-gray-700 dark:text-gray-300">E-mail</label>
          <Input
            id="email"
            type="email"
            value={email}
            disabled
            placeholder="Digite seu e-mail"
            className="mt-2 p-4 border-2 border-gray-300 rounded-lg w-full dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>

        <div className="space-y-4 mt-8">
          {/* Campos para alterar a senha */}
          <div>
            <label htmlFor="currentPassword" className="block text-lg font-medium text-gray-700 dark:text-gray-300">Senha Atual</label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Digite sua senha atual"
              className="mt-2 p-4 border-2 border-gray-300 rounded-lg w-full dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-lg font-medium text-gray-700 dark:text-gray-300">Nova Senha</label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Digite sua nova senha"
              className="mt-2 p-4 border-2 border-gray-300 rounded-lg w-full dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="confirmNewPassword" className="block text-lg font-medium text-gray-700 dark:text-gray-300">Confirmar Nova Senha</label>
            <Input
              id="confirmNewPassword"
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder="Confirme sua nova senha"
              className="mt-2 p-4 border-2 border-gray-300 rounded-lg w-full dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <Button
            onClick={handleUpdateProfile}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg"
          >
            Atualizar Perfil
          </Button>

          <Button
            onClick={handleChangePassword}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
          >
            Alterar Senha
          </Button>
        </div>
        <div className="flex justify-center mt-8">
          {user && !user.emailVerified && (
            <Button
              onClick={handleEmailVerification}
              disabled={loading}
              className="py-2 px-6 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition duration-200"
            >
              Enviar E-mail de Verificação
            </Button>
          )}
        </div>

        <div className="text-center mt-4">
          <Button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg"
          >
            <LogOut className="mr-2" size={18} /> Sair da conta
          </Button>
        </div>
        
        
      </div>
        {/* Informações do usuário */}
        <div className="mt-8 space-y-4 text-gray-600 dark:text-gray-400">
        <div>
          <strong>Data de Criação da Conta:</strong> {new Date(creationDate).toLocaleString()}
        </div>
        <div>
          <strong>Último Login:</strong> {new Date(lastLogin).toLocaleString()}
        </div>
        <div>
          <strong>UID:</strong> {user?.uid}
        </div>
        <div>
          <strong>E-mail Verificado:</strong> {user?.emailVerified ? "Sim" : "Não"}
        </div>
        </div>
    </div>
  );
};

export default ProfilePage;
