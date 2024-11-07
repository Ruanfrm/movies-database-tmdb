import { useState, useEffect } from 'react';

export const useApiUrl = () => {
  const [apiUrl, setApiUrl] = useState<string | null>(localStorage.getItem('apiUrl'));

  const saveApiUrl = (url: string) => {
    localStorage.setItem('apiUrl', url);
    setApiUrl(url);
  };

  useEffect(() => {
    // Garantir que o valor de apiUrl será `null` se não houver URL salva
    if (!localStorage.getItem('apiUrl')) {
      setApiUrl(null);
    }
  }, []);

  return { apiUrl, setApiUrl: saveApiUrl };
};
