import { useState } from "react";

const DIA_COLORS = {
    Segunda: { bg: "#1A2E1A", border: "#2A4A2A", text: "#5DBE5D" },
    Terça: { bg: "#1A1A2E", border: "#2A2A4A", text: "#5D7DBE" },
    Quarta: { bg: "#2A1E10", border: "#4A3218", text: "#E8881A" },
    Quinta: { bg: "#1A1A2E", border: "#2A2A4A", text: "#5D7DBE" },
    Sexta: { bg: "#2A1020", border: "#4A1835", text: "#BE5D8A" },
    Sábado: { bg: "#1A2828", border: "#2A4040", text: "#5DBEBE" },
    Domingo: { bg: "#2A1A1A", border: "#4A2A2A", text: "#BE5D5D" },
};

function IconBarbell() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 4v16M18 4v16M2 8h4M18 8h4M2 16h4M18 16h4" />
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
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4h6v2" />
        </svg>
    );
}

function IconChevron() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
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

function IconSearch() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
        </svg>
    );
}

function TagDia({ dia }) {
    const c = DIA_COLORS[dia] || { bg: "#222", border: "#333", text: "#888" };
    return (
        <span
            className="text-[11px] font-semibold tracking-wide uppercase rounded-md py-[3px] px-2.5 whitespace-nowrap"
            style={{
                color: c.text,
                background: c.bg,
                border: `1px solid ${c.border}`,
            }}
        >
            {dia}
        </span>
    );
}

function TreinoRow({ treino, onModalEdicao, removerTreino }) {
    return (
        <div className="flex items-center justify-between py-3 sm:py-3.5 px-4 sm:px-6 gap-3 transition-colors duration-150">
            {/* Lado esquerdo */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-8 h-8 bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg flex items-center justify-center text-zinc-500 shrink-0">
                    <IconBarbell />
                </div>
                <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-[#DEDEDE] whitespace-nowrap overflow-hidden text-ellipsis tracking-tight">{treino.nome}</div>
                    <div className="flex items-center gap-1.5 mt-1">
                        <span className="flex items-center gap-1 text-[11px] text-zinc-500">
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round">
                                <path d="M6 4v16M18 4v16M2 8h4M18 8h4M2 16h4M18 16h4" />
                            </svg>
                            {treino.exercicios.length} exercícios
                        </span>
                        <span className="w-[3px] h-[3px] rounded-full bg-[#333]" />
                        <span className="flex items-center gap-1 text-[11px] text-zinc-500">
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                            {treino.exercicios.reduce((a, e) => a + Number(e.series), 0)} séries totais
                        </span>
                    </div>
                </div>
            </div>

            {/* Lado direito */}
            <div className="flex items-center gap-2.5 shrink-0">
                <TagDia dia={treino.dia} />
                <div className="flex items-center gap-1">
                    <button
                        className="w-7 h-7 flex items-center justify-center bg-transparent border border-[#2A2A2A] rounded-md cursor-pointer text-zinc-500 transition-all duration-150 p-0 hover:text-[#E8881A] hover:border-[#E8881A]/20 hover:bg-[#E8881A]/10"
                        title="Editar"
                        onClick={() => onModalEdicao(treino)}
                    >
                        <IconEdit />
                    </button>
                    <button
                        className="w-7 h-7 flex items-center justify-center bg-transparent border border-[#2A2A2A] rounded-md cursor-pointer text-zinc-500 transition-all duration-150 p-0 hover:text-[#E8441A] hover:border-[#E8441A]/20 hover:bg-[#E8441A]/10"
                        title="Excluir"
                        onClick={() => removerTreino(treino)}
                    >
                        <IconTrash />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function TabelaTreino({ onModal, onModalEdicao, treinos, erro, removerTreino }) {
    const [busca, setBusca] = useState("")

    let treinoFiltrados = treinos.filter(treino => treino.nome.toLowerCase().includes(busca.toLowerCase()))

    return (
        <div className="flex justify-center items-start pt-6 sm:pt-10 px-3 sm:px-4 pb-6 font-sans">
            <div className="w-full max-w-[760px] bg-[#161616] border border-[#222] rounded-2xl overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between p-4 sm:p-5 px-4 sm:px-6 gap-2">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#E8881A]/10 border border-[#E8881A]/20 rounded-lg flex items-center justify-center text-[#E8881A] shrink-0">
                            <IconBarbell />
                        </div>
                        <div>
                            <div className="text-[17px] font-semibold text-[#F0F0F0] tracking-tight leading-snug">Meus Treinos</div>
                            <div className="text-xs text-zinc-500 mt-0.5">{treinos.length} treinos cadastrados</div>
                        </div>
                    </div>
                    <button
                        onClick={() => onModal(true)}
                        className="flex items-center gap-1.5 py-2 px-3 sm:px-4 text-[13px] font-semibold text-[#111] bg-[#E8881A] border-none rounded-lg cursor-pointer transition-colors duration-150 font-sans whitespace-nowrap hover:bg-[#F09530]"
                    >
                        <IconPlus />
                        Novo treino
                    </button>
                </div>

                {/* Filtros */}
                <div className="flex items-center gap-2.5 px-4 sm:px-6 pb-4 flex-wrap">
                    <div className="flex items-center gap-2 flex-1 min-w-[180px] bg-[#181818] border border-[#2A2A2A] rounded-lg px-3 transition-colors duration-150 focus-within:border-[#E8881A]">
                        <span className="flex items-center shrink-0"><IconSearch /></span>
                        <input
                            className="bg-transparent border-none outline-none text-[#E0E0E0] text-[13px] py-2 w-full font-sans"
                            type="text"
                            placeholder="Buscar treino..."
                            onChange={(e) => setBusca(e.target.value)}
                        />
                    </div>
                </div>

                <div className="h-px bg-[#1F1F1F]" />

                {/* Cabeçalho da tabela */}
                <div className="flex items-center py-2.5 px-4 sm:px-6 border-b border-[#1A1A1A]">
                    <span className="text-[11px] font-semibold text-[#3A3A3A] tracking-wide uppercase">Treino</span>
                    <span className="text-[11px] font-semibold text-[#3A3A3A] tracking-wide uppercase ml-auto pr-[80px] sm:pr-[110px]">Dia</span>
                </div>

                {/* Linhas */}
                {!erro && <div className="py-1">
                    {treinoFiltrados.map((treino, i) => (
                        <div key={treino.id}>
                            <TreinoRow treino={treino} onModalEdicao={onModalEdicao} removerTreino={removerTreino} />
                            {i < treinos.length - 1 && <div className="h-px bg-[#1A1A1A] mx-6" />}
                        </div>
                    ))}
                </div>}

                {erro && <div className="flex items-center justify-center">
                    <h2 className="text-1xl text-white font-bold p-4 mb-5">Crie um novo treino</h2>
                </div>}

                {/* Footer */}
                <div className="flex items-center justify-between py-3.5 px-6 bg-[#131313] border-t border-[#1F1F1F]">
                    <span className="text-xs text-[#444]">
                        Mostrando <strong className="text-[#888] font-semibold">{treinos.length}</strong> de <strong className="text-[#888] font-semibold">{treinos.length}</strong> treinos
                    </span>
                    <div className="flex items-center gap-1.5">
                        <button className="w-7 h-7 flex items-center justify-center bg-transparent border border-[#2A2A2A] rounded-md cursor-pointer text-zinc-500 transition-colors duration-150 p-0 hover:border-[#444]">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
                        </button>
                        <span className="w-7 h-7 flex items-center justify-center bg-[#E8881A]/10 border border-[#E8881A]/30 rounded-md text-xs font-semibold text-[#E8881A]">1</span>
                        <button className="w-7 h-7 flex items-center justify-center bg-transparent border border-[#2A2A2A] rounded-md cursor-pointer text-zinc-500 transition-colors duration-150 p-0 hover:border-[#444]">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}