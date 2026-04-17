import { useState } from "react"
import supabase from "../lib/supabase"
import { useNavigate, Link } from "react-router-dom"

export function Cadastro() {
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const [nome, setNome] = useState("")
    const navigate = useNavigate()

    async function fazerCadastro() {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password: senha
            })

            if (error) {
                throw error
            }

            const id = data.user.id

            const insert = await supabase.from('usuarios').insert({ id, nome })

            alert("Conta criada com sucesso! Faça login agora.")
            navigate("/login")
        } catch (error) {
            alert("Erro ao cadastrar: " + error.message)
        }
    }

    return (
        <div className="min-h-screen flex justify-center items-center bg-[#111] p-4 font-sans">
            <div className="w-full max-w-[400px] flex flex-col bg-[#161616] border border-[#222] rounded-2xl shadow-2xl p-6 sm:p-8">

                {/* Header do Cadastro */}
                <div className="flex flex-col items-center mb-8">
                    <span className="w-[48px] h-[48px] bg-[#E8881A]/10 border border-[#E8881A]/20 rounded-xl flex items-center justify-center mb-4">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E8881A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <line x1="19" y1="8" x2="19" y2="14"></line>
                            <line x1="22" y1="11" x2="16" y2="11"></line>
                        </svg>
                    </span>
                    <h2 className="text-2xl font-bold text-[#F0F0F0] tracking-tight mb-1">Crie sua conta</h2>
                    <p className="text-sm text-zinc-500">Comece a evoluir seus treinos hoje</p>
                </div>

                {/* Formulário */}
                <form className="flex flex-col gap-4">
                    {/* Input Nome */}
                    <div>
                        <label className="block text-xs font-semibold text-zinc-500 tracking-wide uppercase mb-2">
                            Nome completo
                        </label>
                        <input
                            className="w-full bg-[#181818] border border-[#2A2A2A] rounded-lg py-2.5 px-3.5 text-sm text-[#E0E0E0] outline-none transition-colors duration-150 font-sans box-border focus:border-[#E8881A] focus:bg-[#1E1E1E]"
                            type="text"
                            placeholder="João Silva"
                            onChange={(e) => setNome(e.target.value)}
                        />
                    </div>

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
                        <label className="block text-xs font-semibold text-zinc-500 tracking-wide uppercase mb-2">
                            Senha
                        </label>
                        <input
                            className="w-full bg-[#181818] border border-[#2A2A2A] rounded-lg py-2.5 px-3.5 text-sm text-[#E0E0E0] outline-none transition-colors duration-150 font-sans box-border focus:border-[#E8881A] focus:bg-[#1E1E1E]"
                            type="password"
                            placeholder="••••••••"
                            onChange={(e) => setSenha(e.target.value)}
                        />
                        <p className="mt-2 text-[11px] text-zinc-500">A senha deve ter no mínimo 6 caracteres.</p>
                    </div>

                    {/* Botão de Ação */}
                    <button className="w-full mt-2 py-3 px-5 text-[14px] font-semibold text-[#111] bg-[#E8881A] border-none rounded-lg cursor-pointer transition-colors duration-150 font-sans hover:bg-[#F09530]"
                        onClick={fazerCadastro}
                    >
                        Criar minha conta
                    </button>
                </form>

                {/* Rodapé Toggle */}
                <div className="mt-8 text-center text-sm text-zinc-500">
                    Já tem uma conta?{' '}
                    <Link to="/login" className="font-semibold text-[#E0E0E0] hover:text-[#E8881A] transition-colors">
                        Fazer login
                    </Link>
                </div>
            </div>
        </div>
    );
}