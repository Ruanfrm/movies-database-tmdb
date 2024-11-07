import { toast } from "sonner";

export const getApiUrl = () => {
    const apiUrl = localStorage.getItem('apiUrl');
    if (!apiUrl) {
      toast('URL da API não está configurada. Por favor, configure a URL.');
      return null;
    }
    return apiUrl;
  };
  