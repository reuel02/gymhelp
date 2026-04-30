import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "@/lib/supabase";

function IconUser() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
            <circle cx="12" cy="7" r="4" />
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

function IconCheck() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}

export default function Perfil() {
    const [nome, setNome] = useState('')
    const [peso, setPeso] = useState('')
    const [altura, setAltura] = useState('')
    const [objetivo, setObjetivo] = useState('')
    const [salvando, setSalvando] = useState(false)
    const [perfilExiste, setPerfilExiste] = useState(false)
    const [carregando, setCarregando] = useState(true)

    const navigate = useNavigate()

    useEffect(() => {
        carregarPerfil()
    }, [])

    async function carregarPerfil() {
        try {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                alert("Necessário fazer login")
                navigate("/login")
                return
            }

            const { data, error } = await supabase
                .from("usuarios")
                .select()
                .eq("id", user.id)
                .single()

            if (data) {
                setNome(data.nome || '')
                setPeso(data.peso || '')
                setAltura(data.altura || '')
                setObjetivo(data.objetivo || '')
                setPerfilExiste(true)
            }
        } catch (error) {
            // Perfil ainda não existe, tudo bem
        } finally {
            setCarregando(false)
        }
    }

    async function salvarPerfil() {
        if (salvando) return
        setSalvando(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error("Usuário não está logado.")

            const perfil = {
                id: user.id,
                nome,
                peso: Number(peso),
                altura: Number(altura),
                objetivo,
            }

            if (perfilExiste) {
                const { error } = await supabase
                    .from("usuarios")
                    .update({ nome, peso: Number(peso), altura: Number(altura), objetivo })
                    .eq("id", user.id)

                if (error) throw error
            } else {
                const { error } = await supabase
                    .from("usuarios")
                    .insert(perfil)

                if (error) throw error
                setPerfilExiste(true)
            }

            alert("Perfil salvo com sucesso!")
        } catch (error) {
            alert("Erro ao salvar perfil: " + error.message)
        } finally {
            setSalvando(false)
        }
    }

    if (carregando) {
        return (
            <div className="min-h-screen bg-fundo">
                <Sidebar />
                <div className="lg:ml-64 flex flex-col min-h-screen">
                    <Header />
                    <main className="flex items-center justify-center flex-1">
                        <span className="text-zinc-500 text-sm">Carregando...</span>
                    </main>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-fundo">
            <Sidebar />
            <div className="lg:ml-64 flex flex-col min-h-screen">
                <Header />
                <main className="flex flex-col pb-24 lg:pb-0">
                    <div className="flex justify-center items-start pt-6 sm:pt-10 px-3 sm:px-4 pb-6 font-sans">
                        <div className="w-full max-w-[700px] flex flex-col bg-[#161616] border border-[#222] rounded-2xl overflow-hidden">

                            {/* Barra top */}
                            <div className="h-1 w-full bg-gradient-to-r from-[#E8881A] to-[#F09530]" />

                            {/* Header */}
                            <div className="flex items-center gap-3 px-5 sm:px-6 pt-5 sm:pt-6 pb-4">
                                <div className="w-10 h-10 bg-[#E8881A]/10 border border-[#E8881A]/20 rounded-xl flex items-center justify-center text-[#E8881A] shrink-0">
                                    <IconUser />
                                </div>
                                <div>
                                    <h2 className="text-[17px] font-semibold text-[#F0F0F0] tracking-tight leading-snug">
                                        Meu Perfil
                                    </h2>
                                    <p className="text-xs text-zinc-500 mt-0.5">
                                        {perfilExiste ? "Atualize seus dados" : "Complete seu cadastro"}
                                    </p>
                                </div>
                            </div>

                            <div className="h-px bg-[#1F1F1F]" />

                            {/* Campos */}
                            <div className="flex flex-col gap-5 px-5 sm:px-6 py-5 sm:py-6">

                                {/* Nome */}
                                <div>
                                    <label className="block text-[11px] font-semibold text-zinc-500 tracking-wide uppercase mb-2">
                                        Nome
                                    </label>
                                    <div className="flex items-center bg-[#181818] border border-[#2A2A2A] rounded-lg transition-colors focus-within:border-[#E8881A]">
                                        <span className="pl-3 text-zinc-600 shrink-0">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                                                <circle cx="12" cy="7" r="4" />
                                            </svg>
                                        </span>
                                        <input
                                            className="flex-1 bg-transparent border-none outline-none text-[#E0E0E0] text-sm py-2.5 px-3 font-sans"
                                            type="text"
                                            placeholder="Seu nome completo"
                                            value={nome}
                                            onChange={(e) => setNome(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Peso + Altura */}
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

                            {/* Botão Salvar */}
                            <div className="px-5 sm:px-6 py-4 sm:py-5">
                                <button
                                    type="button"
                                    className="w-full flex items-center justify-center gap-2 py-3 px-5 text-[14px] font-semibold text-[#111] bg-[#E8881A] border-none rounded-lg cursor-pointer transition-colors duration-150 font-sans hover:bg-[#F09530] disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={salvarPerfil}
                                    disabled={salvando}
                                >
                                    <IconCheck />
                                    {salvando ? "Salvando..." : "Salvar Perfil"}
                                </button>
                            </div>

                            {/* Info card */}
                            <div className="mx-5 sm:mx-6 mb-5 sm:mb-6 flex items-start gap-3 px-4 py-3.5 rounded-xl bg-blue-500/5 border border-blue-500/15">
                                <svg className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M12 16v-4M12 8h.01" />
                                </svg>
                                <p className="text-[12px] text-zinc-400 leading-relaxed">
                                    Seus dados de peso, altura e objetivo serão usados para calcular sua TMB
                                    e definir a meta calórica diária no <span className="text-blue-400 font-medium">Resumo Nutricional</span>.
                                </p>
                            </div>

                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
