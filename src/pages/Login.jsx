import { useState } from "react"
import supabase from "../lib/supabase"
import { useNavigate, Link } from "react-router-dom"

export default function Login() {
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const navigate = useNavigate()

    async function fazerLogin() {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password: senha
            })

            alert("Logado com sucesso!")
            navigate("/")
        } catch (error) {
            alert("Erro ao entrar: " + error.message)
        }
    }

    return (
        <div className="min-h-screen flex justify-center items-center bg-[#111] p-4 font-sans">
            <div className="w-full max-w-[400px] flex flex-col bg-[#161616] border border-[#222] rounded-2xl shadow-2xl p-6 sm:p-8">

                {/* Header do Login */}
                <div className="flex flex-col items-center mb-8">
                    <span className="w-[48px] h-[48px] bg-[#E8881A]/10 border border-[#E8881A]/20 rounded-xl flex items-center justify-center mb-4">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E8881A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                        </svg>
                    </span>
                    <h2 className="text-2xl font-bold text-[#F0F0F0] tracking-tight mb-1">Bem-vindo de volta</h2>
                    <p className="text-sm text-zinc-500">Entre com seus dados para acessar seus treinos</p>
                </div>

                {/* Formulário */}
                <div className="flex flex-col gap-4">
                    {/* Input E-mail */}
                    <div>
                        <label className="block text-xs font-semibold text-zinc-500 tracking-wide uppercase mb-2">
                            E-mail
                        </label>
                        <input
                            className="w-full bg-[#181818] border border-[#2A2A2A] rounded-lg py-2.5 px-3.5 text-sm text-[#E0E0E0] outline-none transition-colors duration-150 font-sans box-border focus:border-[#E8881A] focus:bg-[#1E1E1E]"
                            type="email"
                            placeholder="seu@email.com"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {/* Input Senha */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-xs font-semibold text-zinc-500 tracking-wide uppercase">
                                Senha
                            </label>
                        </div>
                        <input
                            className="w-full bg-[#181818] border border-[#2A2A2A] rounded-lg py-2.5 px-3.5 text-sm text-[#E0E0E0] outline-none transition-colors duration-150 font-sans box-border focus:border-[#E8881A] focus:bg-[#1E1E1E]"
                            type="password"
                            placeholder="••••••••"
                            onChange={(e) => setSenha(e.target.value)}
                        />
                    </div>

                    {/* Botão de Ação */}
                    <button className="w-full mt-2 py-3 px-5 text-[14px] font-semibold text-[#111] bg-[#E8881A] border-none rounded-lg cursor-pointer transition-colors duration-150 font-sans hover:bg-[#F09530]"
                        onClick={fazerLogin}
                    >
                        Entrar na conta
                    </button>
                </div>

                {/* Rodapé Toggle */}
                <div className="mt-8 text-center text-sm text-zinc-500">
                    Não tem uma conta?{' '}
                    <Link to="/cadastro" className="font-semibold text-[#E0E0E0] hover:text-[#E8881A] transition-colors">
                        Cadastre-se
                    </Link>
                </div>
            </div>
        </div>
    )
}