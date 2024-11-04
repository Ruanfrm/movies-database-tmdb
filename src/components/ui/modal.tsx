import React from 'react';
import { Portal } from '@radix-ui/react-portal';
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button'; // Certifique-se de que você tem um componente de botão

interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void; // Função opcional para o botão de confirmação
  children: React.ReactNode; // O conteúdo do modal
}

const Modal: React.FC<ModalProps> = ({ title, isOpen, onClose, onConfirm, children }) => {
  return (
    <Portal>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogOverlay className="fixed inset-0 bg-black/30" />
        <DialogContent className="fixed top-1/2 left-1/2 w-11/12 max-w-md transform -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg">
          <DialogTitle className="text-lg font-bold">{title}</DialogTitle>
          <div className="mt-4">{children}</div>
          <div className="mt-6 flex justify-end space-x-2">
            {onConfirm && (
              <Button variant="primary" onClick={onConfirm}>
                Confirmar
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Portal>
  );
};

export default Modal;
