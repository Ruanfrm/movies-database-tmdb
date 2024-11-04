import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

export function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen ">
      <Card className="max-w-md w-full p-6 shadow-md rounded-lg">
        <CardHeader className="flex items-center">
          <ExclamationTriangleIcon className="w-8 h-8 text-yellow-600" />
          <h2 className="ml-2 text-xl font-semibold">Página Não Encontrada</h2>
        </CardHeader>
        <CardContent className="mt-4">
          <p className="text-gray-700">
            Desculpe, mas a página que você está procurando não foi encontrada. 
          </p>
          <p className="mt-2 text-gray-600">
            Você pode voltar ao início ou explorar outras seções do site.
          </p>
          <div className="mt-6">
            <Link to="/" className="text-blue-600 hover:underline">
              Voltar para o Início
            </Link>
            <span className="mx-2">|</span>
            <Link to="/about" className="text-blue-600 hover:underline">
              Conheça-nos
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
