import { useState, useEffect } from "react";
import { LiaDumbbellSolid } from "react-icons/lia";
import { MdOutlineFoodBank } from "react-icons/md";
import { FiHome, FiUser, FiLogOut, FiBarChart2, FiTrendingUp, FiX } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import logoSvg from '../assets/logo.svg'
import supabase from '../lib/supabase'

const LINKS = [
  { href: "/", label: "Dashboard", icon: FiHome },
  { href: "/treino", label: "Treino", icon: LiaDumbbellSolid },
  { href: "/dieta", label: "Dieta", icon: MdOutlineFoodBank },
  { href: "/metricas", label: "Métricas", icon: FiBarChart2 },
  { href: "/evolucao", label: "Evolução", icon: FiTrendingUp },
  { href: "/perfil", label: "Perfil", icon: FiUser },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handler = () => setIsOpen(true);
    window.addEventListener('open-sidebar', handler);
    return () => window.removeEventListener('open-sidebar', handler);
  }, []);

  function isActive(href) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  return (
    <>
      {/* Overlay Mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden transition-opacity backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar (Desktop fixed, Mobile off-canvas) */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-zinc-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className='flex items-center justify-between border-b border-zinc-700 p-4 lg:block lg:border-b lg:border-zinc-700'>
          <img src={logoSvg} alt="Logo GYM HELP" className="h-8 lg:size-10 lg:scale-400 lg:ml-18 lg:mt-3 lg:mb-3" />
          <button 
            className="lg:hidden p-2 text-zinc-400 hover:text-white rounded-md bg-zinc-800/50" 
            onClick={() => setIsOpen(false)}
          >
             <FiX className="size-6" />
          </button>
        </div>
        
        <h2 className="text-titulo text-sm mt-8 px-6 font-thin hidden lg:block">Menu</h2>
        
        <nav className="text-texto text-md font-medium flex flex-col gap-6 px-6 mt-8 lg:mt-3">
          {LINKS.map(({ href, label, icon: Icon }) => (
            <a
              key={href}
              href={href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 transition-colors ${
                isActive(href)
                  ? "text-destaque font-semibold"
                  : "hover:text-titulo hover:font-semibold"
              }`}
            >
              <Icon className="size-5" />{label}
            </a>
          ))}
        </nav>

        {/* Botão Sair */}
        <div className="mt-auto px-6 pb-6 pt-4 border-t border-zinc-800/50 lg:border-none">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full text-sm font-medium text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
          >
            <FiLogOut className="size-5" />
            Sair da conta
          </button>
        </div>
      </aside>
    </>
  );
}
