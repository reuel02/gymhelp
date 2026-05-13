import { useState, useEffect } from 'react';

export default function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isInstallable, setIsInstallable] = useState(false);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e) => {
            // Previne que o prompt do Chrome/Android apareça de forma forçada
            e.preventDefault();
            // Guarda o evento para o podermos invocar com o nosso botão
            setDeferredPrompt(e);
            setIsInstallable(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // Oculta o nosso botão após a app ser instalada
        window.addEventListener('appinstalled', () => {
            setIsInstallable(false);
            setDeferredPrompt(null);
        });

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        // Dispara o prompt nativo guardado
        deferredPrompt.prompt();

        // Aguarda a interação do utilizador (Aceitou ou Recusou?)
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            console.log('App instalada com sucesso!');
        }

        // Reset
        setDeferredPrompt(null);
        setIsInstallable(false);
    };

    if (!isInstallable) return null;

    // Componente flutuante estilo notificação (Bottom Sheet)
    return (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-sm bg-[#1A1A1A] border border-[#E8881A]/30 rounded-2xl p-4 shadow-2xl flex items-center justify-between font-sans animate-in slide-in-from-bottom-5">
            <div className="flex flex-col">
                <span className="text-[#F0F0F0] text-sm font-bold tracking-tight">Instalar GYMHelp</span>
                <span className="text-zinc-400 text-xs mt-0.5">Acesso rápido e offline no telemóvel.</span>
            </div>
            <button 
                onClick={handleInstallClick}
                className="bg-gradient-to-r from-[#E8881A] to-[#F09530] text-[#111] px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap active:scale-95 transition-transform cursor-pointer"
            >
                Instalar App
            </button>
        </div>
    );
}
