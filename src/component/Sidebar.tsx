import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutDashboard, GlobeIcon, LayersIcon, Link2Icon, ChevronLeftIcon, ChevronRightIcon, LogsIcon, UserIcon, UsersIcon, SettingsIcon, LogOutIcon } from 'lucide-react';

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Carregar estado do localStorage ao montar o componente
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState !== null) {
      setIsCollapsed(JSON.parse(savedState)); // Converte a string do localStorage de volta para booleano
    }
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(prevState => {
      const newState = !prevState;
      localStorage.setItem('sidebarCollapsed', JSON.stringify(newState)); // Salva o novo estado no localStorage
      return newState;
    });
  };

  return (
    <Card className={`min-h-screen ${isCollapsed ? 'w-21' : 'w-64'} p-4 border-r shadow-lg transition-all duration-300`}>
      <CardHeader className="flex justify-between items-center">
        {!isCollapsed && <CardTitle className="text-lg font-semibold">Painel de Controle</CardTitle>}
        <button onClick={toggleSidebar} className="text-gray-600 hover:text-blue-600">
          {isCollapsed ? <ChevronRightIcon className="w-5 h-5" /> : <ChevronLeftIcon className="w-5 h-5" />}
        </button>
      </CardHeader>
      <CardContent>
        <nav className="space-y-4 mt-4">
          <ul className="space-y-3">
            <li>
              <Link to="/" className={`flex ${isCollapsed ? 'justify-center' : 'items-center space-x-2'} text-gray-700 hover:text-blue-600`}>
                <LayoutDashboard className="w-5 h-5" />
                {!isCollapsed && <span>Dashboard</span>}
              </Link>
            </li>
            <li>
              <Link to="/interfaces" className={`flex ${isCollapsed ? 'justify-center' : 'items-center space-x-2'} text-gray-700 hover:text-blue-600`}>
                <LayersIcon className="w-5 h-5" />
                {!isCollapsed && <span>Interfaces</span>}
              </Link>
            </li>
            <li>
              <Link to="/dhcp-clients" className={`flex ${isCollapsed ? 'justify-center' : 'items-center space-x-2'} text-gray-700 hover:text-blue-600`}>
                <UsersIcon className="w-5 h-5" />
                {!isCollapsed && <span>Clientes DHCP</span>}
              </Link>
            </li>
            <li>
              <Link to="/pppoe-clients" className={`flex ${isCollapsed ? 'justify-center' : 'items-center space-x-2'} text-gray-700 hover:text-blue-600`}>
                <GlobeIcon className="w-5 h-5" />
                {!isCollapsed && <span>Clientes PPPoE</span>}
              </Link>
            </li>
            <li>
              <Link to="/hotspot-clients" className={`flex ${isCollapsed ? 'justify-center' : 'items-center space-x-2'} text-gray-700 hover:text-blue-600`}>
                <UsersIcon className="w-5 h-5" />
                {!isCollapsed && <span>Clientes Hotspot</span>}
              </Link>
            </li>
            <li>
              <Link to="/active-connections" className={`flex ${isCollapsed ? 'justify-center' : 'items-center space-x-2'} text-gray-700 hover:text-blue-600`}>
                <Link2Icon className="w-5 h-5" />
                {!isCollapsed && <span>Conexões Ativas</span>}
              </Link>
            </li>
            <li>
              <Link to="/logs" className={`flex ${isCollapsed ? 'justify-center' : 'items-center space-x-2'} text-gray-700 hover:text-blue-600`}>
                <LogsIcon className="w-4 h-5" />
                {!isCollapsed && <span>Logs</span>}
              </Link>
            </li>
          </ul>
          <div className="border-t border-gray-300 mt-4 pt-4">
            <h3 className="text-gray-600 mb-2">Conta de Usuário</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/profile" className={`flex ${isCollapsed ? 'justify-center' : 'items-center space-x-2'} text-gray-700 hover:text-blue-600`}>
                  <UserIcon className="w-5 h-5" />
                  {!isCollapsed && <span>Perfil</span>}
                </Link>
              </li>
              <li>
                <Link to="/settings" className={`flex ${isCollapsed ? 'justify-center' : 'items-center space-x-2'} text-gray-700 hover:text-blue-600`}>
                  <SettingsIcon className="w-5 h-5" />
                  {!isCollapsed && <span>Configurações</span>}
                </Link>
              </li>
              <li>
                <Link to="/logout" className={`flex ${isCollapsed ? 'justify-center' : 'items-center space-x-2'} text-gray-700 hover:text-blue-600`}>
                  <LogOutIcon className="w-5 h-5" />
                  {!isCollapsed && <span>Sair</span>}
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </CardContent>
    </Card>
  );
}
