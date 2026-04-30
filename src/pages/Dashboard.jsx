import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "@/lib/supabase";

const DIAS_SEMANA = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
const OBJETIVO_LABEL = { emagrecer: "Emagrecer", manter: "Manter peso", ganhar: "Ganhar massa" };
const OBJETIVO_COR = {
    emagrecer: { bg: "rgba(239, 68, 68, 0.08)", border: "rgba(239, 68, 68, 0.2)", text: "#F87171" },
    manter: { bg: "rgba(59, 130, 246, 0.08)", border: "rgba(59, 130, 246, 0.2)", text: "#60A5FA" },
    ganhar: { bg: "rgba(34, 197, 94, 0.08)", border: "rgba(34, 197, 94, 0.2)", text: "#4ADE80" },
};

export default function Dashboard() {
    const [perfil, setPerfil] = useState(null)
    const [treinos, setTreinos] = useState([])
    const [refeicoes, setRefeicoes] = useState([])
    const [carregando, setCarregando] = useState(true)
    const navigate = useNavigate()

    const hoje = DIAS_SEMANA[new Date().getDay()]

    useEffect(() => {
        carregarDados()
    }, [])

    async function carregarDados() {
        try {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                navigate("/login")
                return
            }

            const [perfilRes, treinoRes, refeicaoRes] = await Promise.all([
                supabase.from("usuarios").select().eq("id", user.id).single(),
                supabase.from("treinos").select(),
                supabase.from("refeicoes").select(),
            ])

            if (perfilRes.data) setPerfil(perfilRes.data)
            if (treinoRes.data) setTreinos(treinoRes.data)
            if (refeicaoRes.data) setRefeicoes(refeicaoRes.data)
        } catch (error) {
            // silencioso
        } finally {
            setCarregando(false)
        }
    }

    // Dados derivados
    const treinoHoje = treinos.filter(t => t.dia === hoje)
    const refeicaoHoje = refeicoes.filter(r => r.dia === hoje)
    const totalExercicios = treinos.reduce((acc, t) => acc + (t.exercicios?.length || 0), 0)
    const totalRefeicoesSemana = refeicoes.length

    const macrosHoje = refeicaoHoje.reduce((acc, ref) => {
        (ref.alimentos || []).forEach(al => {
            acc.calorias += Number(al.calorias || 0)
            acc.proteinas += Number(al.proteina || 0)
            acc.carboidratos += Number(al.carboidrato || 0)
            acc.gorduras += Number(al.gordura || 0)
        })
        return acc
    }, { calorias: 0, proteinas: 0, carboidratos: 0, gorduras: 0 })

    return (
        <div className="min-h-screen bg-fundo">
            <Sidebar />
            <div className="lg:ml-64 flex flex-col min-h-screen">
                <Header />
                <main className="flex flex-col pb-24 lg:pb-0">
                    <div className="flex justify-center items-start pt-6 sm:pt-10 px-3 sm:px-4 pb-6 font-sans">
                        <div className="w-full max-w-[700px] flex flex-col gap-4">

                            {/* Saudação */}
                            <div className="flex flex-col gap-1 px-1">
                                <h1 className="text-xl sm:text-2xl font-bold text-[#F0F0F0] tracking-tight">
                                    {carregando ? "Carregando..." : `Olá, ${perfil?.nome || "Atleta"} 👋`}
                                </h1>
                                <p className="text-sm text-zinc-500">
                                    Aqui está o resumo do seu dia — <span className="text-[#E8881A] font-medium">{hoje}</span>
                                </p>
                            </div>

                            {/* Perfil rápido */}
                            {perfil && (
                                <div className="flex flex-col bg-[#161616] border border-[#222] rounded-2xl overflow-hidden">
                                    <div className="h-1 w-full bg-gradient-to-r from-[#E8881A] to-[#F09530]" />
                                    <div className="flex items-center gap-3 px-5 pt-5 pb-4">
                                        <div className="w-10 h-10 bg-[#E8881A]/10 border border-[#E8881A]/20 rounded-xl flex items-center justify-center text-[#E8881A] shrink-0">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                                                <circle cx="12" cy="7" r="4" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h2 className="text-[17px] font-semibold text-[#F0F0F0] tracking-tight leading-snug">
                                                Meu Perfil
                                            </h2>
                                            <p className="text-xs text-zinc-500 mt-0.5">Seus dados cadastrados</p>
                                        </div>
                                    </div>
                                    <div className="h-px bg-[#1F1F1F]" />
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-5 py-5">
                                        <StatItem label="Peso" value={`${perfil.peso} kg`} />
                                        <StatItem label="Altura" value={`${perfil.altura} cm`} />
                                        <StatItem label="Objetivo" value={OBJETIVO_LABEL[perfil.objetivo] || "—"} cor={OBJETIVO_COR[perfil.objetivo]} />
                                        <StatItem label="IMC" value={perfil.peso && perfil.altura
                                            ? (perfil.peso / ((perfil.altura / 100) ** 2)).toFixed(1)
                                            : "—"} />
                                    </div>
                                    <div className="flex items-center justify-end px-5 py-3 bg-[#131313] border-t border-[#1A1A1A]">
                                        <a href="/perfil" className="text-[12px] font-semibold text-[#E8881A] hover:underline">
                                            Editar perfil →
                                        </a>
                                    </div>
                                </div>
                            )}

                            {!perfil && !carregando && (
                                <div className="flex flex-col bg-[#161616] border border-[#222] rounded-2xl overflow-hidden">
                                    <div className="h-1 w-full bg-gradient-to-r from-[#E8881A] to-[#F09530]" />
                                    <div className="flex flex-col items-center justify-center py-10 px-5 gap-3">
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-zinc-600">
                                            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                                            <circle cx="12" cy="7" r="4" />
                                        </svg>
                                        <p className="text-sm text-zinc-500">Você ainda não configurou seu perfil</p>
                                        <a href="/perfil" className="text-[13px] font-semibold text-[#E8881A] hover:underline">
                                            Configurar agora →
                                        </a>
                                    </div>
                                </div>
                            )}

                            {/* Resumo Nutricional do Dia */}
                            <div className="flex flex-col bg-[#161616] border border-[#222] rounded-2xl overflow-hidden">
                                <div className="h-1 w-full bg-gradient-to-r from-[#E8881A] to-[#F09530]" />
                                <div className="flex items-center justify-between px-5 pt-5 pb-4 gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-[#E8881A]/10 border border-[#E8881A]/20 rounded-xl flex items-center justify-center text-[#E8881A] shrink-0">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M18 20V10M12 20V4M6 20v-6" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h2 className="text-[17px] font-semibold text-[#F0F0F0] tracking-tight leading-snug">
                                                Dieta de Hoje
                                            </h2>
                                            <p className="text-xs text-zinc-500 mt-0.5">
                                                {refeicaoHoje.length} refeição(ões) · {hoje}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="h-px bg-[#1F1F1F]" />

                                {refeicaoHoje.length > 0 ? (
                                    <>
                                        {/* Calorias destaque */}
                                        <div className="px-5 py-5">
                                            <div className="flex items-center gap-3 px-4 py-4 rounded-xl bg-[#E8881A]/5 border border-[#E8881A]/15">
                                                <div className="w-9 h-9 rounded-lg bg-[#E8881A]/15 flex items-center justify-center text-[#E8881A] shrink-0">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <span className="block text-[11px] font-semibold text-zinc-500 tracking-wide uppercase">Calorias Hoje</span>
                                                    <span className="text-2xl font-bold text-[#E8881A] tracking-tight">{macrosHoje.calorias} <span className="text-sm text-zinc-500 font-medium">kcal</span></span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Macros grid */}
                                        <div className="grid grid-cols-3 gap-3 px-5 pb-5">
                                            <MacroMini label="Proteína" valor={macrosHoje.proteinas} cor="#60A5FA" bg="rgba(59,130,246,0.08)" border="rgba(59,130,246,0.2)" />
                                            <MacroMini label="Carboidrato" valor={macrosHoje.carboidratos} cor="#4ADE80" bg="rgba(34,197,94,0.08)" border="rgba(34,197,94,0.2)" />
                                            <MacroMini label="Gordura" valor={macrosHoje.gorduras} cor="#FACC15" bg="rgba(234,179,8,0.08)" border="rgba(234,179,8,0.2)" />
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-10 text-zinc-600">
                                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                                            <path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3" />
                                        </svg>
                                        <span className="mt-3 text-sm">Nenhuma refeição para hoje</span>
                                    </div>
                                )}

                                <div className="flex items-center justify-end px-5 py-3 bg-[#131313] border-t border-[#1A1A1A]">
                                    <a href="/dieta" className="text-[12px] font-semibold text-[#E8881A] hover:underline">
                                        Ver plano alimentar →
                                    </a>
                                </div>
                            </div>

                            {/* Treino do Dia */}
                            <div className="flex flex-col bg-[#161616] border border-[#222] rounded-2xl overflow-hidden">
                                <div className="h-1 w-full bg-gradient-to-r from-[#E8881A] to-[#F09530]" />
                                <div className="flex items-center justify-between px-5 pt-5 pb-4 gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-[#E8881A]/10 border border-[#E8881A]/20 rounded-xl flex items-center justify-center text-[#E8881A] shrink-0">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M6 4v16M18 4v16M2 8h4M18 8h4M2 16h4M18 16h4" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h2 className="text-[17px] font-semibold text-[#F0F0F0] tracking-tight leading-snug">
                                                Treino de Hoje
                                            </h2>
                                            <p className="text-xs text-zinc-500 mt-0.5">
                                                {treinoHoje.length} treino(s) · {hoje}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="h-px bg-[#1F1F1F]" />

                                {treinoHoje.length > 0 ? (
                                    <div className="flex flex-col gap-3 px-5 py-5">
                                        {treinoHoje.map(treino => {
                                            const totalSeries = treino.exercicios.reduce((a, e) => a + Number(e.series || 0), 0)
                                            const volumeTotal = treino.exercicios.reduce((a, e) => {
                                                return a + (Number(e.series || 0) * Number(e.repeticoes || 0) * Number(e.carga || 0))
                                            }, 0)

                                            return (
                                                <div key={treino.id} className="flex flex-col bg-[#1A1A1A] border border-[#252525] rounded-xl overflow-hidden">
                                                    <div className="flex items-center justify-between px-4 py-3">
                                                        <div className="flex items-center gap-2.5">
                                                            <span className="text-[13px] font-semibold text-[#E0E0E0]">{treino.nome}</span>
                                                            <span className="text-[11px] text-zinc-600">•</span>
                                                            <span className="text-[11px] font-medium text-[#E8881A]">{treino.exercicios.length} exercícios</span>
                                                        </div>
                                                    </div>
                                                    <div className="border-t border-[#222] px-4 py-2.5 flex flex-col gap-1.5">
                                                        {treino.exercicios.slice(0, 4).map((ex, i) => (
                                                            <div key={i} className="flex items-center justify-between">
                                                                <span className="text-[12px] text-zinc-400 truncate">{ex.nome || "—"}</span>
                                                                <span className="inline-flex items-center px-2 py-[2px] rounded-md text-[11px] font-semibold bg-[#E8881A]/10 border border-[#E8881A]/20 text-[#E8881A] shrink-0">
                                                                    {ex.series}×{ex.repeticoes}
                                                                </span>
                                                            </div>
                                                        ))}
                                                        {treino.exercicios.length > 4 && (
                                                            <span className="text-[11px] text-zinc-600">+{treino.exercicios.length - 4} exercício(s)</span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center justify-between px-4 py-2.5 bg-[#151515] border-t border-[#1F1F1F]">
                                                        <span className="text-[11px] text-zinc-500">{totalSeries} séries totais</span>
                                                        <span className="text-[12px] font-bold text-[#E8881A]">{volumeTotal.toLocaleString("pt-BR")} kg vol.</span>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-10 text-zinc-600">
                                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M6 4v16M18 4v16M2 8h4M18 8h4M2 16h4M18 16h4" />
                                        </svg>
                                        <span className="mt-3 text-sm">Nenhum treino para hoje</span>
                                        <span className="text-[11px] text-zinc-700 mt-1">Dia de descanso? 💤</span>
                                    </div>
                                )}

                                <div className="flex items-center justify-end px-5 py-3 bg-[#131313] border-t border-[#1A1A1A]">
                                    <a href="/treino" className="text-[12px] font-semibold text-[#E8881A] hover:underline">
                                        Ver treinos →
                                    </a>
                                </div>
                            </div>

                            {/* Resumo geral da semana */}
                            <div className="flex flex-col bg-[#161616] border border-[#222] rounded-2xl overflow-hidden">
                                <div className="h-1 w-full bg-gradient-to-r from-[#E8881A] to-[#F09530]" />
                                <div className="flex items-center gap-3 px-5 pt-5 pb-4">
                                    <div className="w-10 h-10 bg-[#E8881A]/10 border border-[#E8881A]/20 rounded-xl flex items-center justify-center text-[#E8881A] shrink-0">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                            <line x1="16" y1="2" x2="16" y2="6" />
                                            <line x1="8" y1="2" x2="8" y2="6" />
                                            <line x1="3" y1="10" x2="21" y2="10" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-[17px] font-semibold text-[#F0F0F0] tracking-tight leading-snug">
                                            Visão Semanal
                                        </h2>
                                        <p className="text-xs text-zinc-500 mt-0.5">Resumo geral da sua semana</p>
                                    </div>
                                </div>
                                <div className="h-px bg-[#1F1F1F]" />
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-5 py-5">
                                    <StatItem label="Treinos" value={treinos.length} />
                                    <StatItem label="Exercícios" value={totalExercicios} />
                                    <StatItem label="Refeições" value={totalRefeicoesSemana} />
                                    <StatItem label="Dias c/ treino" value={[...new Set(treinos.map(t => t.dia))].length} suffix="/7" />
                                </div>

                                {/* Mini mapa da semana */}
                                <div className="px-5 pb-5">
                                    <div className="flex gap-1.5 overflow-x-auto">
                                        {DIAS_SEMANA.map((dia, i) => {
                                            // Pula Domingo como primeiro, reordena pra Segunda primeiro
                                            const diaOrdenado = DIAS_SEMANA[(i + 1) % 7]
                                            const temTreino = treinos.some(t => t.dia === diaOrdenado)
                                            const temRefeicao = refeicoes.some(r => r.dia === diaOrdenado)
                                            const isHoje = diaOrdenado === hoje

                                            return (
                                                <div
                                                    key={diaOrdenado}
                                                    className={`flex-1 min-w-[40px] flex flex-col items-center gap-1.5 py-2.5 px-1 rounded-lg border text-center transition-all
                                                        ${isHoje
                                                            ? 'bg-[#E8881A]/10 border-[#E8881A]/30'
                                                            : 'bg-[#1A1A1A] border-[#252525]'
                                                        }`}
                                                >
                                                    <span className={`text-[10px] font-semibold uppercase tracking-wide ${isHoje ? 'text-[#E8881A]' : 'text-zinc-500'}`}>
                                                        {diaOrdenado.slice(0, 3)}
                                                    </span>
                                                    <div className="flex gap-1">
                                                        {temTreino && (
                                                            <span className="w-2 h-2 rounded-full bg-[#E8881A]" title="Treino" />
                                                        )}
                                                        {temRefeicao && (
                                                            <span className="w-2 h-2 rounded-full bg-green-500" title="Refeição" />
                                                        )}
                                                        {!temTreino && !temRefeicao && (
                                                            <span className="w-2 h-2 rounded-full bg-zinc-700" />
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <div className="flex items-center gap-4 mt-3 px-1">
                                        <span className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                                            <span className="w-2 h-2 rounded-full bg-[#E8881A]" /> Treino
                                        </span>
                                        <span className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                                            <span className="w-2 h-2 rounded-full bg-green-500" /> Refeição
                                        </span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

function StatItem({ label, value, suffix = "", cor = null }) {
    return (
        <div
            className="flex flex-col gap-1 p-3 rounded-xl border"
            style={cor ? { background: cor.bg, borderColor: cor.border } : { background: "#1A1A1A", borderColor: "#252525" }}
        >
            <span className="text-[10px] font-semibold text-zinc-500 tracking-wide uppercase">{label}</span>
            <span
                className="text-lg font-bold tracking-tight"
                style={cor ? { color: cor.text } : { color: "#F0F0F0" }}
            >
                {value}{suffix && <span className="text-zinc-600 text-sm font-medium">{suffix}</span>}
            </span>
        </div>
    )
}

function MacroMini({ label, valor, cor, bg, border }) {
    return (
        <div className="flex flex-col items-center gap-1 p-3 rounded-xl border" style={{ background: bg, borderColor: border }}>
            <span className="text-[10px] font-semibold tracking-wide uppercase" style={{ color: cor }}>{label}</span>
            <span className="text-lg font-bold tracking-tight" style={{ color: cor }}>{valor}<span className="text-xs text-zinc-500 font-medium">g</span></span>
        </div>
    )
}
