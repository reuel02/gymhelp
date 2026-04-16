const DIAS_SEMANA = [
    "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo",
];

import { MdClose } from "react-icons/md";

const exercicioVazio = { nome: "", series: "", repeticoes: "", carga: "" };

export default function ModalTreino({ onClose }) {
    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/70 backdrop-blur-sm p-4 font-sans">
            <div className="w-full max-w-[720px] max-h-[90vh] flex flex-col bg-[#161616] border border-[#222] rounded-2xl shadow-2xl overflow-hidden">

                {/* Header (Sempre fixo no topo) */}
                <div className="flex items-center justify-between p-5 px-6 shrink-0">
                    <div className="flex items-center gap-2.5">
                        <span className="w-[34px] h-[34px] bg-[#E8881A]/10 border border-[#E8881A]/20 rounded-lg flex items-center justify-center">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E8881A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 4v16M18 4v16M2 8h4M18 8h4M2 16h4M18 16h4" />
                            </svg>
                        </span>
                        <span className="text-lg font-semibold text-[#F0F0F0] tracking-tight">Novo Treino</span>
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
                            {DIAS_SEMANA.map((dia) => (
                                <button
                                    key={dia}
                                    className="py-[7px] px-[14px] text-[13px] font-medium text-zinc-400 bg-[#1E1E1E] border border-[#333] rounded-lg cursor-pointer transition-all duration-150 font-sans hover:bg-[#E8881A]/10 hover:border-[#E8881A] hover:text-[#E8881A]"
                                >
                                    {dia}
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
                            placeholder="Ex: Treino A — Peito e Tríceps"
                        />
                    </div>

                    <div className="h-px bg-[#1F1F1F] mx-6" />

                    {/* Exercícios */}
                    <div className="p-5 px-6">
                        <div className="flex items-center justify-between mb-3.5">
                            <label className="block text-xs font-semibold text-zinc-500 tracking-wide uppercase">Exercícios</label>
                            <button className="flex items-center gap-1.5 py-1.5 px-3 text-xs font-semibold text-[#E8881A] bg-[#E8881A]/10 border-none rounded-md cursor-pointer transition-colors duration-150 font-sans tracking-wide hover:bg-[#E8881A] hover:text-[#111]">
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

                        {/* Linhas de exercício (estáticas, mock) */}
                        {[exercicioVazio, exercicioVazio].map((_, i) => (
                            <div key={i} className="flex items-center gap-2 mb-2">
                                <input
                                    className="bg-[#181818] border border-[#2A2A2A] rounded-lg py-2 px-2.5 text-[13px] text-[#E0E0E0] outline-none transition-colors duration-150 font-sans min-w-0 flex-[3] focus:border-[#E8881A]"
                                    type="text"
                                    placeholder={i === 0 ? "Supino reto com barra" : "Nome do exercício"}
                                />
                                <input
                                    className="bg-[#181818] border border-[#2A2A2A] rounded-lg py-2 px-2.5 text-[13px] text-[#E0E0E0] outline-none transition-colors duration-150 font-sans min-w-0 flex-1 focus:border-[#E8881A]"
                                    type="number"
                                    placeholder="4"
                                    min="1"
                                />
                                <input
                                    className="bg-[#181818] border border-[#2A2A2A] rounded-lg py-2 px-2.5 text-[13px] text-[#E0E0E0] outline-none transition-colors duration-150 font-sans min-w-0 flex-1 focus:border-[#E8881A]"
                                    type="number"
                                    placeholder="12"
                                    min="1"
                                />
                                <div className="flex-[1.4] flex items-center gap-1 px-2 border border-[#2A2A2A] rounded-lg bg-[#181818] focus-within:border-[#E8881A] transition-colors duration-150 py-2">
                                    <input
                                        className="bg-transparent border-none outline-none text-[#E0E0E0] text-[13px] w-full font-sans"
                                        type="number"
                                        placeholder="80"
                                        min="0"
                                        step="0.5"
                                    />
                                    <span className="text-zinc-500 text-[11px] whitespace-nowrap">kg</span>
                                </div>
                                <button className="w-7 h-7 flex items-center justify-center bg-transparent border border-transparent rounded-md cursor-pointer text-[#444] transition-all duration-150 shrink-0 p-0 hover:text-[#E8441A] hover:border-[#E8441A]/20 hover:bg-[#E8441A]/10">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                        <path d="M18 6L6 18M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ))}

                        {/* Estado vazio hint */}
                        <div className="flex items-center gap-1.5 mt-2.5 text-xs text-zinc-500 leading-relaxed">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 8v4M12 16h.01" />
                            </svg>
                            <span>Adicione quantos exercícios quiser. Clique em "+ Adicionar" para incluir mais.</span>
                        </div>
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
                            placeholder="Ex: Foco em tensão muscular, tempo de execução de 3 segundos na descida..."
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
                    <button className="flex items-center gap-1.5 py-[9px] px-5 text-[13px] font-semibold text-[#111] bg-[#E8881A] border-none rounded-lg cursor-pointer transition-colors duration-150 font-sans hover:bg-[#F09530]">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                            <polyline points="17 21 17 13 7 13 7 21" />
                            <polyline points="7 3 7 8 15 8" />
                        </svg>
                        Salvar Treino
                    </button>
                </div>

            </div>
        </div>
    );
}