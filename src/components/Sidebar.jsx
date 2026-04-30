import { LiaDumbbellSolid } from "react-icons/lia";
import { MdOutlineFoodBank } from "react-icons/md";
import { FiHome, FiUser } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import logoSvg from '../assets/logo.svg'

const LINKS = [
  { href: "/", label: "Dashboard", icon: FiHome },
  { href: "/treino", label: "Treino", icon: LiaDumbbellSolid },
  { href: "/dieta", label: "Dieta", icon: MdOutlineFoodBank },
  { href: "/perfil", label: "Perfil", icon: FiUser },
];

export default function Sidebar() {
  const { pathname } = useLocation();

  function isActive(href) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <>
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-64 bg-card border-r border-zinc-800">
        <div className='border-b border-zinc-700'>
          <img src={logoSvg} alt="Logo GYM HELP" className="size-10 scale-400 ml-18 mt-7 mb-3" />
        </div>
        <h2 className="text-titulo text-sm mt-8 px-6 font-thin">Menu</h2>
        <nav className="text-texto text-md font-medium flex flex-col gap-6 px-6 mt-3">
          {LINKS.map(({ href, label, icon: Icon }) => (
            <a
              key={href}
              href={href}
              className={`flex items-center gap-3 transition-colors ${
                isActive(href)
                  ? "text-destaque font-semibold"
                  : "hover:text-titulo hover:font-semibold"
              }`}
            >
              <Icon />{label}
            </a>
          ))}
        </nav>
      </aside>

      {/* Bottom nav mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-zinc-800 flex justify-around items-center py-2 safe-area-inset-bottom">
        {LINKS.map(({ href, label, icon: Icon }) => (
          <a
            key={href}
            href={href}
            className={`flex flex-col items-center gap-0.5 transition-colors px-4 py-1.5 ${
              isActive(href) ? "text-destaque" : "text-zinc-500 hover:text-destaque"
            }`}
          >
            <Icon className="size-5" />
            <span className="text-[10px] font-medium">{label}</span>
          </a>
        ))}
      </nav>
    </>
  );
}
