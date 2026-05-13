import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "@/lib/supabase";

const MESES = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

export default function Metricas() {
    const [mes, setMes] = useState(new Date().getMonth());
    const [ano, setAno] = useState(new Date().getFullYear());
    const [metricas, setMetricas] = useState([]);
    const [treinosConcluidos, setTreinosConcluidos] = useState([]);
    const [historicoCargas, setHistoricoCargas] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const navigate = useNavigate();

    useEffect(() => { carregarDados(); }, [mes, ano]);

    async function carregarDados() {
        setCarregando(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { navigate("/login"); return; }

            const inicio = `${ano}-${String(mes + 1).padStart(2, "0")}-01`;
            const ultimoDia = new Date(ano, mes + 1, 0).getDate();
            const fim = `${ano}-${String(mes + 1).padStart(2, "0")}-${ultimoDia}`;

            const [metricasRes, treinosRes, cargasRes] = await Promise.all([
                supabase.from("metricas_diarias").select().gte("data", inicio).lte("data", fim),
                supabase.from("treinos_concluidos").select().gte("data", inicio).lte("data", fim),
                supabase.from("historico_cargas").select().gte("data", inicio).lte("data", fim),
            ]);

            setMetricas(metricasRes.data || []);
            setTreinosConcluidos(treinosRes.data || []);
            setHistoricoCargas(cargasRes.data || []);
        } catch (e) {
            console.error(e);
        } finally {
            setCarregando(false);
        }
    }

    function mudarMes(delta) {
        let novoMes = mes + delta;
        let novoAno = ano;
        if (novoMes < 0) { novoMes = 11; novoAno--; }
        if (novoMes > 11) { novoMes = 0; novoAno++; }
        setMes(novoMes);
        setAno(novoAno);
    }

    // Derived data
    const totalTreinos = treinosConcluidos.length;
    const totalCalorias = metricas.reduce((a, m) => a + Number(m.calorias_consumidas || 0), 0);
    const totalAgua = metricas.reduce((a, m) => a + Number(m.agua_ml || 0), 0);
    const totalProteinas = metricas.reduce((a, m) => a + Number(m.proteinas_g || 0), 0);
    const diasComDados = metricas.length;
    const mediaCaloriasDia = diasComDados > 0 ? Math.round(totalCalorias / diasComDados) : 0;
    const mediaAguaDia = diasComDados > 0 ? (totalAgua / diasComDados / 1000).toFixed(1) : "0";
    const mediaProtDia = diasComDados > 0 ? Math.round(totalProteinas / diasComDados) : 0;
    const duracaoTotal = treinosConcluidos.reduce((a, t) => a + Number(t.duracao_minutos || 0), 0);

    // Group workouts by date for chart
    const ultimoDia = new Date(ano, mes + 1, 0).getDate();
    const treinosPorDia = Array.from({ length: ultimoDia }, (_, i) => {
        const dia = `${ano}-${String(mes + 1).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`;
        return treinosConcluidos.filter(t => t.data === dia).length;
    });
    const maxTreinosDia = Math.max(1, ...treinosPorDia);

    // Group load progression by exercise
    const exerciciosUnicos = [...new Set(historicoCargas.map(h => h.exercicio_nome))];
    const progressaoPorExercicio = exerciciosUnicos.map(nome => {
        const entradas = historicoCargas
            .filter(h => h.exercicio_nome === nome)
            .sort((a, b) => new Date(a.data) - new Date(b.data));
        const cargasUnicas = [];
        const datasVistas = new Set();
        entradas.forEach(e => {
            const key = `${e.data}-${e.carga}`;
            if (!datasVistas.has(key)) {
                datasVistas.add(key);
                cargasUnicas.push({ data: e.data, carga: Number(e.carga) });
            }
        });
        return { nome, dados: cargasUnicas };
    }).filter(p => p.dados.length > 0);

    return (
        <div className="min-h-screen bg-fundo">
            <Sidebar />
            <div className="lg:ml-64 flex flex-col min-h-screen">
                <Header />
                <main className="flex flex-col pb-24 lg:pb-0">
                    <div className="flex justify-center items-start pt-6 sm:pt-10 px-3 sm:px-4 pb-6 font-sans">
                        <div className="w-full max-w-[700px] flex flex-col gap-4">

                            {/* Month selector */}
                            <div className="flex items-center justify-between px-1">
                                <h1 className="text-xl sm:text-2xl font-bold text-[#F0F0F0] tracking-tight">📊 Métricas</h1>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => mudarMes(-1)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] text-zinc-400 hover:border-[#E8881A] hover:text-[#E8881A] transition-all cursor-pointer">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
                                    </button>
                                    <span className="text-sm font-semibold text-[#F0F0F0] min-w-[140px] text-center">{MESES[mes]} {ano}</span>
                                    <button onClick={() => mudarMes(1)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] text-zinc-400 hover:border-[#E8881A] hover:text-[#E8881A] transition-all cursor-pointer">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
                                    </button>
                                </div>
                            </div>

                            {carregando ? (
                                <div className="flex items-center justify-center py-20">
                                    <span className="text-zinc-500 text-sm">Carregando métricas...</span>
                                </div>
                            ) : (
                                <>
                                    {/* Summary cards */}
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        <MetricCard label="Treinos" value={totalTreinos} icon="🏋️" cor={{ bg: "rgba(232,136,26,0.08)", border: "rgba(232,136,26,0.2)", text: "#E8881A" }} />
                                        <MetricCard label="Calorias" value={totalCalorias.toLocaleString("pt-BR")} suffix=" kcal" icon="🔥" cor={{ bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)", text: "#F87171" }} />
                                        <MetricCard label="Água" value={(totalAgua / 1000).toFixed(1)} suffix=" L" icon="💧" cor={{ bg: "rgba(56,189,248,0.08)", border: "rgba(56,189,248,0.2)", text: "#38BDF8" }} />
                                        <MetricCard label="Proteínas" value={totalProteinas} suffix=" g" icon="🥩" cor={{ bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.2)", text: "#60A5FA" }} />
                                    </div>

                                    {/* Daily averages */}
                                    <div className="flex flex-col bg-[#161616] border border-[#222] rounded-2xl overflow-hidden">
                                        <div className="h-1 w-full bg-gradient-to-r from-[#A855F7] to-[#7C3AED]" />
                                        <div className="flex items-center gap-3 px-5 pt-5 pb-4">
                                            <div className="w-10 h-10 bg-[#A855F7]/10 border border-[#A855F7]/20 rounded-xl flex items-center justify-center text-[#A855F7] shrink-0">
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10M12 20V4M6 20v-6" /></svg>
                                            </div>
                                            <div>
                                                <h2 className="text-[17px] font-semibold text-[#F0F0F0] tracking-tight leading-snug">Médias Diárias</h2>
                                                <p className="text-xs text-zinc-500 mt-0.5">{diasComDados} dia(s) com dados registrados</p>
                                            </div>
                                        </div>
                                        <div className="h-px bg-[#1F1F1F]" />
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-5 py-5">
                                            <StatItem label="Kcal/dia" value={mediaCaloriasDia} />
                                            <StatItem label="Água/dia" value={`${mediaAguaDia}L`} />
                                            <StatItem label="Prot/dia" value={`${mediaProtDia}g`} />
                                            <StatItem label="Tempo total" value={`${duracaoTotal}min`} />
                                        </div>
                                    </div>

                                    {/* Workout frequency chart */}
                                    <div className="flex flex-col bg-[#161616] border border-[#222] rounded-2xl overflow-hidden">
                                        <div className="h-1 w-full bg-gradient-to-r from-[#E8881A] to-[#F09530]" />
                                        <div className="flex items-center gap-3 px-5 pt-5 pb-4">
                                            <div className="w-10 h-10 bg-[#E8881A]/10 border border-[#E8881A]/20 rounded-xl flex items-center justify-center text-[#E8881A] shrink-0">
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                                            </div>
                                            <div>
                                                <h2 className="text-[17px] font-semibold text-[#F0F0F0] tracking-tight leading-snug">Frequência de Treinos</h2>
                                                <p className="text-xs text-zinc-500 mt-0.5">{totalTreinos} treino(s) em {MESES[mes]}</p>
                                            </div>
                                        </div>
                                        <div className="h-px bg-[#1F1F1F]" />
                                        <div className="px-5 py-5">
                                            {totalTreinos > 0 ? (
                                                <div className="flex items-end gap-[3px] h-[100px]">
                                                    {treinosPorDia.map((qtd, i) => (
                                                        <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                                                            <div
                                                                className={`w-full rounded-t-sm transition-all duration-300 ${qtd > 0 ? 'bg-gradient-to-t from-[#E8881A] to-[#F09530]' : 'bg-[#1A1A1A]'}`}
                                                                style={{ height: `${Math.max(4, (qtd / maxTreinosDia) * 100)}%`, minHeight: qtd > 0 ? '12px' : '4px' }}
                                                                title={`Dia ${i + 1}: ${qtd} treino(s)`}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center py-8 text-zinc-600">
                                                    <span className="text-sm">Nenhum treino registrado neste mês</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between mt-2">
                                                <span className="text-[10px] text-zinc-600">1</span>
                                                <span className="text-[10px] text-zinc-600">{Math.floor(ultimoDia / 2)}</span>
                                                <span className="text-[10px] text-zinc-600">{ultimoDia}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Load progression */}
                                    {progressaoPorExercicio.length > 0 && (
                                        <div className="flex flex-col bg-[#161616] border border-[#222] rounded-2xl overflow-hidden">
                                            <div className="h-1 w-full bg-gradient-to-r from-[#4ADE80] to-[#22C55E]" />
                                            <div className="flex items-center gap-3 px-5 pt-5 pb-4">
                                                <div className="w-10 h-10 bg-[#4ADE80]/10 border border-[#4ADE80]/20 rounded-xl flex items-center justify-center text-[#4ADE80] shrink-0">
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
                                                </div>
                                                <div>
                                                    <h2 className="text-[17px] font-semibold text-[#F0F0F0] tracking-tight leading-snug">Progressão de Carga</h2>
                                                    <p className="text-xs text-zinc-500 mt-0.5">{exerciciosUnicos.length} exercício(s) com histórico</p>
                                                </div>
                                            </div>
                                            <div className="h-px bg-[#1F1F1F]" />
                                            <div className="px-5 py-5 flex flex-col gap-4">
                                                {progressaoPorExercicio.map((ex) => {
                                                    const maxCarga = Math.max(...ex.dados.map(d => d.carga));
                                                    const minCarga = Math.min(...ex.dados.map(d => d.carga));
                                                    const ultima = ex.dados[ex.dados.length - 1]?.carga || 0;
                                                    const primeira = ex.dados[0]?.carga || 0;
                                                    const evolucao = primeira > 0 ? Math.round(((ultima - primeira) / primeira) * 100) : 0;

                                                    return (
                                                        <div key={ex.nome} className="flex flex-col gap-2">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-[13px] font-semibold text-[#E0E0E0] truncate">{ex.nome}</span>
                                                                <div className="flex items-center gap-2 shrink-0">
                                                                    <span className="text-[12px] font-bold text-[#4ADE80]">{ultima}kg</span>
                                                                    {evolucao !== 0 && (
                                                                        <span className={`text-[10px] font-semibold px-1.5 py-[1px] rounded ${evolucao > 0 ? 'bg-[#4ADE80]/10 text-[#4ADE80]' : 'bg-red-500/10 text-red-400'}`}>
                                                                            {evolucao > 0 ? '↑' : '↓'}{Math.abs(evolucao)}%
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            {/* Sparkline */}
                                                            <div className="h-[40px] flex items-end gap-[2px]">
                                                                {ex.dados.map((d, i) => {
                                                                    const range = maxCarga - minCarga || 1;
                                                                    const pct = ((d.carga - minCarga) / range) * 100;
                                                                    return (
                                                                        <div
                                                                            key={i}
                                                                            className="flex-1 rounded-t-sm bg-gradient-to-t from-[#4ADE80] to-[#22C55E] transition-all duration-300"
                                                                            style={{ height: `${Math.max(8, pct)}%` }}
                                                                            title={`${d.data}: ${d.carga}kg`}
                                                                        />
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Workout log */}
                                    {treinosConcluidos.length > 0 && (
                                        <div className="flex flex-col bg-[#161616] border border-[#222] rounded-2xl overflow-hidden">
                                            <div className="h-1 w-full bg-gradient-to-r from-[#E8881A] to-[#F09530]" />
                                            <div className="flex items-center gap-3 px-5 pt-5 pb-4">
                                                <div className="w-10 h-10 bg-[#E8881A]/10 border border-[#E8881A]/20 rounded-xl flex items-center justify-center text-[#E8881A] shrink-0">
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                                                </div>
                                                <div>
                                                    <h2 className="text-[17px] font-semibold text-[#F0F0F0] tracking-tight leading-snug">Histórico de Treinos</h2>
                                                    <p className="text-xs text-zinc-500 mt-0.5">{MESES[mes]} {ano}</p>
                                                </div>
                                            </div>
                                            <div className="h-px bg-[#1F1F1F]" />
                                            <div className="px-5 py-4 flex flex-col gap-2">
                                                {treinosConcluidos
                                                    .sort((a, b) => new Date(b.data) - new Date(a.data))
                                                    .map((t, i) => (
                                                        <div key={i} className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#1A1A1A] border border-[#252525]">
                                                            <div className="flex items-center gap-3 min-w-0">
                                                                <div className="w-8 h-8 bg-[#4ADE80]/10 border border-[#4ADE80]/20 rounded-lg flex items-center justify-center text-[#4ADE80] shrink-0">
                                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <span className="block text-[13px] font-semibold text-[#E0E0E0] truncate">{t.treino_nome}</span>
                                                                    <span className="text-[11px] text-zinc-500">{new Date(t.data + 'T12:00:00').toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}</span>
                                                                </div>
                                                            </div>
                                                            {t.duracao_minutos > 0 && (
                                                                <span className="text-[11px] font-semibold text-[#E8881A] shrink-0">{t.duracao_minutos}min</span>
                                                            )}
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Empty state */}
                                    {totalTreinos === 0 && diasComDados === 0 && (
                                        <div className="flex flex-col bg-[#161616] border border-[#222] rounded-2xl overflow-hidden">
                                            <div className="h-1 w-full bg-gradient-to-r from-[#E8881A] to-[#F09530]" />
                                            <div className="flex flex-col items-center justify-center py-14 px-5 gap-3">
                                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M18 20V10M12 20V4M6 20v-6" />
                                                </svg>
                                                <p className="text-sm text-zinc-500 text-center">Nenhum dado registrado em {MESES[mes]}.</p>
                                                <p className="text-[11px] text-zinc-600 text-center">
                                                    Use o <span className="text-[#E8881A] font-semibold">Dashboard</span> para registrar treinos, água e refeições. Os dados aparecerão aqui automaticamente.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

function MetricCard({ label, value, suffix = "", icon, cor }) {
    return (
        <div
            className="flex flex-col gap-1.5 p-4 rounded-xl border transition-all duration-150"
            style={{ background: cor.bg, borderColor: cor.border }}
        >
            <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold tracking-wide uppercase" style={{ color: cor.text }}>{label}</span>
                <span className="text-sm">{icon}</span>
            </div>
            <span className="text-xl font-bold tracking-tight" style={{ color: cor.text }}>
                {value}{suffix && <span className="text-xs text-zinc-500 font-medium">{suffix}</span>}
            </span>
        </div>
    );
}

function StatItem({ label, value }) {
    return (
        <div className="flex flex-col gap-1 p-3 rounded-xl border" style={{ background: "#1A1A1A", borderColor: "#252525" }}>
            <span className="text-[10px] font-semibold text-zinc-500 tracking-wide uppercase">{label}</span>
            <span className="text-lg font-bold tracking-tight text-[#F0F0F0]">{value}</span>
        </div>
    );
}
