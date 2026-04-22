import FormTMB from "@/components/Dieta/FormTMB";
import PainelDieta from "@/components/Dieta/PainelDieta";
import ModalRefeicao from "@/components/Dieta/ModalRefeicao";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "@/lib/supabase";

export default function Dieta() {
    // TMB states
    const [peso, setPeso] = useState('')
    const [altura, setAltura] = useState('')
    const [idade, setIdade] = useState('')
    const [genero, setGenero] = useState('')
    const [atividade, setAtividade] = useState('')

    // Dieta states
    const [diaSelecionado, setDiaSelecionado] = useState('Segunda')
    const [refeicoes, setRefeicoes] = useState([])
    const [abrirModal, setAbrirModal] = useState(false)
    const [modoEdicao, setModoEdicao] = useState(false)
    const [refeicaoEditando, setRefeicaoEditando] = useState(null)
    const [tipo, setTipo] = useState('')
    const [alimentos, setAlimentos] = useState([])
    const [observacoes, setObservacoes] = useState('')
    const [salvando, setSalvando] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        buscarRefeicoes()
    }, [])

    function calcularTMB(peso, altura, idade, genero, atividade) {
        const p = Number(peso)
        const a = Number(altura)
        const i = Number(idade)
        const fator = Number(atividade)

        let tmb

        if (genero === 'M') {
            tmb = 10 * p + 6.25 * a - 5 * i + 5
        } else {
            tmb = 10 * p + 6.25 * a - 5 * i - 161
        }

        const get = tmb * fator

        return { tmb, get }
    }

    async function buscarRefeicoes() {
        try {
            const { data: { user } } = await supabase.auth.getUser()

            if (user) {
                const { data, error } = await supabase.from("refeicoes").select()
                if (data) {
                    setRefeicoes(data)
                }
            } else {
                alert("Necessário fazer login")
                navigate("/login")
            }
        } catch (error) {
            alert("Erro ao buscar refeições: " + error.message)
        }
    }

    function abrirModalNovo() {
        setModoEdicao(false)
        setRefeicaoEditando(null)
        setTipo('')
        setAlimentos([])
        setObservacoes('')
        setAbrirModal(true)
    }

    function abrirModalEdicao(refeicao) {
        setModoEdicao(true)
        setRefeicaoEditando(refeicao)
        setTipo(refeicao.tipo)
        setAlimentos(refeicao.alimentos || [])
        setObservacoes(refeicao.observacoes || '')
        setAbrirModal(true)
    }

    async function salvarRefeicao() {
        if (salvando) return
        setSalvando(true)

        try {
            const { data: dadosUsuario } = await supabase.auth.getUser()
            if (!dadosUsuario?.user) throw new Error("Usuário não está logado.")

            if (modoEdicao && refeicaoEditando) {
                const { error } = await supabase.from('refeicoes').update({
                    tipo,
                    alimentos,
                    observacoes,
                }).eq('id', refeicaoEditando.id)

                if (error) throw error
                alert("Refeição editada com sucesso!")
            } else {
                const { error } = await supabase.from('refeicoes').insert({
                    usuario_id: dadosUsuario.user.id,
                    dia: diaSelecionado,
                    tipo,
                    alimentos,
                    observacoes,
                })

                if (error) throw error
                alert("Refeição salva com sucesso!")
            }

            setAbrirModal(false)
            buscarRefeicoes()
        } catch (error) {
            alert("Erro ao salvar refeição: " + error.message)
        } finally {
            setSalvando(false)
        }
    }

    async function removerRefeicao(refeicao) {
        if (!confirm(`Excluir refeição "${refeicao.tipo}" de ${refeicao.dia}?`)) return

        try {
            const { error } = await supabase.from("refeicoes").delete().eq('id', refeicao.id)
            if (error) throw error
            alert("Refeição excluída.")
            buscarRefeicoes()
        } catch (error) {
            alert("Erro ao excluir: " + error.message)
        }
    }

    return (
        <div className="min-h-screen bg-fundo">
            <Sidebar />
            <div className="lg:ml-64 flex flex-col min-h-screen">
                <Header />
                <main className="flex flex-col pb-24 lg:pb-0">
                    <FormTMB
                        peso={peso} setPeso={setPeso}
                        altura={altura} setAltura={setAltura}
                        idade={idade} setIdade={setIdade}
                        genero={genero} setGenero={setGenero}
                        atividade={atividade} setAtividade={setAtividade}
                        calcularTMB={calcularTMB}
                    />

                    <PainelDieta
                        diaSelecionado={diaSelecionado}
                        setDiaSelecionado={setDiaSelecionado}
                        refeicoes={refeicoes}
                        onAdicionarRefeicao={abrirModalNovo}
                        onEditarRefeicao={abrirModalEdicao}
                        onRemoverRefeicao={removerRefeicao}
                    />
                </main>
            </div>

            {abrirModal && (
                <ModalRefeicao
                    onClose={setAbrirModal}
                    dia={diaSelecionado}
                    tipo={tipo}
                    setTipo={setTipo}
                    alimentos={alimentos}
                    setAlimentos={setAlimentos}
                    observacoes={observacoes}
                    setObservacoes={setObservacoes}
                    onSalvar={salvarRefeicao}
                    salvando={salvando}
                    modoEdicao={modoEdicao}
                />
            )}
        </div>
    )
}