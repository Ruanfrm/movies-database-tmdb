import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ReloadIcon, StopIcon, ResetIcon, Share2Icon } from "@radix-ui/react-icons";
import axios from 'axios';

type ActionType = 'reboot' | 'shutdown' | 'reset' | 'backup';

const MikroTikControl = () => {
  const [loading, setLoading] = useState<ActionType | null>(null);
  const [responseMessage, setResponseMessage] = useState("");

  const handleAction = async (action: ActionType) => {
    setLoading(action);
    setResponseMessage("");

    const endpoint = action;

    try {
      const response = action === 'backup'
        ? await axios.get(`${import.meta.env.VITE_API_URL}/${endpoint}`)
        : await axios.post(`${import.meta.env.VITE_API_URL}/${endpoint}`);

      setResponseMessage(response.data.message);
    } catch (error: any) {
      setResponseMessage(error.response?.data?.error || "Erro ao executar ação");
    } finally {
      setLoading(null);
    }
  };

  return (
    <Card className="w-full p-6 mx-auto shadow-lg rounded-lg mt-5">
      <CardHeader>
        <CardTitle className="text-center text-xl font-bold">Controle do MikroTik</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500 text-center">Gerencie as principais funções do seu dispositivo MikroTik.</p>
        {responseMessage && (
          <p className="mt-4 text-center text-sm font-medium text-green-500">{responseMessage}</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-around mt-4 space-x-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2" disabled={loading === 'reboot'}>
              <ReloadIcon className="w-5 h-5 text-blue-500" />
              Reiniciar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Reiniciar MikroTik</DialogTitle>
            <DialogDescription>Tem certeza de que deseja reiniciar o MikroTik?</DialogDescription>
            <Button
              variant="destructive"
              onClick={() => handleAction('reboot')}
              disabled={loading === 'reboot'}
            >
              Confirmar Reinício
            </Button>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2" disabled={loading === 'shutdown'}>
              <StopIcon className="w-5 h-5 text-red-500" />
              Desligar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Desligar MikroTik</DialogTitle>
            <DialogDescription>Tem certeza de que deseja desligar o MikroTik?</DialogDescription>
            <Button
              variant="destructive"
              onClick={() => handleAction('shutdown')}
              disabled={loading === 'shutdown'}
            >
              Confirmar Desligamento
            </Button>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2" disabled={loading === 'reset'}>
              <ResetIcon className="w-5 h-5 text-yellow-500" />
              Resetar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Resetar para Padrão de Fábrica</DialogTitle>
            <DialogDescription>Tem certeza de que deseja resetar o MikroTik para as configurações de fábrica?</DialogDescription>
            <Button
              variant="destructive"
              onClick={() => handleAction('reset')}
              disabled={loading === 'reset'}
            >
              Confirmar Reset
            </Button>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2" disabled={loading === 'backup'}>
              <Share2Icon className="w-5 h-5 text-green-500" />
              Backup
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Realizar Backup do MikroTik</DialogTitle>
            <DialogDescription>Tem certeza de que deseja gerar o backup do MikroTik?</DialogDescription>
            <Button
              variant="destructive"
              onClick={() => handleAction('backup')}
              disabled={loading === 'backup'}
            >
              Confirmar Backup
            </Button>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default MikroTikControl;
