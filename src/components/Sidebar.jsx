import { } from 'react-icons/fa';
import { LiaDumbbellSolid } from "react-icons/lia";
import { MdOutlineFoodBank } from "react-icons/md";
import { FiHome } from "react-icons/fi";
import logoSvg from '../assets/logo.svg'

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-64 bg-card border-r border-zinc-800">
      <div className='border-b border-zinc-700'>
        <img
          src={logoSvg}
          alt="Logo GYM HELP"
          className="size-10 scale-400 ml-18 mt-7 mb-3"
        />
      </div>
      <h2 className="text-titulo text-sm mt-8 px-6 font-thin">Menu</h2>
      <nav className="text-texto text-md font-medium flex flex-col gap-6 px-6 mt-3">
        <a href="/" className='flex items-center gap-3 hover:text-titulo hover:font-semibold'><FiHome />Dashboard</a>
        <a href="/treino" className='flex items-center gap-3 hover:text-titulo hover:font-semibold'><LiaDumbbellSolid />Treino</a>
        <a href="#" className='flex items-center gap-3 hover:text-titulo hover:font-semibold'><MdOutlineFoodBank />Dieta</a>
      </nav>
    </aside>
  );
}
