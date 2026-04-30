import { useState } from "react";

function IconFlame() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" />
        </svg>
    );
}

function IconScale() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 3h5v5M8 3H3v5M3 16v5h5M16 21h5v-5" />
            <line x1="2" y1="12" x2="22" y2="12" />
        </svg>
    );
}

export default function FormTMB({ peso, setPeso, altura, setAltura, idade, setIdade, genero, setGenero, atividade, setAtividade, objetivo, setObjetivo, calcularTMB, onResultado }) {
    const [tmb, setTmb] = useState({})
    const [onCalcular, setOnCalcular] = useState(false)

    return (
        <div className="flex justify-center items-start pt-6 sm:pt-10 px-3 sm:px-4 pb-6 font-sans">
            <div className="w-full max-w-[700px] flex flex-col bg-[#161616] border border-[#222] rounded-2xl overflow-hidden">

                {/* Barra top */}
                <div className="h-1 w-full bg-gradient-to-r from-[#E8881A] to-[#F09530]" />

                {/* Header */}
                <div className="flex items-center gap-3 px-5 sm:px-6 pt-5 sm:pt-6 pb-4">
                    <div className="w-10 h-10 bg-[#E8881A]/10 border border-[#E8881A]/20 rounded-xl flex items-center justify-center text-[#E8881A] shrink-0">
                        <IconFlame />
                    </div>
                    <div>
                        <h2 className="text-[17px] font-semibold text-[#F0F0F0] tracking-tight leading-snug">
                            Calcular TMB
                        </h2>
                        <p className="text-xs text-zinc-500 mt-0.5">
                            Taxa Metabólica Basal (Mifflin-St Jeor)
                        </p>
                    </div>
                </div>

                <div className="h-px bg-[#1F1F1F]" />

                {/* Campos */}
                <div className="flex flex-col gap-5 px-5 sm:px-6 py-5 sm:py-6">

                    {/* Linha: Peso + Altura */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Peso */}
                        <div>
                            <label className="block text-[11px] font-semibold text-zinc-500 tracking-wide uppercase mb-2">
                                Peso (kg)
                            </label>
                            <div className="flex items-center bg-[#181818] border border-[#2A2A2A] rounded-lg transition-colors focus-within:border-[#E8881A]">
                                <span className="pl-3 text-zinc-600 shrink-0">
                                    <IconScale />
                                </span>
                                <input
                                    className="flex-1 bg-transparent border-none outline-none text-[#E0E0E0] text-sm py-2.5 px-3 font-sans"
                                    type="number"
                                    placeholder="Ex: 75"
                                    value={peso}
                                    onChange={(e) => setPeso(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Altura */}
                        <div>
                            <label className="block text-[11px] font-semibold text-zinc-500 tracking-wide uppercase mb-2">
                                Altura (cm)
                            </label>
                            <div className="flex items-center bg-[#181818] border border-[#2A2A2A] rounded-lg transition-colors focus-within:border-[#E8881A]">
                                <span className="pl-3 text-zinc-600 shrink-0">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                        <path d="M12 2v20M8 6l4-4 4 4M8 18l4 4 4-4" />
                                    </svg>
                                </span>
                                <input
                                    className="flex-1 bg-transparent border-none outline-none text-[#E0E0E0] text-sm py-2.5 px-3 font-sans"
                                    type="number"
                                    placeholder="Ex: 175"
                                    value={altura}
                                    onChange={(e) => setAltura(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Linha: Idade + Gênero */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Idade */}
                        <div>
                            <label className="block text-[11px] font-semibold text-zinc-500 tracking-wide uppercase mb-2">
                                Idade
                            </label>
                            <div className="flex items-center bg-[#181818] border border-[#2A2A2A] rounded-lg transition-colors focus-within:border-[#E8881A]">
                                <span className="pl-3 text-zinc-600 shrink-0">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                        <circle cx="12" cy="12" r="10" />
                                        <polyline points="12 6 12 12 16 14" />
                                    </svg>
                                </span>
                                <input
                                    className="flex-1 bg-transparent border-none outline-none text-[#E0E0E0] text-sm py-2.5 px-3 font-sans"
                                    type="number"
                                    placeholder="Ex: 25"
                                    value={idade}
                                    onChange={(e) => setIdade(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Gênero */}
                        <div>
                            <label className="block text-[11px] font-semibold text-zinc-500 tracking-wide uppercase mb-2">
                                Gênero
                            </label>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    className={`flex-1 py-2.5 px-3 text-sm font-medium rounded-lg border transition-all duration-150 cursor-pointer
                                        ${genero === 'M'
                                            ? 'bg-[#E8881A]/10 border-[#E8881A]/40 text-[#E8881A] shadow-[0_0_12px_rgba(232,136,26,0.15)]'
                                            : 'bg-[#181818] border-[#2A2A2A] text-zinc-400 hover:border-[#E8881A]/40 hover:text-[#E8881A]'
                                        }`}
                                    onClick={() => setGenero('M')}
                                >
                                    Masculino
                                </button>
                                <button
                                    type="button"
                                    className={`flex-1 py-2.5 px-3 text-sm font-medium rounded-lg border transition-all duration-150 cursor-pointer
                                        ${genero === 'F'
                                            ? 'bg-[#E8881A]/10 border-[#E8881A]/40 text-[#E8881A] shadow-[0_0_12px_rgba(232,136,26,0.15)]'
                                            : 'bg-[#181818] border-[#2A2A2A] text-zinc-400 hover:border-[#E8881A]/40 hover:text-[#E8881A]'
                                        }`}
                                    onClick={() => setGenero('F')}
                                >
                                    Feminino
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Select: Nível de Atividade */}
                    <div>
                        <label className="block text-[11px] font-semibold text-zinc-500 tracking-wide uppercase mb-2">
                            Nível de atividade
                        </label>
                        <select
                            className="w-full bg-[#181818] border border-[#2A2A2A] rounded-lg py-2.5 px-3.5 text-sm text-zinc-400 outline-none transition-colors font-sans cursor-pointer appearance-none focus:border-[#E8881A]"
                            onChange={(e) => setAtividade(e.target.value)}
                        >
                            <option value="">Selecione...</option>
                            <option value="1.2">Sedentário (pouco ou nenhum exercício)</option>
                            <option value="1.375">Levemente ativo (1-3 dias/sem)</option>
                            <option value="1.55">Moderadamente ativo (3-5 dias/sem)</option>
                            <option value="1.725">Muito ativo (6-7 dias/sem)</option>
                            <option value="1.9">Extremamente ativo (2x por dia)</option>
                        </select>
                    </div>

                    {/* Objetivo */}
                    <div>
                        <label className="block text-[11px] font-semibold text-zinc-500 tracking-wide uppercase mb-2">
                            Objetivo
                        </label>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                className={`flex-1 py-2.5 px-3 text-sm font-medium rounded-lg border transition-all duration-150 cursor-pointer
                                    ${objetivo === 'emagrecer'
                                        ? 'bg-[#E8881A]/10 border-[#E8881A]/40 text-[#E8881A] shadow-[0_0_12px_rgba(232,136,26,0.15)]'
                                        : 'bg-[#181818] border-[#2A2A2A] text-zinc-400 hover:border-[#E8881A]/40 hover:text-[#E8881A]'
                                    }`}
                                onClick={() => setObjetivo('emagrecer')}
                            >
                                Emagrecer
                            </button>
                            <button
                                type="button"
                                className={`flex-1 py-2.5 px-3 text-sm font-medium rounded-lg border transition-all duration-150 cursor-pointer
                                    ${objetivo === 'manter'
                                        ? 'bg-[#E8881A]/10 border-[#E8881A]/40 text-[#E8881A] shadow-[0_0_12px_rgba(232,136,26,0.15)]'
                                        : 'bg-[#181818] border-[#2A2A2A] text-zinc-400 hover:border-[#E8881A]/40 hover:text-[#E8881A]'
                                    }`}
                                onClick={() => setObjetivo('manter')}
                            >
                                Manter
                            </button>
                            <button
                                type="button"
                                className={`flex-1 py-2.5 px-3 text-sm font-medium rounded-lg border transition-all duration-150 cursor-pointer
                                    ${objetivo === 'ganhar'
                                        ? 'bg-[#E8881A]/10 border-[#E8881A]/40 text-[#E8881A] shadow-[0_0_12px_rgba(232,136,26,0.15)]'
                                        : 'bg-[#181818] border-[#2A2A2A] text-zinc-400 hover:border-[#E8881A]/40 hover:text-[#E8881A]'
                                    }`}
                                onClick={() => setObjetivo('ganhar')}
                            >
                                Ganhar massa
                            </button>
                        </div>
                    </div>
                </div>

                <div className="h-px bg-[#1F1F1F]" />

                {/* Botão */}
                <div className="px-5 sm:px-6 py-4 sm:py-5">
                    <button
                        type="button"
                        className="w-full flex items-center justify-center gap-2 py-3 px-5 text-[14px] font-semibold text-[#111] bg-[#E8881A] border-none rounded-lg cursor-pointer transition-colors duration-150 font-sans hover:bg-[#F09530]"
                        onClick={() => {
                            const resultado = calcularTMB(peso, altura, idade, genero, atividade)
                            setTmb(resultado)
                            setOnCalcular(true)
                            if (onResultado) onResultado(resultado)
                        }}
                    >
                        <IconFlame />
                        Calcular TMB
                    </button>
                </div>

                {/* Resultado (placeholder visual) */}
                <div className="mx-5 sm:mx-6 mb-5 sm:mb-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 px-4 sm:px-5 py-4 rounded-xl bg-[#E8881A]/5 border border-[#E8881A]/15">
                    <div className="flex-1 text-center sm:text-left">
                        <span className="block text-[11px] font-semibold text-zinc-500 tracking-wide uppercase mb-1">TMB Basal</span>
                        <span className="text-2xl font-bold text-[#E8881A] tracking-tight">{onCalcular ? tmb.tmb.toFixed(0) + " kcal" : "- kcal"}</span>
                    </div>
                    <div className="hidden sm:block w-px h-10 bg-[#E8881A]/15" />
                    <div className="flex-1 text-center sm:text-left">
                        <span className="block text-[11px] font-semibold text-zinc-500 tracking-wide uppercase mb-1">Gasto Diário (GET)</span>
                        <span className="text-2xl font-bold text-[#F0F0F0] tracking-tight">{onCalcular ? tmb.get.toFixed(0) + " kcal" : "— kcal"}</span>
                    </div>
                </div>

            </div>
        </div>
    );
}