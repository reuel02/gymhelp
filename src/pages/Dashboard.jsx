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

// Helper para chave do localStorage por dia
function getHojeKey(prefixo = 'agua') {
    const d = new Date()
    return `${prefixo}_${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// Chave semanal — reseta todo domingo (baseada na segunda-feira da semana)
function getSemanaKey() {
    const d = new Date()
    const dia = d.getDay() // 0=Dom
    // Se domingo, a semana anterior já acabou — nova semana começa
    const diffToSeg = dia === 0 ? -6 : 1 - dia
    const segunda = new Date(d)
    segunda.setDate(d.getDate() + diffToSeg)
    return `treino_semana_${segunda.getFullYear()}-${String(segunda.getMonth() + 1).padStart(2, '0')}-${String(segunda.getDate()).padStart(2, '0')}`
}

// Limpa chaves antigas do localStorage (agua_ e dieta_)
function limparDadosAntigos() {
    const hoje = new Date()
    const semanaAtual = getSemanaKey()
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith('treino_semana_') && key !== semanaAtual) {
            localStorage.removeItem(key)
            return
        }
        if (!key.startsWith('agua_') && !key.startsWith('dieta_')) return
        const dataStr = key.replace(/^(agua|dieta)_/, '')
        const dataChave = new Date(dataStr)
        if (isNaN(dataChave.getTime())) return
        const diffDias = (hoje - dataChave) / (1000 * 60 * 60 * 24)
        if (diffDias > 7) localStorage.removeItem(key)
    })
}
limparDadosAntigos()

export default function Dashboard() {
    const [perfil, setPerfil] = useState(null)
    const [treinos, setTreinos] = useState([])
    const [refeicoes, setRefeicoes] = useState([])
    const [carregando, setCarregando] = useState(true)
    const [aguaML, setAguaML] = useState(() => {
        const salvo = localStorage.getItem(getHojeKey('agua'))
        return salvo ? Number(salvo) : 0
    })
    const [refeicoesConcluidas, setRefeicoesConcluidas] = useState(() => {
        try {
            const salvo = localStorage.getItem(getHojeKey('dieta'))
            return salvo ? JSON.parse(salvo) : []
        } catch { return [] }
    })
    const [treinosConcluidos, setTreinosConcluidos] = useState(() => {
        try {
            const salvo = localStorage.getItem(getSemanaKey())
            return salvo ? JSON.parse(salvo) : []
        } catch { return [] }
    })
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

    // Macros totais do dia (todas as refeições)
    const macrosTotalDia = refeicaoHoje.reduce((acc, ref) => {
        (ref.alimentos || []).forEach(al => {
            acc.calorias += Number(al.calorias || 0)
            acc.proteinas += Number(al.proteina || 0)
            acc.carboidratos += Number(al.carboidrato || 0)
            acc.gorduras += Number(al.gordura || 0)
        })
        return acc
    }, { calorias: 0, proteinas: 0, carboidratos: 0, gorduras: 0 })

    // Macros apenas das refeições concluídas (checklist)
    const macrosHoje = refeicaoHoje.filter(r => refeicoesConcluidas.includes(r.id)).reduce((acc, ref) => {
        (ref.alimentos || []).forEach(al => {
            acc.calorias += Number(al.calorias || 0)
            acc.proteinas += Number(al.proteina || 0)
            acc.carboidratos += Number(al.carboidrato || 0)
            acc.gorduras += Number(al.gordura || 0)
        })
        return acc
    }, { calorias: 0, proteinas: 0, carboidratos: 0, gorduras: 0 })

    // Meta calórica vinda do perfil (definida na seção Dieta)
    const metaCalorias = perfil?.meta_calorica || 0
    const caloriaPorcentagem = metaCalorias > 0 ? Math.min(Math.round((macrosHoje.calorias / metaCalorias) * 100), 100) : 0
    const metaCaloriaBatida = metaCalorias > 0 && macrosHoje.calorias >= metaCalorias
    const refeicoesConcluídasHoje = refeicaoHoje.filter(r => refeicoesConcluidas.includes(r.id)).length

    function toggleRefeicao(id) {
        setRefeicoesConcluidas(prev => {
            const novo = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
            localStorage.setItem(getHojeKey('dieta'), JSON.stringify(novo))
            return novo
        })
    }

    function toggleTreinoConcluido(treinoId) {
        setTreinosConcluidos(prev => {
            const novo = prev.includes(treinoId) ? prev.filter(x => x !== treinoId) : [...prev, treinoId]
            localStorage.setItem(getSemanaKey(), JSON.stringify(novo))
            return novo
        })
    }

    // Dados derivados para checklist semanal
    const diasComTreino = [...new Set(treinos.map(t => t.dia))]
    const totalTreinosSemana = treinos.length
    const treinosFeitosSemana = treinos.filter(t => treinosConcluidos.includes(t.id)).length
    const progressoSemanal = totalTreinosSemana > 0 ? Math.round((treinosFeitosSemana / totalTreinosSemana) * 100) : 0
    const semanaCompleta = totalTreinosSemana > 0 && treinosFeitosSemana >= totalTreinosSemana

    // Meta de água: 35ml por kg de peso corporal
    const metaAguaML = perfil?.peso ? Math.round(perfil.peso * 35) : 2500
    const aguaLitros = (aguaML / 1000).toFixed(1)
    const metaLitros = (metaAguaML / 1000).toFixed(1)
    const aguaPorcentagem = Math.min(Math.round((aguaML / metaAguaML) * 100), 100)
    const metaBatida = aguaML >= metaAguaML

    function adicionarAgua(ml) {
        setAguaML(prev => {
            const novo = prev + ml
            localStorage.setItem(getHojeKey('agua'), novo)
            return novo
        })
    }

    function removerAgua(ml) {
        setAguaML(prev => {
            const novo = Math.max(0, prev - ml)
            localStorage.setItem(getHojeKey('agua'), novo)
            return novo
        })
    }

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
                                <div className={`h-1 w-full ${metaCaloriaBatida ? 'bg-gradient-to-r from-[#4ADE80] to-[#22C55E]' : 'bg-gradient-to-r from-[#E8881A] to-[#F09530]'} transition-colors duration-500`} />
                                <div className="flex items-center justify-between px-5 pt-5 pb-4 gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-500 ${
                                            metaCaloriaBatida
                                                ? 'bg-[#4ADE80]/10 border border-[#4ADE80]/20 text-[#4ADE80]'
                                                : 'bg-[#E8881A]/10 border border-[#E8881A]/20 text-[#E8881A]'
                                        }`}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M18 20V10M12 20V4M6 20v-6" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h2 className="text-[17px] font-semibold text-[#F0F0F0] tracking-tight leading-snug">
                                                Dieta de Hoje
                                            </h2>
                                            <p className="text-xs text-zinc-500 mt-0.5">
                                                {refeicoesConcluídasHoje}/{refeicaoHoje.length} refeição(ões) · {hoje}
                                            </p>
                                        </div>
                                    </div>
                                    {metaCaloriaBatida && (
                                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#4ADE80]/10 border border-[#4ADE80]/20 text-[11px] font-semibold text-[#4ADE80] shrink-0 animate-pulse">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                            Meta batida!
                                        </span>
                                    )}
                                </div>
                                <div className="h-px bg-[#1F1F1F]" />

                                {refeicaoHoje.length > 0 ? (
                                    <div className="px-5 py-5 flex flex-col gap-4">
                                        {/* Progresso calórico */}
                                        {metaCalorias > 0 && (
                                            <div className="flex items-center gap-4">
                                                <div className="relative w-[72px] h-[72px] shrink-0">
                                                    <svg className="w-full h-full -rotate-90" viewBox="0 0 72 72">
                                                        <circle cx="36" cy="36" r="30" fill="none" stroke="#1A1A1A" strokeWidth="6" />
                                                        <circle
                                                            cx="36" cy="36" r="30" fill="none"
                                                            stroke={metaCaloriaBatida ? '#4ADE80' : '#E8881A'}
                                                            strokeWidth="6"
                                                            strokeLinecap="round"
                                                            strokeDasharray={`${2 * Math.PI * 30}`}
                                                            strokeDashoffset={`${2 * Math.PI * 30 * (1 - caloriaPorcentagem / 100)}`}
                                                            style={{ transition: 'stroke-dashoffset 0.6s ease, stroke 0.5s ease' }}
                                                        />
                                                    </svg>
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                        <span className={`text-[15px] font-bold tracking-tight ${metaCaloriaBatida ? 'text-[#4ADE80]' : 'text-[#E8881A]'} transition-colors duration-500`}>
                                                            {caloriaPorcentagem}%
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col gap-1 flex-1">
                                                    <span className={`text-2xl font-bold tracking-tight ${metaCaloriaBatida ? 'text-[#4ADE80]' : 'text-[#F0F0F0]'} transition-colors duration-500`}>
                                                        {macrosHoje.calorias} <span className="text-sm text-zinc-500 font-medium">/ {metaCalorias} kcal</span>
                                                    </span>
                                                    <span className="text-[11px] text-zinc-500">
                                                        {macrosHoje.calorias < metaCalorias
                                                            ? `Faltam ${metaCalorias - macrosHoje.calorias} kcal para bater a meta`
                                                            : 'Parabéns! Meta calórica atingida 🔥'
                                                        }
                                                    </span>
                                                    <div className="w-full h-2 bg-[#1A1A1A] rounded-full overflow-hidden mt-1">
                                                        <div
                                                            className={`h-full rounded-full ${metaCaloriaBatida ? 'bg-gradient-to-r from-[#4ADE80] to-[#22C55E]' : 'bg-gradient-to-r from-[#E8881A] to-[#F09530]'}`}
                                                            style={{ width: `${caloriaPorcentagem}%`, transition: 'width 0.6s ease' }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Macros das refeições concluídas */}
                                        <div className="grid grid-cols-3 gap-3">
                                            <MacroMini label="Proteína" valor={macrosHoje.proteinas} cor="#60A5FA" bg="rgba(59,130,246,0.08)" border="rgba(59,130,246,0.2)" />
                                            <MacroMini label="Carboidrato" valor={macrosHoje.carboidratos} cor="#4ADE80" bg="rgba(34,197,94,0.08)" border="rgba(34,197,94,0.2)" />
                                            <MacroMini label="Gordura" valor={macrosHoje.gorduras} cor="#FACC15" bg="rgba(234,179,8,0.08)" border="rgba(234,179,8,0.2)" />
                                        </div>

                                        {/* Checklist de refeições */}
                                        <div className="flex flex-col gap-2">
                                            <span className="text-[10px] font-semibold text-zinc-500 tracking-wide uppercase">Refeições do dia</span>
                                            {refeicaoHoje.map(ref => {
                                                const concluida = refeicoesConcluidas.includes(ref.id)
                                                const calRef = (ref.alimentos || []).reduce((a, al) => a + Number(al.calorias || 0), 0)
                                                const protRef = (ref.alimentos || []).reduce((a, al) => a + Number(al.proteina || 0), 0)
                                                return (
                                                    <button
                                                        key={ref.id}
                                                        onClick={() => toggleRefeicao(ref.id)}
                                                        className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                                                            concluida
                                                                ? 'bg-[#4ADE80]/5 border-[#4ADE80]/20'
                                                                : 'bg-[#1A1A1A] border-[#252525] hover:border-[#E8881A]/30'
                                                        }`}
                                                    >
                                                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
                                                            concluida
                                                                ? 'bg-[#4ADE80] border-[#4ADE80]'
                                                                : 'border-[#333] bg-transparent'
                                                        }`}>
                                                            {concluida && (
                                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                                    <polyline points="20 6 9 17 4 12" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <span className={`block text-[13px] font-semibold truncate transition-colors duration-200 ${
                                                                concluida ? 'text-[#4ADE80] line-through' : 'text-[#E0E0E0]'
                                                            }`}>
                                                                {ref.tipo}
                                                            </span>
                                                            <span className="text-[11px] text-zinc-500">
                                                                {(ref.alimentos || []).length} alimento(s)
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-col items-end shrink-0">
                                                            <span className={`text-[12px] font-bold ${concluida ? 'text-[#4ADE80]' : 'text-[#E8881A]'}`}>
                                                                {calRef} kcal
                                                            </span>
                                                            <span className="text-[10px] text-zinc-600">
                                                                {protRef}g prot
                                                            </span>
                                                        </div>
                                                    </button>
                                                )
                                            })}
                                        </div>

                                        {!metaCalorias && (
                                            <div className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg bg-amber-500/5 border border-amber-500/15">
                                                <svg className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <circle cx="12" cy="12" r="10" />
                                                    <path d="M12 16v-4M12 8h.01" />
                                                </svg>
                                                <p className="text-[11px] text-zinc-400">
                                                    Configure sua meta calórica na <a href="/dieta" className="text-[#E8881A] font-semibold hover:underline">seção Dieta</a> para ver o progresso.
                                                </p>
                                            </div>
                                        )}
                                    </div>
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

                            {/* Consumo de Água */}
                            <div className="flex flex-col bg-[#161616] border border-[#222] rounded-2xl overflow-hidden">
                                <div className={`h-1 w-full ${metaBatida ? 'bg-gradient-to-r from-[#22D3EE] to-[#06B6D4]' : 'bg-gradient-to-r from-[#E8881A] to-[#F09530]'} transition-colors duration-500`} />
                                <div className="flex items-center justify-between px-5 pt-5 pb-4 gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-500 ${
                                            metaBatida
                                                ? 'bg-[#22D3EE]/10 border border-[#22D3EE]/20 text-[#22D3EE]'
                                                : 'bg-[#38BDF8]/10 border border-[#38BDF8]/20 text-[#38BDF8]'
                                        }`}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h2 className="text-[17px] font-semibold text-[#F0F0F0] tracking-tight leading-snug">
                                                Consumo de Água
                                            </h2>
                                            <p className="text-xs text-zinc-500 mt-0.5">
                                                Meta: {metaLitros}L · {perfil?.peso ? `${perfil.peso}kg × 35ml` : 'Configure seu peso'}
                                            </p>
                                        </div>
                                    </div>
                                    {metaBatida && (
                                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#22D3EE]/10 border border-[#22D3EE]/20 text-[11px] font-semibold text-[#22D3EE] shrink-0 animate-pulse">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                            Meta batida!
                                        </span>
                                    )}
                                </div>
                                <div className="h-px bg-[#1F1F1F]" />

                                <div className="px-5 py-5 flex flex-col gap-4">
                                    {/* Progresso visual */}
                                    <div className="flex items-center gap-4">
                                        {/* Barra circular / destaque de litros */}
                                        <div className="relative w-[72px] h-[72px] shrink-0">
                                            <svg className="w-full h-full -rotate-90" viewBox="0 0 72 72">
                                                <circle cx="36" cy="36" r="30" fill="none" stroke="#1A1A1A" strokeWidth="6" />
                                                <circle
                                                    cx="36" cy="36" r="30" fill="none"
                                                    stroke={metaBatida ? '#22D3EE' : '#38BDF8'}
                                                    strokeWidth="6"
                                                    strokeLinecap="round"
                                                    strokeDasharray={`${2 * Math.PI * 30}`}
                                                    strokeDashoffset={`${2 * Math.PI * 30 * (1 - aguaPorcentagem / 100)}`}
                                                    style={{ transition: 'stroke-dashoffset 0.6s ease, stroke 0.5s ease' }}
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <span className={`text-[15px] font-bold tracking-tight ${metaBatida ? 'text-[#22D3EE]' : 'text-[#38BDF8]'} transition-colors duration-500`}>
                                                    {aguaPorcentagem}%
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-1 flex-1">
                                            <span className={`text-2xl font-bold tracking-tight ${metaBatida ? 'text-[#22D3EE]' : 'text-[#F0F0F0]'} transition-colors duration-500`}>
                                                {aguaLitros} <span className="text-sm text-zinc-500 font-medium">/ {metaLitros}L</span>
                                            </span>
                                            <span className="text-[11px] text-zinc-500">
                                                {aguaML < metaAguaML
                                                    ? `Faltam ${((metaAguaML - aguaML) / 1000).toFixed(1)}L para bater a meta`
                                                    : 'Parabéns! Você atingiu sua meta de hoje 🎉'
                                                }
                                            </span>
                                            {/* Barra linear */}
                                            <div className="w-full h-2 bg-[#1A1A1A] rounded-full overflow-hidden mt-1">
                                                <div
                                                    className={`h-full rounded-full ${metaBatida ? 'bg-gradient-to-r from-[#22D3EE] to-[#06B6D4]' : 'bg-gradient-to-r from-[#38BDF8] to-[#0EA5E9]'}`}
                                                    style={{ width: `${aguaPorcentagem}%`, transition: 'width 0.6s ease' }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Botões de adicionar */}
                                    <div className="flex gap-2">
                                        {[150, 250, 500].map(ml => (
                                            <button
                                                key={ml}
                                                onClick={() => adicionarAgua(ml)}
                                                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl border border-[#252525] bg-[#1A1A1A] text-[13px] font-semibold text-zinc-300 hover:border-[#38BDF8]/40 hover:text-[#38BDF8] hover:bg-[#38BDF8]/5 transition-all duration-150 cursor-pointer active:scale-95"
                                            >
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                                    <line x1="12" y1="5" x2="12" y2="19" />
                                                    <line x1="5" y1="12" x2="19" y2="12" />
                                                </svg>
                                                {ml}ml
                                            </button>
                                        ))}
                                    </div>

                                    {/* Ações secundárias */}
                                    {aguaML > 0 && (
                                        <div className="flex items-center justify-between">
                                            <button
                                                onClick={() => removerAgua(250)}
                                                className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                                            >
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                                    <polyline points="1 4 1 10 7 10" />
                                                    <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
                                                </svg>
                                                Desfazer 250ml
                                            </button>
                                            <span className="text-[11px] text-zinc-600">
                                                {aguaML}ml no total
                                            </span>
                                        </div>
                                    )}
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
                                <div className={`h-1 w-full ${semanaCompleta ? 'bg-gradient-to-r from-[#A855F7] to-[#7C3AED]' : 'bg-gradient-to-r from-[#E8881A] to-[#F09530]'} transition-colors duration-500`} />
                                <div className="flex items-center justify-between px-5 pt-5 pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-500 ${
                                            semanaCompleta
                                                ? 'bg-[#A855F7]/10 border border-[#A855F7]/20 text-[#A855F7]'
                                                : 'bg-[#E8881A]/10 border border-[#E8881A]/20 text-[#E8881A]'
                                        }`}>
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
                                            <p className="text-xs text-zinc-500 mt-0.5">
                                                {treinosFeitosSemana}/{totalTreinosSemana} treino(s) concluído(s)
                                            </p>
                                        </div>
                                    </div>
                                    {semanaCompleta && (
                                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#A855F7]/10 border border-[#A855F7]/20 text-[11px] font-semibold text-[#A855F7] shrink-0 animate-pulse">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                            Semana completa!
                                        </span>
                                    )}
                                </div>
                                <div className="h-px bg-[#1F1F1F]" />

                                {/* Progresso semanal */}
                                {totalTreinosSemana > 0 && (
                                    <div className="px-5 pt-5 flex items-center gap-4">
                                        <div className="relative w-[60px] h-[60px] shrink-0">
                                            <svg className="w-full h-full -rotate-90" viewBox="0 0 60 60">
                                                <circle cx="30" cy="30" r="24" fill="none" stroke="#1A1A1A" strokeWidth="5" />
                                                <circle
                                                    cx="30" cy="30" r="24" fill="none"
                                                    stroke={semanaCompleta ? '#A855F7' : '#E8881A'}
                                                    strokeWidth="5"
                                                    strokeLinecap="round"
                                                    strokeDasharray={`${2 * Math.PI * 24}`}
                                                    strokeDashoffset={`${2 * Math.PI * 24 * (1 - progressoSemanal / 100)}`}
                                                    style={{ transition: 'stroke-dashoffset 0.6s ease, stroke 0.5s ease' }}
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className={`text-[13px] font-bold ${semanaCompleta ? 'text-[#A855F7]' : 'text-[#E8881A]'}`}>
                                                    {progressoSemanal}%
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1 flex-1">
                                            <span className={`text-lg font-bold tracking-tight ${semanaCompleta ? 'text-[#A855F7]' : 'text-[#F0F0F0]'}`}>
                                                {treinosFeitosSemana} <span className="text-sm text-zinc-500 font-medium">/ {totalTreinosSemana} treinos</span>
                                            </span>
                                            <span className="text-[11px] text-zinc-500">
                                                {semanaCompleta ? 'Todos os treinos da semana concluídos! 💪' : `Faltam ${totalTreinosSemana - treinosFeitosSemana} treino(s) nesta semana`}
                                            </span>
                                            <div className="w-full h-2 bg-[#1A1A1A] rounded-full overflow-hidden mt-0.5">
                                                <div
                                                    className={`h-full rounded-full ${semanaCompleta ? 'bg-gradient-to-r from-[#A855F7] to-[#7C3AED]' : 'bg-gradient-to-r from-[#E8881A] to-[#F09530]'}`}
                                                    style={{ width: `${progressoSemanal}%`, transition: 'width 0.6s ease' }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Stats rápidos */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-5 py-5">
                                    <StatItem label="Treinos" value={treinos.length} />
                                    <StatItem label="Exercícios" value={totalExercicios} />
                                    <StatItem label="Refeições" value={totalRefeicoesSemana} />
                                    <StatItem label="Dias c/ treino" value={diasComTreino.length} suffix="/7" />
                                </div>

                                {/* Checklist de treinos da semana */}
                                {treinos.length > 0 && (
                                    <div className="px-5 pb-5 flex flex-col gap-3">
                                        <span className="text-[10px] font-semibold text-zinc-500 tracking-wide uppercase">Checklist da Semana</span>
                                        {DIAS_SEMANA.slice(1).concat(DIAS_SEMANA.slice(0, 1)).map(dia => {
                                            const treinosDoDia = treinos.filter(t => t.dia === dia)
                                            if (treinosDoDia.length === 0) return null
                                            const todosConcluidos = treinosDoDia.every(t => treinosConcluidos.includes(t.id))
                                            const isHojeDia = dia === hoje
                                            return (
                                                <div key={dia} className="flex flex-col gap-1.5">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-[11px] font-semibold uppercase tracking-wide ${isHojeDia ? 'text-[#E8881A]' : todosConcluidos ? 'text-[#A855F7]' : 'text-zinc-500'}`}>
                                                            {dia} {isHojeDia && '(hoje)'}
                                                        </span>
                                                        {todosConcluidos && (
                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#A855F7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                                <polyline points="20 6 9 17 4 12" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                    {treinosDoDia.map(treino => {
                                                        const concluido = treinosConcluidos.includes(treino.id)
                                                        return (
                                                            <button
                                                                key={treino.id}
                                                                onClick={() => toggleTreinoConcluido(treino.id)}
                                                                className={`flex items-center gap-3 w-full text-left px-4 py-2.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                                                                    concluido
                                                                        ? 'bg-[#A855F7]/5 border-[#A855F7]/20'
                                                                        : 'bg-[#1A1A1A] border-[#252525] hover:border-[#E8881A]/30'
                                                                }`}
                                                            >
                                                                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
                                                                    concluido ? 'bg-[#A855F7] border-[#A855F7]' : 'border-[#333] bg-transparent'
                                                                }`}>
                                                                    {concluido && (
                                                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                                            <polyline points="20 6 9 17 4 12" />
                                                                        </svg>
                                                                    )}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <span className={`block text-[13px] font-semibold truncate transition-colors duration-200 ${
                                                                        concluido ? 'text-[#A855F7] line-through' : 'text-[#E0E0E0]'
                                                                    }`}>
                                                                        {treino.nome}
                                                                    </span>
                                                                    <span className="text-[11px] text-zinc-500">
                                                                        {treino.exercicios?.length || 0} exercício(s)
                                                                    </span>
                                                                </div>
                                                                <span className={`text-[11px] font-semibold shrink-0 ${concluido ? 'text-[#A855F7]' : 'text-[#E8881A]'}`}>
                                                                    {concluido ? '✓ Feito' : 'Pendente'}
                                                                </span>
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}

                                {/* Mini mapa da semana */}
                                <div className="px-5 pb-5">
                                    <div className="flex gap-1.5 overflow-x-auto">
                                        {DIAS_SEMANA.map((dia, i) => {
                                            const diaOrdenado = DIAS_SEMANA[(i + 1) % 7]
                                            const treinosDia = treinos.filter(t => t.dia === diaOrdenado)
                                            const temTreino = treinosDia.length > 0
                                            const treinoConcluido = temTreino && treinosDia.every(t => treinosConcluidos.includes(t.id))
                                            const temRefeicao = refeicoes.some(r => r.dia === diaOrdenado)
                                            const isHoje = diaOrdenado === hoje

                                            return (
                                                <div
                                                    key={diaOrdenado}
                                                    className={`flex-1 min-w-[40px] flex flex-col items-center gap-1.5 py-2.5 px-1 rounded-lg border text-center transition-all
                                                        ${isHoje
                                                            ? 'bg-[#E8881A]/10 border-[#E8881A]/30'
                                                            : treinoConcluido
                                                                ? 'bg-[#A855F7]/8 border-[#A855F7]/25'
                                                                : 'bg-[#1A1A1A] border-[#252525]'
                                                        }`}
                                                >
                                                    <span className={`text-[10px] font-semibold uppercase tracking-wide ${
                                                        isHoje ? 'text-[#E8881A]' : treinoConcluido ? 'text-[#A855F7]' : 'text-zinc-500'
                                                    }`}>
                                                        {diaOrdenado.slice(0, 3)}
                                                    </span>
                                                    <div className="flex gap-1">
                                                        {temTreino && (
                                                            <span className={`w-2 h-2 rounded-full ${treinoConcluido ? 'bg-[#A855F7]' : 'bg-[#E8881A]'}`} title="Treino" />
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
                                            <span className="w-2 h-2 rounded-full bg-[#E8881A]" /> Pendente
                                        </span>
                                        <span className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                                            <span className="w-2 h-2 rounded-full bg-[#A855F7]" /> Concluído
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
