import ModalTreino from "@/components/ModalTreino";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import TabelaTreino from "@/components/TabelaTreino";
import { useState } from "react";

export default function Treino() {
    const [abrirModal, setAbrirModal] = useState(false)

    return (
        <div className="min-h-screen bg-fundo">
            <Sidebar />
            <div className="lg:ml-64 flex flex-col min-h-screen">
                <Header />
                <main className="flex-1">
                    <TabelaTreino onModal={setAbrirModal} />
                </main>
            </div>
            {abrirModal && (
                <ModalTreino onClose={setAbrirModal} />
            )}
        </div>
    )
}