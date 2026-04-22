const DIA_COLORS = {
    Segunda: { bg: "#1A2E1A", border: "#2A4A2A", text: "#5DBE5D" },
    Terça:   { bg: "#1A1A2E", border: "#2A2A4A", text: "#5D7DBE" },
    Quarta:  { bg: "#2A1E10", border: "#4A3218", text: "#E8881A" },
    Quinta:  { bg: "#1A1A2E", border: "#2A2A4A", text: "#5D7DBE" },
    Sexta:   { bg: "#2A1020", border: "#4A1835", text: "#BE5D8A" },
    Sábado:  { bg: "#1A2828", border: "#2A4040", text: "#5DBEBE" },
    Domingo: { bg: "#2A1A1A", border: "#4A2A2A", text: "#BE5D5D" },
};

function TagDia({ dia }) {
    const c = DIA_COLORS[dia] || { bg: "#222", border: "#333", text: "#888" };
    return (
        <span
            className="text-[11px] font-semibold tracking-wide uppercase rounded-md py-[3px] px-2.5 whitespace-nowrap"
            style={{ color: c.text, background: c.bg, border: `1px solid ${c.border}` }}
        >
            {dia}
        </span>
    );
}

function IconBarbell() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 4v16M18 4v16M2 8h4M18 8h4M2 16h4M18 16h4" />
        </svg>
    );
}

function IconSeries() {
    return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    );
}

function IconEdit() {
    return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
    );
}

function IconTrash() {
    return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14H6L5 6" />
            <path d="M10 11v6M14 11v6M9 6V4h6v2" />
        </svg>
    );
}

function IconVolume() {
    return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
    );
}

export default function CardTreino({ treino, onModalEdicao, removerTreino }) {
    const totalSeries = treino.exercicios.reduce((a, e) => a + Number(e.series), 0);
    const volumeTotal = treino.exercicios.reduce((a, e) => {
        const s = Number(e.series) || 0;
        const r = Number(e.repeticoes) || 0;
        const p = Number(e.carga) || 0;
        return a + s * r * p;
    }, 0);

    return (
        <div className="group flex flex-col bg-[#161616] border border-[#222] rounded-2xl overflow-hidden transition-all duration-200 hover:border-[#E8881A]/30 hover:shadow-[0_0_24px_rgba(232,136,26,0.07)]">

            {/* Topo colorido */}
            <div className="h-1 w-full bg-gradient-to-r from-[#E8881A] to-[#F09530]" />

            {/* Header do card */}
            <div className="flex items-start justify-between px-5 pt-5 pb-3 gap-3">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 bg-[#E8881A]/10 border border-[#E8881A]/20 rounded-xl flex items-center justify-center text-[#E8881A] shrink-0">
                        <IconBarbell />
                    </div>
                    <div className="min-w-0">
                        <h3 className="text-[15px] font-semibold text-[#F0F0F0] tracking-tight truncate leading-snug">
                            {treino.nome}
                        </h3>
                        <TagDia dia={treino.dia} />
                    </div>
                </div>

                {/* Ações */}
                <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <button
                        className="w-7 h-7 flex items-center justify-center bg-transparent border border-[#2A2A2A] rounded-md cursor-pointer text-zinc-500 transition-all duration-150 p-0 hover:text-[#E8881A] hover:border-[#E8881A]/20 hover:bg-[#E8881A]/10"
                        title="Editar"
                        onClick={() => onModalEdicao(treino)}
                    >
                        <IconEdit />
                    </button>
                    <button
                        className="w-7 h-7 flex items-center justify-center bg-transparent border border-[#2A2A2A] rounded-md cursor-pointer text-zinc-500 transition-all duration-150 p-0 hover:text-red-500 hover:border-red-500/20 hover:bg-red-500/10"
                        title="Excluir"
                        onClick={() => removerTreino(treino)}
                    >
                        <IconTrash />
                    </button>
                </div>
            </div>

            {/* Divisor */}
            <div className="h-px bg-[#1F1F1F] mx-5" />

            {/* Lista de exercícios */}
            <div className="flex flex-col gap-2.5 px-5 py-4 flex-1">
                {treino.exercicios.map((ex, i) => (
                    <div key={i} className="flex items-center justify-between gap-3">
                        <span className="text-[13px] text-zinc-300 truncate">{ex.nome || "—"}</span>
                        <div className="flex items-center gap-1.5 shrink-0">
                            {/* Badge séries × reps */}
                            <span className="inline-flex items-center px-2 py-[2px] rounded-md text-[11px] font-semibold bg-[#E8881A]/10 border border-[#E8881A]/20 text-[#E8881A] tracking-wide">
                                {ex.series}×{ex.repeticoes}
                            </span>
                            {/* Badge carga */}
                            {ex.carga && (
                                <span className="inline-flex items-center px-2 py-[2px] rounded-md text-[11px] font-medium bg-zinc-800/60 border border-zinc-700/50 text-zinc-400 tracking-wide">
                                    {ex.carga} kg
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Volume Total */}
            <div className="mx-5 mb-4 flex items-center justify-between px-4 py-3 rounded-xl bg-[#E8881A]/5 border border-[#E8881A]/15">
                <div className="flex items-center gap-2 text-[12px] text-zinc-500">
                    <span className="text-[#E8881A]">
                        <IconVolume />
                    </span>
                    Volume total do treino
                </div>
                <span className="text-[14px] font-bold text-[#E8881A] tracking-tight">
                    {volumeTotal.toLocaleString("pt-BR")} kg
                </span>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-[#131313] border-t border-[#1A1A1A]">
                <span className="flex items-center gap-1.5 text-[12px] text-zinc-500">
                    <IconBarbell />
                    {treino.exercicios.length} exercício(s)
                </span>
                <span className="flex items-center gap-1.5 text-[12px] text-zinc-500">
                    <IconSeries />
                    {totalSeries} séries totais
                </span>
            </div>

        </div>
    );
}