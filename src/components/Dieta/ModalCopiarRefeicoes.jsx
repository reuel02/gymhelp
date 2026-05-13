import { useState } from "react";
import { MdClose } from "react-icons/md";

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

export default function ModalCopiarRefeicoes({ onClose, refeicoes, diaDestino, onCopiar, copiando }) {
    const [diaOrigem, setDiaOrigem] = useState("");

    const diasDisponiveis = DIAS_SEMANA.filter(d => d !== diaDestino && refeicoes.some(r => r.dia === d));
    const refeicoesDoDiaOrigem = diaOrigem ? refeicoes.filter(r => r.dia === diaOrigem) : [];

    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/70 backdrop-blur-sm p-4 font-sans">
            <div className="w-full max-w-[520px] max-h-[90vh] flex flex-col bg-[#161616] border border-[#222] rounded-2xl shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between p-5 px-6 shrink-0">
                    <div className="flex items-center gap-2.5">
                        <span className="w-[34px] h-[34px] bg-[#A855F7]/10 border border-[#A855F7]/20 rounded-lg flex items-center justify-center">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A855F7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                            </svg>
                        </span>
                        <div>
                            <span className="text-lg font-semibold text-[#F0F0F0] tracking-tight">Copiar Refeições</span>
                            <span className="block text-[11px] text-zinc-500 mt-0.5">Para {diaDestino}</span>
                        </div>
                    </div>
                    <button onClick={() => onClose(false)} className="p-1 rounded-lg text-zinc-400 hover:text-[#A855F7] hover:bg-[#A855F7]/10 transition-colors">
                        <MdClose className="size-6" />
                    </button>
                </div>

                <div className="h-px bg-[#1F1F1F] mx-6 shrink-0" />

                {/* Body */}
                <div className="overflow-y-auto flex-1 p-5 px-6">
                    <label className="block text-xs font-semibold text-zinc-500 tracking-wide uppercase mb-3">Copiar de qual dia?</label>

                    {diasDisponiveis.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-zinc-600">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                                <path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3" />
                            </svg>
                            <span className="mt-3 text-sm">Nenhum dia com refeições para copiar</span>
                            <span className="text-[11px] text-zinc-700 mt-1">Cadastre refeições em outros dias primeiro</span>
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-wrap gap-2 mb-5">
                                {diasDisponiveis.map(dia => {
                                    const c = DIA_COLORS[dia];
                                    const ativo = dia === diaOrigem;
                                    const qtd = refeicoes.filter(r => r.dia === dia).length;
                                    return (
                                        <button
                                            key={dia}
                                            type="button"
                                            onClick={() => setDiaOrigem(dia)}
                                            className={`relative flex flex-col items-center py-2.5 px-4 rounded-lg text-[13px] font-medium transition-all duration-150 cursor-pointer border ${ativo ? 'shadow-[0_0_14px_rgba(168,85,247,0.15)]' : 'bg-[#1E1E1E] border-[#2A2A2A] text-zinc-500 hover:border-[#444] hover:text-zinc-300'}`}
                                            style={ativo ? { background: c.bg, borderColor: c.border, color: c.text } : {}}
                                        >
                                            <span className="font-semibold">{dia}</span>
                                            <span className="text-[10px] opacity-70 mt-0.5">{qtd} refeição(ões)</span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Preview das refeições */}
                            {diaOrigem && (
                                <div className="flex flex-col gap-2">
                                    <span className="text-[10px] font-semibold text-zinc-500 tracking-wide uppercase">Refeições que serão copiadas</span>
                                    {refeicoesDoDiaOrigem.map((ref, i) => {
                                        const cal = ref.alimentos.reduce((a, al) => a + Number(al.calorias || 0), 0);
                                        return (
                                            <div key={i} className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#1A1A1A] border border-[#252525]">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <span className="text-[13px] font-semibold text-[#E0E0E0] truncate">{ref.tipo}</span>
                                                    <span className="text-[11px] text-zinc-600">•</span>
                                                    <span className="text-[11px] text-zinc-500">{ref.alimentos.length} alimento(s)</span>
                                                </div>
                                                <span className="text-[12px] font-bold text-[#A855F7] shrink-0">{cal} kcal</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-2.5 py-4 px-6 bg-[#131313] border-t border-[#1F1F1F] shrink-0">
                    <button
                        type="button"
                        onClick={() => onClose(false)}
                        className="py-[9px] px-[18px] text-[13px] font-medium text-[#888] bg-transparent border border-[#2A2A2A] rounded-lg cursor-pointer transition-colors duration-150 font-sans hover:border-[#555] hover:text-[#bbb]"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        className={`flex items-center gap-1.5 py-[9px] px-5 text-[13px] font-semibold text-[#111] bg-[#A855F7] border-none rounded-lg transition-colors font-sans
                            ${!diaOrigem || copiando ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-[#9333EA]"}`}
                        disabled={!diaOrigem || copiando}
                        onClick={() => onCopiar(diaOrigem)}
                    >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                        </svg>
                        {copiando ? "Copiando..." : `Copiar para ${diaDestino}`}
                    </button>
                </div>
            </div>
        </div>
    );
}
