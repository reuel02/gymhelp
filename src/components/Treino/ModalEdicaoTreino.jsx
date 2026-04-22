import React from 'react';
import { MdClose } from "react-icons/md";

const DIAS_SEMANA = [
    "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo",
];

export function ModalEdicaoTreino({ onClose, setDia, setNome, setExercicios, setObservacoes, adicionarExercicioVazio, dia, removerExercicio, nome, atualizarTreino, salvando, exercicios, observacoes }) {
    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/70 backdrop-blur-sm p-4 font-sans">
            <div className="w-full max-w-[720px] max-h-[90vh] flex flex-col bg-[#161616] border border-[#222] rounded-2xl shadow-2xl overflow-hidden">

                {/* Header (Sempre fixo no topo) */}
                <div className="flex items-center justify-between p-5 px-6 shrink-0">
                    <div className="flex items-center gap-2.5">
                        <span className="w-[34px] h-[34px] bg-[#E8881A]/10 border border-[#E8881A]/20 rounded-lg flex items-center justify-center">
                            {/* Ícone de Edição (Lápis) */}
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E8881A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </span>
                        <span className="text-lg font-semibold text-[#F0F0F0] tracking-tight">Editar Treino</span>
                    </div>
                    <button
                        onClick={() => onClose(false)}
                        className="p-1 rounded-lg text-zinc-400 hover:text-[#E8881A] hover:bg-[#E8881A]/10 transition-colors"
                    >
                        <MdClose className="size-6" />
                    </button>
                </div>

                <div className="h-px bg-[#1F1F1F] mx-6 shrink-0" />

                {/* Corpo do Modal (Aqui acontece o Scroll!) */}
                <div className="overflow-y-auto flex-1">

                    {/* Dia da semana */}
                    <div className="p-5 px-6">
                        <label className="block text-xs font-semibold text-zinc-500 tracking-wide uppercase mb-3">Dia da semana</label>
                        <div className="flex flex-wrap gap-2">
                            {DIAS_SEMANA.map((d) => (
                                <button
                                    key={d}
                                    onClick={() => setDia(d)}
                                    className={`py-[7px] px-[14px] text-[13px] font-medium bg-[#1E1E1E] border border-[#333] rounded-lg cursor-pointer transition-all duration-150 font-sans hover:bg-[#E8881A]/10 hover:border-[#E8881A] hover:text-[#E8881A] ${dia === d
                                        ? "bg-[#E8881A]/20 border-[#E8881A] text-[#E8881A]"
                                        : "bg-[#1E1E1E] border-[#333] text-zinc-400"
                                        }`}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="h-px bg-[#1F1F1F] mx-6" />

                    {/* Nome do treino */}
                    <div className="p-5 px-6">
                        <label className="block text-xs font-semibold text-zinc-500 tracking-wide uppercase mb-3">Nome do treino</label>
                        <input
                            className="w-full bg-[#181818] border border-[#2A2A2A] rounded-lg py-2.5 px-3.5 text-sm text-[#E0E0E0] outline-none transition-colors duration-150 font-sans box-border focus:border-[#E8881A] focus:bg-[#1E1E1E]"
                            type="text"
                            value={nome}
                            placeholder="Ex: Treino A — Peito e Tríceps"
                            onChange={(e) => setNome(e.target.value)}
                        />
                    </div>

                    <div className="h-px bg-[#1F1F1F] mx-6" />

                    {/* Exercícios */}
                    <div className="p-5 px-6">
                        <div className="flex items-center justify-between mb-3.5">
                            <label className="block text-xs font-semibold text-zinc-500 tracking-wide uppercase">Exercícios</label>
                            <button
                                className="flex items-center gap-1.5 py-1.5 px-3 text-xs font-semibold text-[#E8881A] bg-[#E8881A]/10 border-none rounded-md cursor-pointer transition-colors duration-150 font-sans tracking-wide hover:bg-[#E8881A] hover:text-[#111]"
                                onClick={adicionarExercicioVazio}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                    <path d="M12 5v14M5 12h14" />
                                </svg>
                                Adicionar
                            </button>
                        </div>

                        {/* Cabeçalho da tabela */}
                        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[#1F1F1F]">
                            <span className="text-[11px] text-[#444] font-semibold tracking-wide uppercase flex-[3]">Exercício</span>
                            <span className="text-[11px] text-[#444] font-semibold tracking-wide uppercase flex-1">Séries</span>
                            <span className="text-[11px] text-[#444] font-semibold tracking-wide uppercase flex-1">Reps</span>
                            <span className="text-[11px] text-[#444] font-semibold tracking-wide uppercase flex-[1.4]">Última carga</span>
                            <span className="w-7" />
                        </div>

                        {/* Linha de exercício */}
                        {exercicios.map((exercicio, i) => (
                            <div key={i} className="flex items-center gap-2 mb-2">
                                <input
                                    className="bg-[#181818] border border-[#2A2A2A] rounded-lg py-2 px-2.5 text-[13px] text-[#E0E0E0] outline-none transition-colors duration-150 font-sans min-w-0 flex-[3] focus:border-[#E8881A]"
                                    type="text"
                                    value={exercicio.nome}
                                    placeholder={i === 0 ? "Supino reto com barra" : "Nome do exercício"}
                                    onChange={(e) => {
                                        const novaLista = [...exercicios]

                                        novaLista[i].nome = e.target.value

                                        setExercicios(novaLista)
                                    }}
                                />
                                <input
                                    className="bg-[#181818] border border-[#2A2A2A] rounded-lg py-2 px-2.5 text-[13px] text-[#E0E0E0] outline-none transition-colors duration-150 font-sans min-w-0 flex-1 focus:border-[#E8881A]"
                                    type="number"
                                    value={exercicio.series}
                                    placeholder="4"
                                    min="1"
                                    onChange={(e) => {
                                        const novaLista = [...exercicios]

                                        novaLista[i].series = e.target.value

                                        setExercicios(novaLista)
                                    }}
                                />
                                <input
                                    className="bg-[#181818] border border-[#2A2A2A] rounded-lg py-2 px-2.5 text-[13px] text-[#E0E0E0] outline-none transition-colors duration-150 font-sans min-w-0 flex-1 focus:border-[#E8881A]"
                                    type="number"
                                    value={exercicio.repeticoes}
                                    placeholder="12"
                                    min="1"
                                    onChange={(e) => {
                                        const novaLista = [...exercicios]

                                        novaLista[i].repeticoes = e.target.value

                                        setExercicios(novaLista)
                                    }}
                                />
                                <div className="flex-[1.4] flex items-center gap-1 px-2 border border-[#2A2A2A] rounded-lg bg-[#181818] focus-within:border-[#E8881A] transition-colors duration-150 py-2">
                                    <input
                                        className="bg-transparent border-none outline-none text-[#E0E0E0] text-[13px] w-full font-sans"
                                        type="number"
                                        value={exercicio.carga}
                                        placeholder="80"
                                        min="0"
                                        step="0.5"
                                        onChange={(e) => {
                                            const novaLista = [...exercicios]

                                            novaLista[i].carga = e.target.value

                                            setExercicios(novaLista)
                                        }}
                                    />
                                    <span className="text-zinc-500 text-[11px] whitespace-nowrap">kg</span>
                                </div>
                                <button
                                    className="w-7 h-7 flex items-center justify-center bg-transparent border border-transparent rounded-md cursor-pointer text-[#444] transition-all duration-150 shrink-0 p-0 hover:text-[#E8441A] hover:border-[#E8441A]/20 hover:bg-[#E8441A]/10"
                                    onClick={() => removerExercicio(i)}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                        <path d="M18 6L6 18M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="h-px bg-[#1F1F1F] mx-6" />

                    {/* Observações */}
                    <div className="p-5 px-6">
                        <label className="block text-xs font-semibold text-zinc-500 tracking-wide uppercase mb-3">
                            Observações <span className="font-normal normal-case tracking-normal text-zinc-400 text-[11px]">(opcional)</span>
                        </label>
                        <textarea
                            className="w-full bg-[#181818] border border-[#2A2A2A] rounded-lg py-2.5 px-3.5 text-[13px] text-[#E0E0E0] outline-none transition-colors duration-150 font-sans resize-y box-border leading-relaxed focus:border-[#E8881A]"
                            rows={3}
                            value={observacoes}
                            onChange={(e) => setObservacoes(e.target.value)}
                        />
                    </div>
                </div>

                {/* Footer (Sempre fixo embaixo) */}
                <div className="flex items-center justify-end gap-2.5 py-4 px-6 bg-[#131313] border-t border-[#1F1F1F] shrink-0">
                    <button
                        onClick={() => onClose(false)}
                        className="py-[9px] px-[18px] text-[13px] font-medium text-[#888] bg-transparent border border-[#2A2A2A] rounded-lg cursor-pointer transition-colors duration-150 font-sans hover:border-[#555] hover:text-[#bbb]"
                    >
                        Cancelar
                    </button>
                    <button
                        className={`flex items-center gap-1.5 py-[9px] px-5 text-[13px] font-semibold text-[#111] bg-[#E8881A] border-none rounded-lg transition-colors font-sans
                            ${salvando
                                ? "opacity-50 cursor-not-allowed"
                                : "cursor-pointer hover:bg-[#F09530]"
                            }
                            `}
                        disabled={salvando}
                        onClick={atualizarTreino}
                    >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                            <polyline points="17 21 17 13 7 13 7 21" />
                            <polyline points="7 3 7 8 15 8" />
                        </svg>
                        {salvando ? "Salvando..." : "Salvar Treino"}
                    </button>
                </div>
            </div>
        </div>
    );
}