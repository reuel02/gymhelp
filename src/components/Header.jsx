import logoSvg from "../assets/logo.svg";

export default function Header() {
  const diaDaSemana = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
  });

  const dataCompleta = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const diaFormatado =
    diaDaSemana.charAt(0).toUpperCase() + diaDaSemana.slice(1);

  return (
    <div className="flex flex-row justify-between min-w-dvh bg-card items-center">
      <img
        src={logoSvg}
        alt="Logo GYM HELP"
        className="size-32 ml-40 scale-220"
      />

      <div className="flex items-center gap-3 px-1 py-2">
        <svg
          className="size-6 text-destaque"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          ></path>
        </svg>

        <h1 className="text-titulo text-2xl mr-40">
          {diaFormatado}, {dataCompleta}
        </h1>
      </div>
    </div>
  );
}
