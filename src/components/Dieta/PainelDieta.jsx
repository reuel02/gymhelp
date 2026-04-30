const DIAS_SEMANA = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

const DIA_COLORS = {
    Segunda: { bg: "#1A2E1A", border: "#2A4A2A", text: "#5DBE5D" },
    Terça:   { bg: "#1A1A2E", border: "#2A2A4A", text: "#5D7DBE" },
    Quarta:  { bg: "#2A1E10", border: "#4A3218", text: "#E8881A" },
    Quinta:  { bg: "#1A1A2E", border: "#2A2A4A", text: "#5D7DBE" },
    Sexta:   { bg: "#2A1020", border: "#4A1835", text: "#BE5D8A" },
    Sábado:  { bg: "#1A2828", border: "#2A4040", text: "#5DBEBE" },
    Domingo: { bg: "#2A1A1A", border: "#4A2A2A", text: "#BE5D5D" },
};

const TIPOS_REFEICAO = ["Café da manhã", "Almoço", "Lanche", "Jantar", "Pré-treino", "Pós-treino"];

function IconFood() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3" />
        </svg>
    );
}

function IconPlus() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
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

function IconEdit() {
    return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
    );
}

function TipoIcon({ tipo }) {
    const icones = {
        "Café da manhã": "☀",
        "Almoço": "🍽",
        "Lanche": "🥤",
        "Jantar": "🌙",
        "Pré-treino": "⚡",
        "Pós-treino": "💪",
    };
    return <span className="text-sm">{icones[tipo] || "🍴"}</span>;
}

export default function PainelDieta({ diaSelecionado, setDiaSelecionado, refeicoes, onAdicionarRefeicao, onEditarRefeicao, onRemoverRefeicao }) {
    const refeicoesDoDia = refeicoes.filter(r => r.dia === diaSelecionado);

    const totalCaloriasDia = refeicoesDoDia.reduce((total, ref) => {
        return total + ref.alimentos.reduce((acc, al) => acc + Number(al.calorias || 0), 0);
    }, 0);

    return (
        <div className="flex justify-center items-start pt-6 sm:pt-10 px-3 sm:px-4 pb-6 font-sans">
            <div className="w-full max-w-[700px] flex flex-col bg-[#161616] border border-[#222] rounded-2xl overflow-hidden">

                {/* Barra top */}
                <div className="h-1 w-full bg-gradient-to-r from-[#E8881A] to-[#F09530]" />

                {/* Header */}
                <div className="flex items-center justify-between px-5 sm:px-6 pt-5 sm:pt-6 pb-4 gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#E8881A]/10 border border-[#E8881A]/20 rounded-xl flex items-center justify-center text-[#E8881A] shrink-0">
                            <IconFood />
                        </div>
                        <div>
                            <h2 className="text-[17px] font-semibold text-[#F0F0F0] tracking-tight leading-snug">
                                Plano Alimentar
                            </h2>
                            <p className="text-xs text-zinc-500 mt-0.5">
                                {refeicoes.length} refeições cadastradas
                            </p>
                        </div>
                    </div>
                </div>

                <div className="h-px bg-[#1F1F1F]" />

                {/* Abas dos dias */}
                <div className="px-4 sm:px-6 py-4 overflow-x-auto">
                    <div className="flex gap-1.5 min-w-max">
                        {DIAS_SEMANA.map((dia) => {
                            const c = DIA_COLORS[dia];
                            const ativo = dia === diaSelecionado;
                            const qtdDia = refeicoes.filter(r => r.dia === dia).length;

                            return (
                                <button
                                    key={dia}
                                    type="button"
                                    onClick={() => setDiaSelecionado(dia)}
                                    className={`relative flex flex-col items-center py-2 px-3 sm:px-4 rounded-lg text-[12px] sm:text-[13px] font-medium transition-all duration-150 cursor-pointer border
                                        ${ativo
                                            ? `shadow-[0_0_14px_rgba(232,136,26,0.12)]`
                                            : 'bg-[#1E1E1E] border-[#2A2A2A] text-zinc-500 hover:border-[#444] hover:text-zinc-300'
                                        }`}
                                    style={ativo ? {
                                        background: c.bg,
                                        borderColor: c.border,
                                        color: c.text,
                                    } : {}}
                                >
                                    <span className="font-semibold">{dia.slice(0, 3)}</span>
                                    {qtdDia > 0 && (
                                        <span className="mt-0.5 text-[9px] opacity-70">{qtdDia} ref.</span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="h-px bg-[#1F1F1F]" />

                {/* Conteúdo do dia selecionado */}
                <div className="px-5 sm:px-6 py-5 sm:py-6 flex flex-col gap-3 min-h-[160px]">

                    {/* Título do dia */}
                    <div className="flex items-center justify-between mb-1">
                        <h3 className="text-[14px] font-semibold text-[#E0E0E0] tracking-tight">
                            {diaSelecionado}
                        </h3>
                        <button
                            type="button"
                            onClick={onAdicionarRefeicao}
                            className="flex items-center gap-1.5 py-1.5 px-3 text-xs font-semibold text-[#E8881A] bg-[#E8881A]/10 border-none rounded-md cursor-pointer transition-colors duration-150 font-sans tracking-wide hover:bg-[#E8881A] hover:text-[#111]"
                        >
                            <IconPlus />
                            Adicionar refeição
                        </button>
                    </div>

                    {/* Lista de refeições */}
                    {refeicoesDoDia.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-10 text-zinc-600">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                                <path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3" />
                            </svg>
                            <span className="mt-3 text-sm">Nenhuma refeição cadastrada</span>
                            <span className="text-[11px] text-zinc-700 mt-1">Clique em "Adicionar refeição" para começar</span>
                        </div>
                    )}

                    {refeicoesDoDia.map((ref) => {
                        const caloriasRefeicao = ref.alimentos.reduce((acc, al) => acc + Number(al.calorias || 0), 0);

                        return (
                            <div key={ref.id} className="group flex flex-col bg-[#1A1A1A] border border-[#252525] rounded-xl overflow-hidden transition-all duration-150 hover:border-[#333]">
                                {/* Header da refeição */}
                                <div className="flex items-center justify-between px-4 py-3 gap-3">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <TipoIcon tipo={ref.tipo} />
                                        <span className="text-[13px] font-semibold text-[#E0E0E0] truncate">{ref.tipo}</span>
                                        <span className="text-[11px] text-zinc-600">•</span>
                                        <span className="text-[11px] font-medium text-[#E8881A]">{caloriasRefeicao} kcal</span>
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-150">
                                        <button
                                            type="button"
                                            className="w-7 h-7 flex items-center justify-center bg-transparent border border-[#2A2A2A] rounded-md cursor-pointer text-zinc-500 transition-all duration-150 p-0 hover:text-[#E8881A] hover:border-[#E8881A]/20 hover:bg-[#E8881A]/10"
                                            title="Editar"
                                            onClick={() => onEditarRefeicao(ref)}
                                        >
                                            <IconEdit />
                                        </button>
                                        <button
                                            type="button"
                                            className="w-7 h-7 flex items-center justify-center bg-transparent border border-[#2A2A2A] rounded-md cursor-pointer text-zinc-500 transition-all duration-150 p-0 hover:text-red-500 hover:border-red-500/20 hover:bg-red-500/10"
                                            title="Excluir"
                                            onClick={() => onRemoverRefeicao(ref)}
                                        >
                                            <IconTrash />
                                        </button>
                                    </div>
                                </div>

                                {/* Lista de alimentos */}
                                {ref.alimentos.length > 0 && (
                                    <div className="border-t border-[#222] px-4 py-2.5 flex flex-col gap-2">
                                        {ref.alimentos.map((al, i) => (
                                            <div key={i} className="flex flex-col gap-1">
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="text-[12px] text-zinc-400 truncate">{al.nome}</span>
                                                    {al.quantidade && (
                                                        <span className="inline-flex items-center px-1.5 py-[1px] rounded text-[10px] font-medium bg-zinc-800/60 border border-zinc-700/50 text-zinc-400 shrink-0">
                                                            {al.quantidade}g
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                    <span className="inline-flex items-center px-1.5 py-[1px] rounded text-[10px] font-semibold bg-[#E8881A]/10 border border-[#E8881A]/20 text-[#E8881A]">
                                                        {al.calorias} kcal
                                                    </span>
                                                    {al.proteina && (
                                                        <span className="inline-flex items-center px-1.5 py-[1px] rounded text-[10px] font-medium bg-blue-500/10 border border-blue-500/20 text-blue-400">
                                                            P {al.proteina}g
                                                        </span>
                                                    )}
                                                    {al.carboidrato && (
                                                        <span className="inline-flex items-center px-1.5 py-[1px] rounded text-[10px] font-medium bg-green-500/10 border border-green-500/20 text-green-400">
                                                            C {al.carboidrato}g
                                                        </span>
                                                    )}
                                                    {al.gordura && (
                                                        <span className="inline-flex items-center px-1.5 py-[1px] rounded text-[10px] font-medium bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
                                                            G {al.gordura}g
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Footer com total */}
                <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 bg-[#131313] border-t border-[#1A1A1A]">
                    <span className="text-[12px] text-zinc-500">
                        {refeicoesDoDia.length} refeição(ões) · {diaSelecionado}
                    </span>
                    <span className="flex items-center gap-1.5 text-[13px] font-bold text-[#E8881A] tracking-tight">
                        {totalCaloriasDia} kcal
                    </span>
                </div>

            </div>
        </div>
    );
}
