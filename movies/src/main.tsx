import ReactDOM from 'react-dom/client';
import App from './App'; // Seu componente principal
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import { Toaster } from 'sonner'


const rootElement = document.getElementById('root') as HTMLElement;

ReactDOM.createRoot(rootElement).render(
  <BrowserRouter>
    <App />
    <Toaster richColors  />
  </BrowserRouter>
);
