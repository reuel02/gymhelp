import { LiaDumbbellSolid } from "react-icons/lia";
import { MdOutlineFoodBank } from "react-icons/md";
import { FiHome } from "react-icons/fi";
import logoSvg from '../assets/logo.svg'

export default function Sidebar() {
  return (
    <>
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-64 bg-card border-r border-zinc-800">
        <div className='border-b border-zinc-700'>
          <img src={logoSvg} alt="Logo GYM HELP" className="size-10 scale-400 ml-18 mt-7 mb-3" />
        </div>
        <h2 className="text-titulo text-sm mt-8 px-6 font-thin">Menu</h2>
        <nav className="text-texto text-md font-medium flex flex-col gap-6 px-6 mt-3">
          <a href="/" className='flex items-center gap-3 hover:text-titulo hover:font-semibold'><FiHome />Dashboard</a>
          <a href="/treino" className='flex items-center gap-3 hover:text-titulo hover:font-semibold'><LiaDumbbellSolid />Treino</a>
          <a href="/dieta" className='flex items-center gap-3 hover:text-titulo hover:font-semibold'><MdOutlineFoodBank />Dieta</a>
        </nav>
      </aside>

      {/* Bottom nav mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-zinc-800 flex justify-around items-center py-2 safe-area-inset-bottom">
        <a href="/" className="flex flex-col items-center gap-0.5 text-zinc-500 hover:text-destaque transition-colors px-4 py-1.5">
          <FiHome className="size-5" />
          <span className="text-[10px] font-medium">Dashboard</span>
        </a>
        <a href="/treino" className="flex flex-col items-center gap-0.5 text-destaque transition-colors px-4 py-1.5">
          <LiaDumbbellSolid className="size-5" />
          <span className="text-[10px] font-medium text-destaque">Treino</span>
        </a>
        <a href="/dieta" className="flex flex-col items-center gap-0.5 text-zinc-500 hover:text-destaque transition-colors px-4 py-1.5">
          <MdOutlineFoodBank className="size-5" />
          <span className="text-[10px] font-medium">Dieta</span>
        </a>
      </nav>
    </>
  );
}
