
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  LayoutDashboard, 
  PlusCircle, 
  Car, 
  DollarSign, 
  LogOut, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const location = useLocation();
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  
  const links = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={20} />
    },
    {
      name: "Novo Anúncio",
      path: "/dashboard/novo-anuncio",
      icon: <PlusCircle size={20} />
    },
    {
      name: "Estoque",
      path: "/dashboard/estoque",
      icon: <Car size={20} />
    },
    {
      name: "Fluxo de Caixa",
      path: "/dashboard/financeiro",
      icon: <DollarSign size={20} />
    }
  ];

  return (
    <aside 
      className={cn(
        "bg-secondary fixed top-0 left-0 h-screen flex flex-col transition-all duration-300 border-r border-border z-10",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-center p-4 border-b border-border">
        {!collapsed ? (
          <Link to="/" className="text-xl font-bold">
            <span className="text-crimson">Rizon</span>Tec
          </Link>
        ) : (
          <span className="text-2xl font-bold text-crimson">RT</span>
        )}
      </div>
      
      <div className="flex flex-col gap-1 p-2 flex-1 overflow-y-auto">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
              location.pathname === link.path
                ? "bg-crimson text-white"
                : "hover:bg-accent hover:text-crimson"
            )}
          >
            <span className="flex-shrink-0">{link.icon}</span>
            {!collapsed && <span className="truncate">{link.name}</span>}
          </Link>
        ))}
      </div>
      
      <div className="p-2 border-t border-border">
        <Button 
          variant="destructive" 
          className="w-full justify-start mb-2"
          onClick={logout}
        >
          <LogOut size={20} className="mr-2" />
          {!collapsed && <span>Sair</span>}
        </Button>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="w-full"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </Button>
      </div>
    </aside>
  );
}
