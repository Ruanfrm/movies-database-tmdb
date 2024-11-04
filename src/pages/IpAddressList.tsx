import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { WorkflowIcon, EthernetPortIcon, NetworkIcon } from 'lucide-react'; // Importando ícones do lucide-react
import Modal from '@/components/ui/modal'; // Importando um componente de modal que você deve ter
import { Input } from '@/components/ui/input';

// Definindo a interface para os dados dos endereços IP
interface IpAddress {
  ".id": string;
  address: string;
  network: string;
  interface: string;
  actualInterface: string;
  invalid: string;
  dynamic: string;
  slave: string;
  disabled: string;
}

// Componente principal
export const IpAddressList: React.FC = () => {
  const [ipAddresses, setIpAddresses] = useState<IpAddress[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedIp, setSelectedIp] = useState<IpAddress | null>(null);
  const [editingIp, setEditingIp] = useState<{ address: string; network: string } | null>(null);

  useEffect(() => {
    const fetchIpAddresses = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/ip-address`);
        if (!response.ok) {
          throw new Error(`Erro ao buscar dados: ${response.statusText}`);
        }
        const data: IpAddress[] = await response.json();
        setIpAddresses(data);
      } catch (error) {
        console.error('Erro ao buscar endereços IP:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIpAddresses();
  }, []);

  // Função para excluir um endereço IP
  const handleDelete = async (ip: IpAddress) => {
    const confirm = window.confirm(`Tem certeza que deseja excluir o endereço IP ${ip.address}?`);
    if (confirm) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/ip-address/${ip[".id"]}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setIpAddresses(ipAddresses.filter(item => item[".id"] !== ip[".id"]));
        } else {
          throw new Error(`Erro ao excluir: ${response.statusText}`);
        }
      } catch (error) {
        console.error('Erro ao excluir endereço IP:', error);
      }
    }
  };

  // Função para abrir o modal de edição
  const handleEdit = (ip: IpAddress) => {
    setEditingIp({ address: ip.address, network: ip.network });
    setSelectedIp(ip);
    setIsModalOpen(true);
  };

  // Função para salvar a edição
  const handleSaveEdit = async () => {
    if (selectedIp && editingIp) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/ip-address/${selectedIp[".id"]}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingIp),
        });
        if (response.ok) {
          const updatedData = await response.json();
          setIpAddresses(ipAddresses.map(ip => (ip[".id"] === selectedIp[".id"] ? updatedData : ip)));
          setIsModalOpen(false);
        } else {
          throw new Error(`Erro ao editar: ${response.statusText}`);
        }
      } catch (error) {
        console.error('Erro ao editar endereço IP:', error);
      }
    }
  };

  return (
    <div className="flex items-center justify-center mt-5">
      <Card className="w-full max-w-5xl">
        <CardHeader>
          <CardTitle className="text-center text-lg font-bold">Lista de Endereços IP</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">Carregando...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Interface</TableHead>
                  <TableHead>Endereço</TableHead>
                  <TableHead>Rede</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ipAddresses.map((ip) => (
                  <TableRow key={ip[".id"]}>
                    <TableCell className="flex items-center space-x-2">
                      <EthernetPortIcon className="w-5 h-5 text-gray-600" />
                      <span>{ip.interface}</span>
                    </TableCell>
                    <TableCell >
                      {ip.address}
                    </TableCell>
                    <TableCell>{ip.network}</TableCell>
                    <TableCell>
                      <span className={`text-${ip.disabled === 'false' ? 'green' : 'red'}-600`}>
                        {ip.disabled === 'false' ? 'Ativo' : 'Desativado'}
                      </span>
                    </TableCell>
                    <TableCell className="flex space-x-2">
                      {/* <Button variant="outline" size="sm" onClick={() => handleEdit(ip)}>Editar</Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(ip)}>Excluir</Button> */}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modal para edição */}
      {isModalOpen && (
        <Modal 
          title="Editar Endereço IP" 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onConfirm={handleSaveEdit}
        >
          <div className="flex flex-col space-y-4">
            <Input
              label="Endereço"
              value={editingIp?.address}
              onChange={(e) => setEditingIp({ ...editingIp!, address: e.target.value })}
            />
            <Input
              label="Rede"
              value={editingIp?.network}
              onChange={(e) => setEditingIp({ ...editingIp!, network: e.target.value })}
            />
          </div>
        </Modal>
      )}
    </div>
  );
};
