import ModalTreino from "@/components/Treino/ModalTreino";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import TabelaTreino from "@/components/Treino/TabelaTreino";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "@/lib/supabase";
import { ModalEdicaoTreino } from "@/components/Treino/ModalEdicaoTreino";
import { ModalDeletarTreino } from "@/components/Treino/ModalDeletarTreino";
import CardTreino from "@/components/Treino/CardTreino";

export default function Treino() {
    const [abrirModal, setAbrirModal] = useState(false)
    const [abrirModalEdicao, setAbrirModalEdicao] = useState(false)
    const [abrirModalDeletar, setAbrirModalDeletar] = useState(false)
    const [treinoParaDeletar, setTreinoParaDeletar] = useState(null)
    const [treinos, setTreinos] = useState([])
    const [treino, setTreino] = useState({})
    const [nome, setNome] = useState("")
    const [dia, setDia] = useState("")
    const [exercicios, setExercicios] = useState([])
    const [observacoes, setObservacoes] = useState("")
    const [salvando, setSalvando] = useState(false)
    const [erro, setErro] = useState("")
    const navigate = useNavigate()

    useEffect(() => {

        buscarDados()
    }, [])

    function adicionarExercicioVazio() {
        setExercicios([
            ...exercicios,
            {
                nome: "",
                series: "",
                repeticoes: "",
                carga: ""
            }
        ])
    }

    function removerExercicio(i) {
        const novaLista = exercicios.filter((_, index) => index !== i);

        setExercicios(novaLista)
    }

    async function buscarDados() {
        try {
            const { data: { user } } = await supabase.auth.getUser()

            if (user) {
                const { data, error } = await supabase.from("treinos").select()
                if (data) {
                    setTreinos(data)
                } else {
                    throw new Error("Nenhum treino encontrado.")
                }
            } else {
                alert("Necessário fazer login")
                navigate("/login")
                throw new Error("Necessário fazer login")
            }

        } catch (error) {
            setErro(error.message)
        }
    }

    async function salvarTreino() {
        if (salvando) return;

        setSalvando(true)

        try {
            const { data: dadosUsuario } = await supabase.auth.getUser()

            if (!dadosUsuario?.user) throw new Error("Usuário não está logado.")

            const { data, error } = await supabase.from('treinos').insert({
                usuario_id: dadosUsuario.user.id,
                nome,
                dia,
                observacoes,
                exercicios
            })

            if (error) {
                throw error
            }

            alert("Treino salvo com sucesso!")

            setAbrirModal(false)

            buscarDados()
        } catch (error) {
            setErro(error.message)
            alert("Erro ao salvar treino " + error.message)
        } finally {
            setSalvando(false)
        }
    }

    async function atualizarTreino() {
        if (salvando) return;

        setSalvando(true)

        try {
            const { data: dadosUsuario } = await supabase.auth.getUser()

            if (!dadosUsuario?.user) throw new Error("Usuário não está logado.")

            const { data, error } = await supabase.from('treinos').update({
                usuario_id: dadosUsuario.user.id,
                nome,
                dia,
                observacoes,
                exercicios
            }).eq('id', treino.id)

            if (error) {
                throw error
            }

            alert("Treino editado com sucesso!")

            setAbrirModalEdicao(false)

            buscarDados()
        } catch (error) {
            setErro(error.message)
            alert("Erro ao editar treino " + error.message)
        } finally {
            setSalvando(false)
        }
    }

    async function deletarTreinoConfirmado() {
        if (!treinoParaDeletar || salvando) return;
        setSalvando(true);

        try {
            const { error } = await supabase.from("treinos").delete().eq('id', treinoParaDeletar.id)

            if (error) throw error

            alert("Treino deletado.")

            setTreinoParaDeletar(null)
            setAbrirModalDeletar(false)
            buscarDados()
        } catch (error) {
            setErro(error.message)
            alert("Erro ao excluir treino: " + error.message)
        } finally {
            setSalvando(false)
        }
    }

    function prepararDelecao(treinoAlvo) {
        setTreinoParaDeletar(treinoAlvo)
        setAbrirModalDeletar(true)
    }

    function abrirModalParaEdicao(treinoAlvo) {
        setTreino(treinoAlvo) // Guarda o treino inteiro (pra sabermos o ID depois)
        setNome(treinoAlvo.nome)
        setDia(treinoAlvo.dia)
        setExercicios(treinoAlvo.exercicios)
        setObservacoes(treinoAlvo.observacoes || "")

        setAbrirModalEdicao(true) // Pronto, dados injetados, agora pode abrir o modal!
    }


    return (
        <div className="min-h-screen bg-fundo">
            <Sidebar />
            <div className="lg:ml-64 flex flex-col min-h-screen">
                <Header />
                <main className="flex flex-col pb-24 lg:pb-0">
                    <TabelaTreino onModal={setAbrirModal} onModalEdicao={abrirModalParaEdicao} treinos={treinos} erro={erro} removerTreino={prepararDelecao} />

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4 sm:px-6 pb-10 mt-7">
                        {treinos.map((treino) => (
                            <CardTreino key={treino.id} treino={treino} onModalEdicao={setAbrirModalEdicao} removerTreino={prepararDelecao} />
                        ))}
                    </div>
                </main>
            </div>
            {abrirModal && (
                <ModalTreino onClose={setAbrirModal} setDia={setDia} setNome={setNome}
                    setExercicios={setExercicios} setObservacoes={setObservacoes} exercicios={exercicios}
                    adicionarExercicioVazio={adicionarExercicioVazio} dia={dia} removerExercicio={removerExercicio}
                    nome={nome} salvarTreino={salvarTreino} salvando={salvando}
                />
            )}

            {abrirModalEdicao && (
                <ModalEdicaoTreino onClose={setAbrirModalEdicao} setDia={setDia} setNome={setNome}
                    setExercicios={setExercicios} setObservacoes={setObservacoes} exercicios={exercicios}
                    adicionarExercicioVazio={adicionarExercicioVazio} dia={dia} removerExercicio={removerExercicio}
                    nome={nome} atualizarTreino={atualizarTreino} salvando={salvando} treino={treino} observacoes={observacoes}
                />
            )}

            {abrirModalDeletar && (
                <ModalDeletarTreino
                    onClose={setAbrirModalDeletar}
                    onConfirm={deletarTreinoConfirmado}
                    treino={treinoParaDeletar}
                    salvando={salvando}
                />
            )}
        </div>
    )
}