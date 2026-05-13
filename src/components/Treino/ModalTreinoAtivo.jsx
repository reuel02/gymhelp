import { useState, useEffect, useRef } from "react";
import { MdClose } from "react-icons/md";
import supabase from "@/lib/supabase";

export default function ModalTreinoAtivo({ treino, sessaoAtiva, onClose, onTreinoConcluido, onSessaoAtualizada }) {
    const [fase, setFase] = useState(sessaoAtiva?.fase || "preparacao"); // preparacao | serie | descanso | concluido
    const [exercicioIdx, setExercicioIdx] = useState(sessaoAtiva?.exercicioIdx || 0);
    const [serieIdx, setSerieIdx] = useState(sessaoAtiva?.serieIdx || 0);
    const [cargaAtual, setCargaAtual] = useState(sessaoAtiva?.cargaAtual || "");
    const [tempoRestante, setTempoRestante] = useState(sessaoAtiva?.tempoRestante || 0);
    const [registros, setRegistros] = useState(sessaoAtiva?.registros || []);
    const [tempoInicio, setTempoInicio] = useState(sessaoAtiva?.tempoInicio ? new Date(sessaoAtiva.tempoInicio) : null);
    const [salvando, setSalvando] = useState(false);
    const [descansoPersonalizado, setDescansoPersonalizado] = useState(sessaoAtiva?.descansoPersonalizado || Number(treino?.descanso_segundos) || 60);
    const timerRef = useRef(null);

    const exercicios = treino?.exercicios || [];
    const exercicioAtual = exercicios[exercicioIdx];
    const totalSeries = Number(exercicioAtual?.series || 0);

    // Sync session to DB
    useEffect(() => {
        if (fase === "preparacao" || fase === "concluido") return;
        
        const sessao = {
            treino_id: treino.id,
            fase,
            exercicioIdx,
            serieIdx,
            cargaAtual,
            tempoRestante,
            registros,
            tempoInicio: tempoInicio?.toISOString(),
            descansoPersonalizado
        };
        
        if (onSessaoAtualizada) onSessaoAtualizada(sessao);
        
        const saveToDb = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;
                await supabase.from("usuarios").update({ treino_ativo: sessao }).eq("id", user.id);
            } catch(e) {}
        }
        
        // Only save to DB when phase changes or registers change, not on every tick
        saveToDb();
    }, [fase, exercicioIdx, serieIdx, registros.length]); // Intentionally omitting tempoRestante and cargaAtual

    // Timer countdown
    useEffect(() => {
        if (fase !== "descanso" || tempoRestante <= 0) return;
        timerRef.current = setTimeout(() => {
            setTempoRestante(prev => {
                if (prev <= 1) {
                    avancarParaProxima();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearTimeout(timerRef.current);
    }, [fase, tempoRestante]);

    function iniciar() {
        setFase("serie");
        setExercicioIdx(0);
        setSerieIdx(0);
        setCargaAtual(exercicios[0]?.carga || "");
        setTempoInicio(new Date());
    }

    function concluirSerie() {
        const novoRegistro = {
            exercicioIdx,
            exercicioNome: exercicioAtual.nome,
            serieIdx,
            carga: Number(cargaAtual) || 0,
            repeticoes: Number(exercicioAtual.repeticoes) || 0,
        };
        const novosRegistros = [...registros, novoRegistro];
        setRegistros(novosRegistros);

        // Check what's next
        const proximaSerie = serieIdx + 1;
        const proximoExercicio = exercicioIdx + 1;
        const ultimaSerieDoExercicio = proximaSerie >= totalSeries;
        const ultimoExercicio = proximoExercicio >= exercicios.length;

        if (ultimaSerieDoExercicio && ultimoExercicio) {
            // All done
            setFase("concluido");
            finalizarTreino(novosRegistros);
        } else {
            // Start rest timer
            setFase("descanso");
            setTempoRestante(descansoPersonalizado);
        }
    }

    function avancarParaProxima() {
        const proximaSerie = serieIdx + 1;
        if (proximaSerie < totalSeries) {
            setSerieIdx(proximaSerie);
        } else {
            const proximoExercicio = exercicioIdx + 1;
            if (proximoExercicio < exercicios.length) {
                setExercicioIdx(proximoExercicio);
                setSerieIdx(0);
                setCargaAtual(exercicios[proximoExercicio]?.carga || "");
            }
        }
        setFase("serie");
    }

    function pularDescanso() {
        clearTimeout(timerRef.current);
        setTempoRestante(0);
        avancarParaProxima();
    }

    async function finalizarTreino(todosRegistros) {
        setSalvando(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const duracaoMin = tempoInicio ? Math.round((new Date() - tempoInicio) / 60000) : 0;

            // Save load history
            const cargas = todosRegistros.map(r => ({
                usuario_id: user.id,
                treino_id: treino.id,
                exercicio_nome: r.exercicioNome,
                carga: r.carga,
                repeticoes: r.repeticoes,
                series: r.serieIdx + 1,
                data: new Date().toISOString().split("T")[0],
            }));

            if (cargas.length > 0) {
                await supabase.from("historico_cargas").insert(cargas);
            }

            // Save completed workout
            await supabase.from("treinos_concluidos").insert({
                usuario_id: user.id,
                treino_id: treino.id,
                treino_nome: treino.nome,
                data: new Date().toISOString().split("T")[0],
                duracao_minutos: duracaoMin,
            });

            // Save daily metrics
            const hoje = new Date().toISOString().split("T")[0];
            await supabase.from("metricas_diarias").upsert({
                usuario_id: user.id,
                data: hoje,
            }, { onConflict: "usuario_id,data" });

            // Clear active session
            await supabase.from("usuarios").update({ treino_ativo: null }).eq("id", user.id);
            if (onSessaoAtualizada) onSessaoAtualizada(null);

            if (onTreinoConcluido) onTreinoConcluido(treino.id);
        } catch (err) {
            console.error("Erro ao salvar treino:", err);
        } finally {
            setSalvando(false);
        }
    }

    // Progress calculations
    const totalSeriesGeral = exercicios.reduce((a, e) => a + Number(e.series || 0), 0);
    const seriesFeitas = registros.length;
    const progressoPorcentagem = totalSeriesGeral > 0 ? Math.round((seriesFeitas / totalSeriesGeral) * 100) : 0;
    const descansoPercent = descansoPersonalizado > 0 ? ((descansoPersonalizado - tempoRestante) / descansoPersonalizado) * 100 : 0;

    const minutos = Math.floor(tempoRestante / 60);
    const segundos = tempoRestante % 60;

    async function cancelarTreino() {
        if (window.confirm("Tem certeza que deseja cancelar este treino? O progresso atual não será salvo.")) {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    await supabase.from("usuarios").update({ treino_ativo: null }).eq("id", user.id);
                }
                if (onSessaoAtualizada) onSessaoAtualizada(null);
                onClose();
            } catch(e) {}
        }
    }

    if (!treino) return null;

    return (
        <div className="fixed inset-0 z-[70] flex justify-center items-center bg-black/85 backdrop-blur-md p-3 font-sans">
            <div className="w-full max-w-[500px] max-h-[95vh] flex flex-col bg-[#111] border border-[#222] rounded-2xl shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between p-4 px-5 shrink-0 bg-[#161616] border-b border-[#1F1F1F]">
                    <div className="flex items-center gap-2.5">
                        <span className="w-[34px] h-[34px] bg-[#E8881A]/10 border border-[#E8881A]/20 rounded-lg flex items-center justify-center">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E8881A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 4v16M18 4v16M2 8h4M18 8h4M2 16h4M18 16h4" />
                            </svg>
                        </span>
                        <div>
                            <span className="text-[15px] font-semibold text-[#F0F0F0] tracking-tight">{treino.nome}</span>
                            <span className="block text-[11px] text-zinc-500">{exercicios.length} exercícios · {totalSeriesGeral} séries</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {fase !== "preparacao" && fase !== "concluido" && (
                            <button onClick={cancelarTreino} className="text-[11px] font-semibold text-red-400 hover:text-red-300 px-2 py-1.5 rounded-lg bg-red-400/10 transition-colors">
                                Cancelar
                            </button>
                        )}
                        <button onClick={() => onClose()} className="p-1 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-400/10 transition-colors">
                            <MdClose className="size-6" />
                        </button>
                    </div>
                </div>

                {/* Progress bar */}
                {fase !== "preparacao" && (
                    <div className="h-1.5 bg-[#1A1A1A] shrink-0">
                        <div
                            className="h-full bg-gradient-to-r from-[#E8881A] to-[#F09530] transition-all duration-500 ease-out"
                            style={{ width: `${fase === "concluido" ? 100 : progressoPorcentagem}%` }}
                        />
                    </div>
                )}

                {/* Body */}
                <div className="flex-1 overflow-y-auto">

                    {/* FASE: Preparação */}
                    {fase === "preparacao" && (
                        <div className="flex flex-col p-5 gap-4">
                            <div className="flex flex-col items-center py-4 gap-2">
                                <div className="w-16 h-16 rounded-2xl bg-[#E8881A]/10 border border-[#E8881A]/20 flex items-center justify-center text-[#E8881A] mb-2">
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polygon points="5 3 19 12 5 21 5 3" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-[#F0F0F0] tracking-tight">Pronto para treinar?</h3>
                                <p className="text-sm text-zinc-500">Revise seus exercícios abaixo</p>
                            </div>

                            {exercicios.map((ex, i) => (
                                <div key={i} className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#1A1A1A] border border-[#252525]">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <span className="w-7 h-7 rounded-lg bg-[#E8881A]/10 border border-[#E8881A]/20 flex items-center justify-center text-[11px] font-bold text-[#E8881A] shrink-0">{i + 1}</span>
                                        <span className="text-[13px] text-[#E0E0E0] font-medium truncate">{ex.nome}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        <span className="px-2 py-[2px] rounded-md text-[11px] font-semibold bg-[#E8881A]/10 border border-[#E8881A]/20 text-[#E8881A]">{ex.series}×{ex.repeticoes}</span>
                                        {ex.carga && <span className="px-2 py-[2px] rounded-md text-[11px] font-medium bg-zinc-800/60 border border-zinc-700/50 text-zinc-400">{ex.carga}kg</span>}
                                    </div>
                                </div>
                            ))}

                            {/* Ajuste de Descanso Padrão */}
                            <div className="flex flex-col items-center gap-2 mt-4 mb-2">
                                <label className="text-[10px] text-zinc-500 uppercase font-semibold">Tempo de Descanso Padrão</label>
                                <div className="flex items-center gap-2 px-3 py-2 bg-[#1A1A1A] border border-[#252525] rounded-xl focus-within:border-[#E8881A] transition-colors">
                                    <input 
                                        type="number" 
                                        value={descansoPersonalizado} 
                                        onChange={(e) => setDescansoPersonalizado(Number(e.target.value))} 
                                        className="w-14 bg-transparent text-center text-[#E0E0E0] font-bold text-lg outline-none"
                                        min="10" step="5"
                                    />
                                    <span className="text-zinc-500 text-sm font-medium">segundos</span>
                                </div>
                            </div>

                            <button
                                onClick={iniciar}
                                className="w-full mt-2 flex items-center justify-center gap-2 py-4 text-[15px] font-bold text-[#111] bg-gradient-to-r from-[#E8881A] to-[#F09530] rounded-xl cursor-pointer transition-all duration-200 hover:shadow-[0_0_30px_rgba(232,136,26,0.3)] active:scale-[0.98]"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="5 3 19 12 5 21 5 3" />
                                </svg>
                                Iniciar Treino
                            </button>
                        </div>
                    )}

                    {/* FASE: Série ativa */}
                    {fase === "serie" && exercicioAtual && (
                        <div className="flex flex-col p-5 gap-5">
                            {/* Exercise info */}
                            <div className="flex flex-col items-center py-3 gap-1">
                                <span className="text-[10px] font-semibold text-zinc-500 tracking-wide uppercase">Exercício {exercicioIdx + 1}/{exercicios.length}</span>
                                <h3 className="text-xl font-bold text-[#F0F0F0] tracking-tight text-center">{exercicioAtual.nome}</h3>
                                <span className="text-sm text-[#E8881A] font-semibold mt-1">
                                    Série {serieIdx + 1} de {totalSeries} · {exercicioAtual.repeticoes} reps
                                </span>
                            </div>

                            {/* Circular progress */}
                            <div className="flex justify-center">
                                <div className="relative w-[100px] h-[100px]">
                                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="42" fill="none" stroke="#1A1A1A" strokeWidth="6" />
                                        <circle cx="50" cy="50" r="42" fill="none" stroke="#E8881A" strokeWidth="6" strokeLinecap="round"
                                            strokeDasharray={`${2 * Math.PI * 42}`}
                                            strokeDashoffset={`${2 * Math.PI * 42 * (1 - (serieIdx / totalSeries))}`}
                                            style={{ transition: "stroke-dashoffset 0.5s ease" }}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-2xl font-bold text-[#E8881A]">{serieIdx + 1}</span>
                                        <span className="text-[10px] text-zinc-500">de {totalSeries}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Load input */}
                            <div>
                                <label className="block text-[11px] font-semibold text-zinc-500 tracking-wide uppercase mb-2">Carga utilizada</label>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1 flex-1 px-4 py-3 border border-[#2A2A2A] rounded-xl bg-[#181818] focus-within:border-[#E8881A] transition-colors">
                                        <input
                                            className="bg-transparent border-none outline-none text-[#E0E0E0] text-lg font-bold w-full font-sans text-center"
                                            type="number" min="0" step="0.5" placeholder="0"
                                            value={cargaAtual}
                                            onChange={(e) => setCargaAtual(e.target.value)}
                                            autoFocus
                                        />
                                        <span className="text-zinc-500 text-sm font-medium">kg</span>
                                    </div>
                                </div>
                                {/* Quick load buttons */}
                                <div className="flex gap-1.5 mt-2">
                                    {[-5, -2.5, 2.5, 5].map(delta => (
                                        <button key={delta} type="button"
                                            onClick={() => setCargaAtual(prev => String(Math.max(0, (Number(prev) || 0) + delta)))}
                                            className="flex-1 py-2 text-[12px] font-semibold rounded-lg border border-[#252525] bg-[#1A1A1A] text-zinc-400 hover:border-[#E8881A]/30 hover:text-[#E8881A] transition-all cursor-pointer active:scale-95"
                                        >
                                            {delta > 0 ? `+${delta}` : delta}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Complete set button */}
                            <button
                                onClick={concluirSerie}
                                className="w-full flex items-center justify-center gap-2 py-4 text-[15px] font-bold text-[#111] bg-gradient-to-r from-[#4ADE80] to-[#22C55E] rounded-xl cursor-pointer transition-all duration-200 hover:shadow-[0_0_30px_rgba(74,222,128,0.3)] active:scale-[0.98]"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                Concluir Série
                            </button>

                            {/* Progress info */}
                            <div className="flex items-center justify-center gap-3 text-[11px] text-zinc-500">
                                <span>{seriesFeitas}/{totalSeriesGeral} séries</span>
                                <span className="w-1 h-1 rounded-full bg-zinc-700" />
                                <span>{progressoPorcentagem}% concluído</span>
                            </div>
                        </div>
                    )}

                    {/* FASE: Descanso */}
                    {fase === "descanso" && (
                        <div className="flex flex-col items-center p-5 gap-5 py-8">
                            <span className="text-[10px] font-semibold text-zinc-500 tracking-wide uppercase">Tempo de descanso</span>

                            {/* Big timer */}
                            <div className="relative w-[160px] h-[160px]">
                                <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                                    <circle cx="80" cy="80" r="70" fill="none" stroke="#1A1A1A" strokeWidth="8" />
                                    <circle cx="80" cy="80" r="70" fill="none" stroke="#38BDF8" strokeWidth="8" strokeLinecap="round"
                                        strokeDasharray={`${2 * Math.PI * 70}`}
                                        strokeDashoffset={`${2 * Math.PI * 70 * (1 - descansoPercent / 100)}`}
                                        style={{ transition: "stroke-dashoffset 1s linear" }}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-4xl font-bold text-[#38BDF8] tracking-tight tabular-nums">
                                        {minutos}:{String(segundos).padStart(2, "0")}
                                    </span>
                                    <span className="text-[11px] text-zinc-500 mt-1">restantes</span>
                                </div>
                            </div>

                            {/* Next up info */}
                            <div className="text-center">
                                <span className="text-[11px] text-zinc-500 uppercase tracking-wide font-semibold">Próximo</span>
                                <p className="text-sm font-semibold text-[#E0E0E0] mt-1">
                                    {serieIdx + 1 < totalSeries
                                        ? `${exercicioAtual.nome} — Série ${serieIdx + 2}`
                                        : exercicioIdx + 1 < exercicios.length
                                            ? `${exercicios[exercicioIdx + 1].nome} — Série 1`
                                            : "Finalização"
                                    }
                                </p>
                            </div>

                            <button
                                onClick={pularDescanso}
                                className="flex items-center gap-2 py-3 px-8 text-[13px] font-semibold text-zinc-400 bg-transparent border border-[#2A2A2A] rounded-xl cursor-pointer transition-all hover:border-[#38BDF8]/40 hover:text-[#38BDF8]"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="5 4 15 12 5 20 5 4" /><line x1="19" y1="5" x2="19" y2="19" />
                                </svg>
                                Pular Descanso
                            </button>
                        </div>
                    )}

                    {/* FASE: Concluído */}
                    {fase === "concluido" && (
                        <div className="flex flex-col items-center p-5 gap-5 py-8">
                            <div className="w-20 h-20 rounded-2xl bg-[#4ADE80]/10 border border-[#4ADE80]/20 flex items-center justify-center text-[#4ADE80] animate-pulse">
                                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-[#4ADE80] tracking-tight">Treino Concluído! 🔥</h3>
                            <p className="text-sm text-zinc-500">{treino.nome}</p>

                            {/* Summary */}
                            <div className="w-full grid grid-cols-3 gap-3 mt-2">
                                <div className="flex flex-col items-center gap-1 p-3 rounded-xl bg-[#E8881A]/5 border border-[#E8881A]/15">
                                    <span className="text-[10px] font-semibold text-zinc-500 uppercase">Séries</span>
                                    <span className="text-lg font-bold text-[#E8881A]">{registros.length}</span>
                                </div>
                                <div className="flex flex-col items-center gap-1 p-3 rounded-xl bg-[#4ADE80]/5 border border-[#4ADE80]/15">
                                    <span className="text-[10px] font-semibold text-zinc-500 uppercase">Exercícios</span>
                                    <span className="text-lg font-bold text-[#4ADE80]">{exercicios.length}</span>
                                </div>
                                <div className="flex flex-col items-center gap-1 p-3 rounded-xl bg-[#38BDF8]/5 border border-[#38BDF8]/15">
                                    <span className="text-[10px] font-semibold text-zinc-500 uppercase">Duração</span>
                                    <span className="text-lg font-bold text-[#38BDF8]">{tempoInicio ? Math.round((new Date() - tempoInicio) / 60000) : 0}min</span>
                                </div>
                            </div>

                            {/* Load summary */}
                            <div className="w-full flex flex-col gap-2 mt-2">
                                <span className="text-[10px] font-semibold text-zinc-500 tracking-wide uppercase">Cargas registradas</span>
                                {exercicios.map((ex, i) => {
                                    const cargasDoEx = registros.filter(r => r.exercicioIdx === i);
                                    if (cargasDoEx.length === 0) return null;
                                    return (
                                        <div key={i} className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#1A1A1A] border border-[#252525]">
                                            <span className="text-[12px] text-zinc-400 truncate">{ex.nome}</span>
                                            <div className="flex gap-1">
                                                {cargasDoEx.map((c, j) => (
                                                    <span key={j} className="px-1.5 py-[1px] rounded text-[10px] font-semibold bg-[#E8881A]/10 border border-[#E8881A]/20 text-[#E8881A]">{c.carga}kg</span>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <button
                                onClick={() => onClose()}
                                disabled={salvando}
                                className="w-full mt-2 flex items-center justify-center gap-2 py-4 text-[15px] font-bold text-[#111] bg-gradient-to-r from-[#4ADE80] to-[#22C55E] rounded-xl cursor-pointer transition-all duration-200 hover:shadow-[0_0_30px_rgba(74,222,128,0.3)] disabled:opacity-50"
                            >
                                {salvando ? "Salvando..." : "Finalizar"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
