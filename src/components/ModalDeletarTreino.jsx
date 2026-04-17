import React from 'react';
import { MdClose } from "react-icons/md";

export function ModalDeletarTreino({ onClose, onConfirm, treino, salvando }) {
    if (!treino) return null;

    return (
        <div className="fixed inset-0 z-[60] flex justify-center items-center bg-black/70 backdrop-blur-sm p-4 font-sans">
            <div className="w-full max-w-[400px] flex flex-col bg-[#161616] border border-[#222] rounded-2xl shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between p-5 px-6 border-b border-[#1F1F1F]">
                    <div className="flex items-center gap-2.5">
                        <span className="w-[34px] h-[34px] bg-red-500/10 border border-red-500/20 rounded-lg flex items-center justify-center text-red-500">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 6h18"></path>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                        </span>
                        <span className="text-lg font-semibold text-[#F0F0F0] tracking-tight">Excluir </span>
                    </div>
                    <button
                        onClick={() => onClose(false)}
                        className="p-1 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                        <MdClose className="size-6" />
                    </button>
                </div>

                <div className="p-6">
                    <p className="text-[14px] text-zinc-400 mb-6 leading-relaxed">
                        Tem certeza que deseja excluir o treino <span className="text-[#E0E0E0] font-semibold">"{treino.nome}"</span>? Esta ação não pode ser desfeita.
                    </p>

                    <div className="flex items-center justify-end gap-3">
                        <button
                            onClick={() => onClose(false)}
                            disabled={salvando}
                            className="py-2.5 px-4 text-[13px] font-medium text-[#888] bg-transparent border border-[#2A2A2A] rounded-lg cursor-pointer transition-colors duration-150 hover:border-[#555] hover:text-[#bbb] disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={salvando}
                            className={`py-2.5 px-4 text-[13px] font-semibold text-white bg-red-600 border-none rounded-lg transition-colors 
                                ${salvando ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-red-700"}
                            `}
                        >
                            {salvando ? "Excluindo..." : "Excluir Treino"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
