import { useState } from "react";
import { MdClose } from "react-icons/md";
import supabase from "@/lib/supabase";

const TIPOS_REFEICAO = ["Café da manhã", "Almoço", "Lanche", "Jantar", "Pré-treino", "Pós-treino"];

function IconSearch() {
    return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
        </svg>
    );
}

function IconLoader() {
    return (
        <svg className="animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
    );
}

export default function ModalRefeicao({ onClose, dia, tipo, setTipo, alimentos, setAlimentos, observacoes, setObservacoes, onSalvar, salvando, modoEdicao }) {
    const [buscandoIndex, setBuscandoIndex] = useState(null);
    const [sugestoes, setSugestoes] = useState([]);
    const [sugestaoIndex, setSugestaoIndex] = useState(null);

    function adicionarAlimento() {
        setAlimentos([...alimentos, { nome: "", quantidade: "100", calorias: "", proteina: "", carboidrato: "", gordura: "", fibra: "" }]);
    }

    function removerAlimento(index) {
        setAlimentos(alimentos.filter((_, i) => i !== index));
        if (sugestaoIndex === index) {
            setSugestoes([]);
            setSugestaoIndex(null);
        }
    }

    function atualizarAlimento(index, campo, valor) {
        const lista = [...alimentos];
        lista[index][campo] = valor;
        setAlimentos(lista);
    }

    async function buscarAlimentos(index, texto) {
        atualizarAlimento(index, 'nome', texto);

        if (texto.length < 2) {
            setSugestoes([]);
            setSugestaoIndex(null);
            return;
        }

        setSugestaoIndex(index);
        setBuscandoIndex(index);

        try {
            const { data, error } = await supabase
                .from('alimentos')
                .select('nome, calorias, proteina, carboidrato, gordura, fibra')
                .ilike('nome', `%${texto}%`)
                .limit(8);

            if (error) throw error;
            setSugestoes(data || []);
        } catch (error) {
            console.error("Erro ao buscar alimentos:", error);
            setSugestoes([]);
        } finally {
            setBuscandoIndex(null);
        }
    }

    function selecionarAlimento(index, alimento) {
        const qtd = Number(alimentos[index].quantidade) || 100;
        const fator = qtd / 100;

        const lista = [...alimentos];
        lista[index] = {
            ...lista[index],
            nome: alimento.nome,
            calorias: String(Math.round(Number(alimento.calorias) * fator)),
            proteina: String((Number(alimento.proteina) * fator).toFixed(1)),
            carboidrato: String((Number(alimento.carboidrato) * fator).toFixed(1)),
            gordura: String((Number(alimento.gordura) * fator).toFixed(1)),
            fibra: String((Number(alimento.fibra) * fator).toFixed(1)),
        };
        setAlimentos(lista);
        setSugestoes([]);
        setSugestaoIndex(null);
    }

    function recalcularPorQuantidade(index, novaQtd) {
        atualizarAlimento(index, 'quantidade', novaQtd);

        const al = alimentos[index];
        if (!al.nome || al.calorias === "") return;

        // Busca o alimento original pra recalcular
        supabase
            .from('alimentos')
            .select('calorias, proteina, carboidrato, gordura, fibra')
            .eq('nome', al.nome)
            .single()
            .then(({ data }) => {
                if (!data) return;
                const fator = (Number(novaQtd) || 100) / 100;
                const lista = [...alimentos];
                lista[index] = {
                    ...lista[index],
                    quantidade: novaQtd,
                    calorias: String(Math.round(Number(data.calorias) * fator)),
                    proteina: String((Number(data.proteina) * fator).toFixed(1)),
                    carboidrato: String((Number(data.carboidrato) * fator).toFixed(1)),
                    gordura: String((Number(data.gordura) * fator).toFixed(1)),
                    fibra: String((Number(data.fibra) * fator).toFixed(1)),
                };
                setAlimentos(lista);
            });
    }

    const formularioInvalido = tipo === "" || alimentos.length === 0 || alimentos.some(al => al.nome === "" || al.calorias === "");

    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/70 backdrop-blur-sm p-4 font-sans">
            <div className="w-full max-w-[680px] max-h-[90vh] flex flex-col bg-[#161616] border border-[#222] rounded-2xl shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between p-5 px-6 shrink-0">
                    <div className="flex items-center gap-2.5">
                        <span className="w-[34px] h-[34px] bg-[#E8881A]/10 border border-[#E8881A]/20 rounded-lg flex items-center justify-center">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E8881A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3" />
                            </svg>
                        </span>
                        <div>
                            <span className="text-lg font-semibold text-[#F0F0F0] tracking-tight">
                                {modoEdicao ? "Editar Refeição" : "Nova Refeição"}
                            </span>
                            <span className="block text-[11px] text-zinc-500 mt-0.5">{dia}</span>
                        </div>
                    </div>
                    <button
                        onClick={() => onClose(false)}
                        className="p-1 rounded-lg text-zinc-400 hover:text-[#E8881A] hover:bg-[#E8881A]/10 transition-colors"
                    >
                        <MdClose className="size-6" />
                    </button>
                </div>

                <div className="h-px bg-[#1F1F1F] mx-6 shrink-0" />

                {/* Corpo com scroll */}
                <div className="overflow-y-auto flex-1">

                    {/* Tipo de refeição */}
                    <div className="p-5 px-6">
                        <label className="block text-xs font-semibold text-zinc-500 tracking-wide uppercase mb-3">
                            Tipo de refeição
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {TIPOS_REFEICAO.map((t) => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => setTipo(t)}
                                    className={`py-[7px] px-[14px] text-[13px] font-medium rounded-lg cursor-pointer transition-all duration-150 font-sans border
                                        ${tipo === t
                                            ? "bg-[#E8881A]/20 border-[#E8881A] text-[#E8881A] shadow-[0_0_12px_rgba(232,136,26,0.12)]"
                                            : "bg-[#1E1E1E] border-[#333] text-zinc-400 hover:bg-[#E8881A]/10 hover:border-[#E8881A] hover:text-[#E8881A]"
                                        }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="h-px bg-[#1F1F1F] mx-6" />

                    {/* Alimentos */}
                    <div className="p-5 px-6">
                        <div className="flex items-center justify-between mb-3.5">
                            <label className="block text-xs font-semibold text-zinc-500 tracking-wide uppercase">Alimentos</label>
                            <button
                                type="button"
                                className="flex items-center gap-1.5 py-1.5 px-3 text-xs font-semibold text-[#E8881A] bg-[#E8881A]/10 border-none rounded-md cursor-pointer transition-colors duration-150 font-sans tracking-wide hover:bg-[#E8881A] hover:text-[#111]"
                                onClick={adicionarAlimento}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                    <path d="M12 5v14M5 12h14" />
                                </svg>
                                Adicionar
                            </button>
                        </div>

                        {/* Linhas de alimentos */}
                        {alimentos.map((al, i) => (
                            <div key={i} className="mb-3 bg-[#1A1A1A] border border-[#252525] rounded-xl p-3 transition-all duration-150 hover:border-[#333]">
                                {/* Linha 1: Nome + Quantidade */}
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="relative flex-[3] min-w-0">
                                        <div className="flex items-center bg-[#181818] border border-[#2A2A2A] rounded-lg focus-within:border-[#E8881A] transition-colors">
                                            <input
                                                className="flex-1 bg-transparent border-none outline-none py-2 px-2.5 text-[13px] text-[#E0E0E0] font-sans min-w-0"
                                                type="text"
                                                placeholder={i === 0 ? "Buscar alimento..." : "Buscar alimento..."}
                                                value={al.nome}
                                                onChange={(e) => buscarAlimentos(i, e.target.value)}
                                                onBlur={() => setTimeout(() => { if (sugestaoIndex === i) { setSugestoes([]); setSugestaoIndex(null); }}, 200)}
                                            />
                                            <span className="pr-2.5 text-zinc-600 shrink-0">
                                                {buscandoIndex === i ? <IconLoader /> : <IconSearch />}
                                            </span>
                                        </div>

                                        {/* Dropdown de sugestões */}
                                        {sugestaoIndex === i && sugestoes.length > 0 && (
                                            <div className="absolute top-full left-0 right-0 mt-1 bg-[#1A1A1A] border border-[#333] rounded-lg shadow-2xl z-50 max-h-[200px] overflow-y-auto">
                                                {sugestoes.map((sug, j) => (
                                                    <button
                                                        key={j}
                                                        type="button"
                                                        className="w-full flex items-center justify-between px-3 py-2 text-left text-[12px] text-zinc-300 hover:bg-[#E8881A]/10 hover:text-[#E8881A] transition-colors cursor-pointer border-b border-[#222] last:border-b-0"
                                                        onMouseDown={() => selecionarAlimento(i, sug)}
                                                    >
                                                        <span className="truncate flex-1">{sug.nome}</span>
                                                        <span className="text-[10px] text-zinc-500 shrink-0 ml-2">
                                                            {Math.round(Number(sug.calorias))} kcal
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-1 px-2 border border-[#2A2A2A] rounded-lg bg-[#181818] focus-within:border-[#E8881A] transition-colors w-20 shrink-0 py-2">
                                        <input
                                            className="bg-transparent border-none outline-none text-[#E0E0E0] text-[13px] w-full font-sans text-center"
                                            type="number"
                                            placeholder="100"
                                            min="1"
                                            value={al.quantidade}
                                            onChange={(e) => recalcularPorQuantidade(i, e.target.value)}
                                        />
                                        <span className="text-zinc-500 text-[11px] whitespace-nowrap">g</span>
                                    </div>

                                    <button
                                        type="button"
                                        className="w-8 h-8 flex items-center justify-center bg-transparent border border-transparent rounded-lg cursor-pointer text-[#444] transition-all duration-150 shrink-0 p-0 hover:text-[#E8441A] hover:border-[#E8441A]/20 hover:bg-[#E8441A]/10"
                                        onClick={() => removerAlimento(i)}
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                            <path d="M18 6L6 18M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Linha 2: Macros (badges) */}
                                <div className="flex items-center gap-2 flex-wrap">
                                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#E8881A]/8 border border-[#E8881A]/15">
                                        <span className="text-[10px] font-semibold text-zinc-500 uppercase">Kcal</span>
                                        <span className="text-[12px] font-bold text-[#E8881A] min-w-[24px] text-center">{al.calorias || "—"}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-500/8 border border-blue-500/15">
                                        <span className="text-[10px] font-semibold text-zinc-500 uppercase">Prot</span>
                                        <span className="text-[12px] font-bold text-blue-400 min-w-[24px] text-center">{al.proteina || "—"}</span>
                                        <span className="text-[10px] text-zinc-600">g</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-green-500/8 border border-green-500/15">
                                        <span className="text-[10px] font-semibold text-zinc-500 uppercase">Carb</span>
                                        <span className="text-[12px] font-bold text-green-400 min-w-[24px] text-center">{al.carboidrato || "—"}</span>
                                        <span className="text-[10px] text-zinc-600">g</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-yellow-500/8 border border-yellow-500/15">
                                        <span className="text-[10px] font-semibold text-zinc-500 uppercase">Gord</span>
                                        <span className="text-[12px] font-bold text-yellow-400 min-w-[24px] text-center">{al.gordura || "—"}</span>
                                        <span className="text-[10px] text-zinc-600">g</span>
                                    </div>
                                    {al.fibra && (
                                        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/8 border border-emerald-500/15">
                                            <span className="text-[10px] font-semibold text-zinc-500 uppercase">Fibra</span>
                                            <span className="text-[12px] font-bold text-emerald-400 min-w-[24px] text-center">{al.fibra}</span>
                                            <span className="text-[10px] text-zinc-600">g</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Hint */}
                        <div className="flex items-center gap-1.5 mt-2.5 text-xs text-zinc-500 leading-relaxed">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 8v4M12 16h.01" />
                            </svg>
                            <span>Digite o nome do alimento para buscar na tabela TACO (597 alimentos brasileiros).</span>
                        </div>
                    </div>

                    <div className="h-px bg-[#1F1F1F] mx-6" />

                    {/* Observações */}
                    <div className="p-5 px-6">
                        <label className="block text-xs font-semibold text-zinc-500 tracking-wide uppercase mb-3">
                            Observações <span className="font-normal normal-case tracking-normal text-zinc-400 text-[11px]">(opcional)</span>
                        </label>
                        <textarea
                            className="w-full bg-[#181818] border border-[#2A2A2A] rounded-lg py-2.5 px-3.5 text-[13px] text-[#E0E0E0] outline-none transition-colors duration-150 font-sans resize-y box-border leading-relaxed focus:border-[#E8881A]"
                            rows={2}
                            placeholder="Ex: Sem glúten, usar azeite de oliva..."
                            value={observacoes}
                            onChange={(e) => setObservacoes(e.target.value)}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-2.5 py-4 px-6 bg-[#131313] border-t border-[#1F1F1F] shrink-0">
                    <button
                        type="button"
                        onClick={() => onClose(false)}
                        className="py-[9px] px-[18px] text-[13px] font-medium text-[#888] bg-transparent border border-[#2A2A2A] rounded-lg cursor-pointer transition-colors duration-150 font-sans hover:border-[#555] hover:text-[#bbb]"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        className={`flex items-center gap-1.5 py-[9px] px-5 text-[13px] font-semibold text-[#111] bg-[#E8881A] border-none rounded-lg transition-colors font-sans
                            ${formularioInvalido || salvando
                                ? "opacity-50 cursor-not-allowed"
                                : "cursor-pointer hover:bg-[#F09530]"
                            }`}
                        disabled={formularioInvalido || salvando}
                        onClick={onSalvar}
                    >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                            <polyline points="17 21 17 13 7 13 7 21" />
                            <polyline points="7 3 7 8 15 8" />
                        </svg>
                        {salvando ? "Salvando..." : (modoEdicao ? "Salvar Alterações" : "Salvar Refeição")}
                    </button>
                </div>
            </div>
        </div>
    );
}
