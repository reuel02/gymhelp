import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import supabase from "../lib/supabase"

export default function RedefinirSenha() {
    const [novaSenha, setNovaSenha] = useState("")
    const [confirmarSenha, setConfirmarSenha] = useState("")
    const [salvando, setSalvando] = useState(false)
    const [erro, setErro] = useState("")
    const [sucesso, setSucesso] = useState(false)
    const [sessaoValida, setSessaoValida] = useState(false)
    const [verificando, setVerificando] = useState(true)

    const navigate = useNavigate()

    useEffect(() => {
        // O Supabase automaticamente processa o token do hash da URL
        // e estabelece uma sessão de recovery
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === "PASSWORD_RECOVERY") {
                setSessaoValida(true)
                setVerificando(false)
            }
        })

        // Verificar se já há uma sessão ativa (caso o evento já tenha disparado)
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                setSessaoValida(true)
            }
            setVerificando(false)
        })

        return () => subscription.unsubscribe()
    }, [])

    async function handleRedefinir(e) {
        e.preventDefault()
        setErro("")

        if (!novaSenha || !confirmarSenha) {
            setErro("Preencha todos os campos.")
            return
        }

        if (novaSenha.length < 6) {
            setErro("A senha deve ter no mínimo 6 caracteres.")
            return
        }

        if (novaSenha !== confirmarSenha) {
            setErro("As senhas não coincidem.")
            return
        }

        setSalvando(true)

        try {
            const { error } = await supabase.auth.updateUser({
                password: novaSenha,
            })

            if (error) throw error

            setSucesso(true)

            // Redirecionar para o login após 3 segundos
            setTimeout(() => {
                navigate("/login")
            }, 3000)
        } catch (error) {
            setErro(error.message)
        } finally {
            setSalvando(false)
        }
    }

    // Loading
    if (verificando) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-[#111] p-4 font-sans">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-[#E8881A] border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm text-zinc-500">Verificando link...</span>
                </div>
            </div>
        )
    }

    // Link inválido ou expirado
    if (!sessaoValida && !verificando) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-[#111] p-4 font-sans">
                <div className="w-full max-w-[400px] flex flex-col items-center bg-[#161616] border border-[#222] rounded-2xl shadow-2xl p-6 sm:p-8 gap-4">
                    <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M15 9l-6 6M9 9l6 6" />
                        </svg>
                    </div>
                    <div className="text-center">
                        <p className="text-[15px] font-semibold text-[#F0F0F0] mb-1">Link inválido ou expirado</p>
                        <p className="text-sm text-zinc-500 leading-relaxed">
                            O link de redefinição pode ter expirado. Solicite um novo link.
                        </p>
                    </div>
                    <a
                        href="/esqueci-senha"
                        className="mt-2 w-full text-center py-3 px-5 text-[14px] font-semibold text-[#111] bg-[#E8881A] rounded-lg transition-colors duration-150 hover:bg-[#F09530]"
                    >
                        Solicitar novo link
                    </a>
                    <a href="/login" className="text-sm text-zinc-500 hover:text-[#E8881A] transition-colors">
                        Voltar para o login
                    </a>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex justify-center items-center bg-[#111] p-4 font-sans">
            <div className="w-full max-w-[400px] flex flex-col bg-[#161616] border border-[#222] rounded-2xl shadow-2xl p-6 sm:p-8">

                {/* Header */}
                <div className="flex flex-col items-center mb-8">
                    <span className="w-[48px] h-[48px] bg-[#E8881A]/10 border border-[#E8881A]/20 rounded-xl flex items-center justify-center mb-4">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E8881A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
                        </svg>
                    </span>
                    <h2 className="text-2xl font-bold text-[#F0F0F0] tracking-tight mb-1">Redefinir senha</h2>
                    <p className="text-sm text-zinc-500 text-center">
                        Escolha uma nova senha para sua conta.
                    </p>
                </div>

                {sucesso ? (
                    /* Estado de sucesso */
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-14 h-14 bg-[#4ADE80]/10 border border-[#4ADE80]/20 rounded-full flex items-center justify-center">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </div>
                        <div className="text-center">
                            <p className="text-[15px] font-semibold text-[#F0F0F0] mb-1">Senha redefinida!</p>
                            <p className="text-sm text-zinc-500 leading-relaxed">
                                Sua senha foi alterada com sucesso. Você será redirecionado para o login em instantes...
                            </p>
                        </div>
                        <div className="w-6 h-6 border-2 border-[#4ADE80] border-t-transparent rounded-full animate-spin mt-2" />
                    </div>
                ) : (
                    /* Formulário */
                    <form className="flex flex-col gap-4" onSubmit={handleRedefinir}>
                        {/* Nova Senha */}
                        <div>
                            <label className="block text-xs font-semibold text-zinc-500 tracking-wide uppercase mb-2">
                                Nova senha
                            </label>
                            <input
                                className="w-full bg-[#181818] border border-[#2A2A2A] rounded-lg py-2.5 px-3.5 text-sm text-[#E0E0E0] outline-none transition-colors duration-150 font-sans box-border focus:border-[#E8881A] focus:bg-[#1E1E1E]"
                                type="password"
                                placeholder="••••••••"
                                required
                                minLength={6}
                                value={novaSenha}
                                onChange={(e) => setNovaSenha(e.target.value)}
                            />
                            <p className="mt-2 text-[11px] text-zinc-500">Mínimo de 6 caracteres.</p>
                        </div>

                        {/* Confirmar Senha */}
                        <div>
                            <label className="block text-xs font-semibold text-zinc-500 tracking-wide uppercase mb-2">
                                Confirmar nova senha
                            </label>
                            <input
                                className="w-full bg-[#181818] border border-[#2A2A2A] rounded-lg py-2.5 px-3.5 text-sm text-[#E0E0E0] outline-none transition-colors duration-150 font-sans box-border focus:border-[#E8881A] focus:bg-[#1E1E1E]"
                                type="password"
                                placeholder="••••••••"
                                required
                                minLength={6}
                                value={confirmarSenha}
                                onChange={(e) => setConfirmarSenha(e.target.value)}
                            />
                        </div>

                        {erro && (
                            <div className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg bg-red-500/5 border border-red-500/15">
                                <svg className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M12 16v-4M12 8h.01" />
                                </svg>
                                <p className="text-[11px] text-red-400">{erro}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={salvando}
                            className="w-full mt-2 py-3 px-5 text-[14px] font-semibold text-[#111] bg-[#E8881A] border-none rounded-lg cursor-pointer transition-colors duration-150 font-sans hover:bg-[#F09530] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {salvando ? "Salvando..." : "Redefinir senha"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}
