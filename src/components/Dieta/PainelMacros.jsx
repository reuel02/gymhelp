function IconChart() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 20V10M12 20V4M6 20v-6" />
        </svg>
    );
}

function IconFire() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" />
        </svg>
    );
}

export default function PainelMacros({ macrosTotais, metaCalorias = 0 }) {

    const porcentagemCalorias = metaCalorias > 0
        ? Math.min(Math.round((macrosTotais.calorias / metaCalorias) * 100), 100)
        : 0;

    const macros = [
        {
            label: "Proteínas",
            valor: macrosTotais.proteinas,
            unidade: "g",
            cor: {
                bg: "rgba(59, 130, 246, 0.08)",
                border: "rgba(59, 130, 246, 0.2)",
                text: "#60A5FA",
                bar: "#3B82F6",
            },
        },
        {
            label: "Carboidratos",
            valor: macrosTotais.carboidratos,
            unidade: "g",
            cor: {
                bg: "rgba(34, 197, 94, 0.08)",
                border: "rgba(34, 197, 94, 0.2)",
                text: "#4ADE80",
                bar: "#22C55E",
            },
        },
        {
            label: "Gorduras",
            valor: macrosTotais.gorduras,
            unidade: "g",
            cor: {
                bg: "rgba(234, 179, 8, 0.08)",
                border: "rgba(234, 179, 8, 0.2)",
                text: "#FACC15",
                bar: "#EAB308",
            },
        },
    ];

    const totalMacrosGramas = macrosTotais.proteinas + macrosTotais.carboidratos + macrosTotais.gorduras;

    return (
        <div className="flex justify-center items-start px-3 sm:px-4 pb-6 font-sans">
            <div className="w-full max-w-[700px] flex flex-col bg-[#161616] border border-[#222] rounded-2xl overflow-hidden">

                {/* Barra top */}
                <div className="h-1 w-full bg-gradient-to-r from-[#E8881A] to-[#F09530]" />

                {/* Header */}
                <div className="flex items-center justify-between px-5 sm:px-6 pt-5 sm:pt-6 pb-4 gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#E8881A]/10 border border-[#E8881A]/20 rounded-xl flex items-center justify-center text-[#E8881A] shrink-0">
                            <IconChart />
                        </div>
                        <div>
                            <h2 className="text-[17px] font-semibold text-[#F0F0F0] tracking-tight leading-snug">
                                Resumo Nutricional
                            </h2>
                            <p className="text-xs text-zinc-500 mt-0.5">
                                Macros e calorias do plano alimentar
                            </p>
                        </div>
                    </div>
                </div>

                <div className="h-px bg-[#1F1F1F]" />

                {/* Calorias Totais */}
                <div className="px-5 sm:px-6 py-5 sm:py-6">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 px-4 sm:px-5 py-4 rounded-xl bg-[#E8881A]/5 border border-[#E8881A]/15">
                        <div className="flex items-center gap-3 flex-1">
                            <div className="w-9 h-9 rounded-lg bg-[#E8881A]/15 flex items-center justify-center text-[#E8881A] shrink-0">
                                <IconFire />
                            </div>
                            <div>
                                <span className="block text-[11px] font-semibold text-zinc-500 tracking-wide uppercase">
                                    Calorias Totais
                                </span>
                                <div className="flex items-baseline gap-1.5 mt-0.5">
                                    <span className="text-2xl font-bold text-[#E8881A] tracking-tight">
                                        {macrosTotais.calorias}
                                    </span>
                                    <span className="text-sm text-zinc-500 font-medium">kcal</span>
                                    {metaCalorias > 0 && (
                                        <>
                                            <span className="text-zinc-600 text-sm">/</span>
                                            <span className="text-sm text-zinc-400 font-medium">
                                                {metaCalorias} kcal
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Barra de progresso calorias */}
                        {metaCalorias > 0 && (
                            <div className="flex items-center gap-3 flex-1 sm:max-w-[200px]">
                                <div className="flex-1 h-2 bg-[#1E1E1E] rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-500 ease-out"
                                        style={{
                                            width: `${porcentagemCalorias}%`,
                                            background: "linear-gradient(90deg, #E8881A, #F09530)",
                                        }}
                                    />
                                </div>
                                <span className="text-[12px] font-semibold text-[#E8881A] shrink-0 min-w-[36px] text-right">
                                    {porcentagemCalorias}%
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="h-px bg-[#1F1F1F]" />

                {/* Macros */}
                <div className="px-5 sm:px-6 py-5 sm:py-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {macros.map((macro) => {
                            const porcentagem = totalMacrosGramas > 0
                                ? Math.round((macro.valor / totalMacrosGramas) * 100)
                                : 0;

                            return (
                                <div
                                    key={macro.label}
                                    className="flex flex-col gap-3 p-4 rounded-xl border transition-all duration-150"
                                    style={{
                                        background: macro.cor.bg,
                                        borderColor: macro.cor.border,
                                    }}
                                >
                                    <div className="flex items-center justify-between">
                                        <span
                                            className="text-[11px] font-semibold tracking-wide uppercase"
                                            style={{ color: macro.cor.text }}
                                        >
                                            {macro.label}
                                        </span>
                                        <span
                                            className="text-[10px] font-medium px-1.5 py-[1px] rounded"
                                            style={{
                                                background: macro.cor.bg,
                                                border: `1px solid ${macro.cor.border}`,
                                                color: macro.cor.text,
                                            }}
                                        >
                                            {porcentagem}%
                                        </span>
                                    </div>

                                    <div className="flex items-baseline gap-1">
                                        <span
                                            className="text-xl font-bold tracking-tight"
                                            style={{ color: macro.cor.text }}
                                        >
                                            {macro.valor}
                                        </span>
                                        <span className="text-xs text-zinc-500 font-medium">
                                            {macro.unidade}
                                        </span>
                                    </div>

                                    {/* Barra do macro */}
                                    <div className="h-1.5 bg-[#1E1E1E] rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-500 ease-out"
                                            style={{
                                                width: `${porcentagem}%`,
                                                background: macro.cor.bar,
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 bg-[#131313] border-t border-[#1A1A1A]">
                    <span className="text-[12px] text-zinc-500">
                        Total de macronutrientes
                    </span>
                    <span className="flex items-center gap-3 text-[12px]">
                        <span className="font-semibold text-blue-400">P {macrosTotais.proteinas}g</span>
                        <span className="text-zinc-700">·</span>
                        <span className="font-semibold text-green-400">C {macrosTotais.carboidratos}g</span>
                        <span className="text-zinc-700">·</span>
                        <span className="font-semibold text-yellow-400">G {macrosTotais.gorduras}g</span>
                    </span>
                </div>

            </div>
        </div>
    );
}
