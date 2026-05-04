import { useState } from "react"
import { Link } from "react-router-dom"
import supabase from "../lib/supabase"

export default function EsqueciSenha() {
    const [email, setEmail] = useState("")
    const [enviando, setEnviando] = useState(false)
    const [enviado, setEnviado] = useState(false)
    const [erro, setErro] = useState("")

    async function handleEnviar(e) {
        e.preventDefault()
        setErro("")

        if (!email) {
            setErro("Informe seu e-mail.")
            return
        }

        setEnviando(true)

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/redefinir-senha`,
            })

            if (error) throw error

            setEnviado(true)
        } catch (error) {
            setErro(error.message)
        } finally {
            setEnviando(false)
        }
    }

    return (
        <div className="min-h-screen flex justify-center items-center bg-[#111] p-4 font-sans">
            <div className="w-full max-w-[400px] flex flex-col bg-[#161616] border border-[#222] rounded-2xl shadow-2xl p-6 sm:p-8">

                {/* Header */}
                <div className="flex flex-col items-center mb-8">
                    <span className="w-[48px] h-[48px] bg-[#E8881A]/10 border border-[#E8881A]/20 rounded-xl flex items-center justify-center mb-4">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E8881A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                    </span>
                    <h2 className="text-2xl font-bold text-[#F0F0F0] tracking-tight mb-1">Esqueceu sua senha?</h2>
                    <p className="text-sm text-zinc-500 text-center">
                        Informe seu e-mail e enviaremos um link para redefinir sua senha.
                    </p>
                </div>

                {enviado ? (
                    /* Estado de sucesso */
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-14 h-14 bg-[#4ADE80]/10 border border-[#4ADE80]/20 rounded-full flex items-center justify-center">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </div>
                        <div className="text-center">
                            <p className="text-[15px] font-semibold text-[#F0F0F0] mb-1">E-mail enviado!</p>
                            <p className="text-sm text-zinc-500 leading-relaxed">
                                Verifique sua caixa de entrada (e spam) em <span className="text-[#E8881A] font-medium">{email}</span> e clique no link para redefinir sua senha.
                            </p>
                        </div>
                        <Link
                            to="/login"
                            className="mt-4 w-full text-center py-3 px-5 text-[14px] font-semibold text-[#111] bg-[#E8881A] rounded-lg transition-colors duration-150 hover:bg-[#F09530]"
                        >
                            Voltar para o login
                        </Link>
                    </div>
                ) : (
                    /* Formulário */
                    <form className="flex flex-col gap-4" onSubmit={handleEnviar}>
                        <div>
                            <label className="block text-xs font-semibold text-zinc-500 tracking-wide uppercase mb-2">
                                E-mail
                            </label>
                            <input
                                className="w-full bg-[#181818] border border-[#2A2A2A] rounded-lg py-2.5 px-3.5 text-sm text-[#E0E0E0] outline-none transition-colors duration-150 font-sans box-border focus:border-[#E8881A] focus:bg-[#1E1E1E]"
                                type="email"
                                placeholder="seu@email.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                            disabled={enviando}
                            className="w-full mt-2 py-3 px-5 text-[14px] font-semibold text-[#111] bg-[#E8881A] border-none rounded-lg cursor-pointer transition-colors duration-150 font-sans hover:bg-[#F09530] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {enviando ? "Enviando..." : "Enviar link de redefinição"}
                        </button>
                    </form>
                )}

                {/* Rodapé */}
                {!enviado && (
                    <div className="mt-8 text-center text-sm text-zinc-500">
                        Lembrou sua senha?{' '}
                        <Link to="/login" className="font-semibold text-[#E0E0E0] hover:text-[#E8881A] transition-colors">
                            Fazer login
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
