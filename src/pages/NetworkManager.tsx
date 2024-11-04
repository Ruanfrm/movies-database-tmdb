import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/components/ui/table';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { PlusCircledIcon, TrashIcon } from '@radix-ui/react-icons';
import axios from 'axios';

interface User {
  id: string;
  username: string;
}

interface WirelessNetwork {
  id: string;
  ssid: string;
  status: string;
}

const NetworkManager: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [pppoeUsers, setPppoeUsers] = useState<any[]>([]);
  const [ip, setIp] = useState('');
  const [downloadLimit, setDownloadLimit] = useState('');
  const [uploadLimit, setUploadLimit] = useState('');
  const [wirelessNetworks, setWirelessNetworks] = useState<WirelessNetwork[]>([]);
  const [ssid, setSsid] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'success' | 'error' | null>(null);

  const API_URL = import.meta.env.VITE_API_URL; // URL base da API

  useEffect(() => {
    fetchPppoeUsers();
    fetchWirelessNetworks();
  }, []);

  const fetchPppoeUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/pppoe-users`); // URL da API
      const data = await response.json();
      setPppoeUsers(data);
    } catch (error) {
      console.error('Erro ao buscar usuários PPPoE:', error);
    }
  };

  const fetchWirelessNetworks = async () => {
    try {
      const response = await axios.get(`${API_URL}/wireless-networks`); // URL da API
      setWirelessNetworks(response.data);
    } catch (error) {
      showAlert('Erro ao carregar redes wireless', 'error');
    }
  };

  const showAlert = (message: string, type: 'success' | 'error') => {
    setAlertMessage(message);
    setAlertType(type);
    setTimeout(() => {
      setAlertMessage(null);
    }, 3000);
  };

  const handleCreateUser = async () => {
    if (!username || !password) {
      showAlert('Nome de usuário e senha são obrigatórios', 'error');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/pppoe-user`, { username, password }); // URL da API
      showAlert('Usuário PPPoE criado com sucesso!', 'success');
      setPppoeUsers([...pppoeUsers, { id: response.data.data.id, username }]);
      setUsername('');
      setPassword('');
    } catch (error) {
      showAlert('Erro ao criar usuário PPPoE', 'error');
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/pppoe-user/${id}`); // URL da API
      showAlert('Usuário PPPoE removido com sucesso!', 'success');
      setPppoeUsers(pppoeUsers.filter((user) => user.id !== id));
    } catch (error) {
      showAlert('Erro ao remover usuário PPPoE', 'error');
    }
  };

  const handleBandwidthLimit = async () => {
    if (!ip || !downloadLimit || !uploadLimit) {
      showAlert('Todos os campos de limite de banda são obrigatórios', 'error');
      return;
    }

    try {
      await axios.post(`${API_URL}/set-bandwidth-limit`, { ip, downloadLimit, uploadLimit }); // URL da API
      showAlert('Limite de banda configurado com sucesso!', 'success');
    } catch (error) {
      showAlert('Erro ao definir limite de banda', 'error');
    }
  };

  const handleBackup = async () => {
    try {
      await axios.get(`${API_URL}/backup`); // URL da API
      showAlert('Backup realizado com sucesso!', 'success');
    } catch (error) {
      showAlert('Erro ao realizar backup', 'error');
    }
  };

  const handleBlockIp = async () => {
    if (!ip) {
      showAlert('IP para bloquear é obrigatório', 'error');
      return;
    }

    try {
      await axios.post(`${API_URL}/block-ip`, { ip }); // URL da API
      showAlert('IP bloqueado com sucesso!', 'success');
    } catch (error) {
      showAlert('Erro ao bloquear IP', 'error');
    }
  };

  const handleUpdateWirelessConfig = async () => {
    if (!ssid || !wifiPassword) {
      showAlert('SSID e senha são obrigatórios', 'error');
      return;
    }

    try {
      await axios.post(`${API_URL}/wireless-config`, { ssid, password: wifiPassword }); // URL da API
      showAlert('Configuração de rede wireless atualizada com sucesso!', 'success');
    } catch (error) {
      showAlert('Erro ao atualizar configuração de rede wireless', 'error');
    }
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md space-y-6">
      {alertMessage && (
        <Alert className={`bg-${alertType === 'success' ? 'green' : 'red'}-500 text-white`}>
          <AlertTitle>{alertType === 'success' ? 'Sucesso' : 'Erro'}</AlertTitle>
          {alertMessage}
        </Alert>
      )}

      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Gerenciamento de Usuários PPPoE</h2>
        <div className="flex space-x-4">
          <Input
            placeholder="Nome de Usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="flex-1"
          />
          <Input
            placeholder="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="flex-1"
          />
          <Button icon={<PlusCircledIcon />} onClick={handleCreateUser}>
            Criar
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Usuários PPPoE</h2>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Usuário</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pppoeUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>
                  <Button variant="destructive" icon={<TrashIcon />} onClick={() => handleDeleteUser(user.id)}>
                    Deletar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Configuração de Limite de Banda</h2>
        <div className="flex space-x-4">
          <Input
            placeholder="IP"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            className="flex-1"
          />
          <Input
            placeholder="Download (bps)"
            value={downloadLimit}
            onChange={(e) => setDownloadLimit(e.target.value)}
            className="flex-1"
          />
          <Input
            placeholder="Upload (bps)"
            value={uploadLimit}
            onChange={(e) => setUploadLimit(e.target.value)}
            className="flex-1"
          />
          <Button icon={<PlusCircledIcon />} onClick={handleBandwidthLimit}>
            Configurar Limite
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Operações de Rede</h2>
        <div className="flex space-x-4">
          <Button icon={<PlusCircledIcon />} onClick={handleBackup}>
            Realizar Backup
          </Button>
          <Input
            placeholder="IP para Bloquear"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            className="flex-1"
          />
          <Button icon={<PlusCircledIcon />} onClick={handleBlockIp}>
            Bloquear IP
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Configuração Wireless</h2>
        <div className="flex space-x-4">
          <Input
            placeholder="SSID"
            value={ssid}
            onChange={(e) => setSsid(e.target.value)}
            className="flex-1"
          />
          <Input
            placeholder="Senha"
            type="password"
            value={wifiPassword}
            onChange={(e) => setWifiPassword(e.target.value)}
            className="flex-1"
          />
          <Button icon={<PlusCircledIcon />} onClick={handleUpdateWirelessConfig}>
            Atualizar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NetworkManager;
