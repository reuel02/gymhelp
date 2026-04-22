import logoSvg from "../assets/logo.svg";

export default function Header() {
  const diaDaSemana = new Date().toLocaleDateString("pt-BR", { weekday: "long" });
  const dataCompleta = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const diaFormatado = diaDaSemana.charAt(0).toUpperCase() + diaDaSemana.slice(1);

  return (
    <div className="flex flex-row justify-between items-center bg-card border-b border-zinc-800 px-4 lg:px-6 py-3">

      {/* Logo visível apenas no mobile (sidebar cuida do desktop) */}
      <div className="flex items-center lg:hidden">
        <img src={logoSvg} alt="Logo GYM HELP" className="h-8" />
      </div>

      {/* Data */}
      <div className="flex items-center gap-2 ml-auto">
        <svg
          className="size-5 text-destaque shrink-0 hidden sm:block"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <h1 className="text-titulo text-xs sm:text-sm lg:text-base font-medium">
          <span className="hidden sm:inline">{diaFormatado}, </span>
          {dataCompleta}
        </h1>
      </div>

    </div>
  );
}
