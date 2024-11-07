import React, { useState, useEffect } from 'react';
import { Edit3, X } from 'lucide-react'; // Importando ícones do lucide-react
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'; // Adaptando para utilizar o shadcn

interface ApiUrlModalProps {
  isOpen: boolean;
  onSave: (url: string) => void;
  onClose: () => void;
}

export const ApiUrlModal: React.FC<ApiUrlModalProps> = ({ isOpen, onSave, onClose }) => {
  const [newUrl, setNewUrl] = useState<string>('');

  useEffect(() => {
    // Busca a URL salva no localStorage ao montar o componente
    const storedUrl = localStorage.getItem('apiUrl') || '';
    setNewUrl(storedUrl);
  }, []);

  const handleSave = () => {
    if (newUrl) {
      // Salva a nova URL no localStorage
      localStorage.setItem('apiUrl', newUrl);
      onSave(newUrl);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-blue-500" />
            Editar URL da API
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-300"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="Digite a nova URL da API"
          />
        </div>

        <DialogFooter className="mt-4 flex justify-end gap-2">
          <DialogClose asChild>
            <button onClick={onClose} className="px-4 py-2 bg-gray-100 rounded text-zinc-950 dark:bg-gray-700 dark:text-gray-300 flex justify-center items-center">
              <X className="w-4 h-4 mr-1" /> Cancelar
            </button>
          </DialogClose>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded gap-1 hover:bg-blue-600 flex justify-center items-center">
            <Edit3 className="w-4 h-4" /> Salvar
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
