import { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import supabase from "../lib/supabase";
import { FiPlus, FiCamera, FiTrendingUp, FiTrendingDown, FiMinus } from "react-icons/fi";

function DecimalInput({ label, value, onChange, suffix = "", placeholder = "0.0" }) {
    return (
        <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide">{label}</label>
            <div className="flex items-center gap-2 px-3 py-2.5 border border-[#2A2A2A] rounded-xl bg-[#181818] focus-within:border-[#E8881A] transition-colors">
                <input
                    type="number"
                    step="0.1"
                    placeholder={placeholder}
                    className="bg-transparent border-none outline-none text-[#E0E0E0] w-full font-medium"
                    value={value}
                    onChange={(e) => {
                        let val = e.target.value;
                        if (val.includes(".")) {
                            const [int, dec] = val.split(".");
                            val = `${int}.${dec.slice(0, 1)}`;
                        }
                        onChange(val);
                    }}
                />
                {suffix && <span className="text-zinc-500 text-xs font-semibold shrink-0">{suffix}</span>}
            </div>
        </div>
    );
}

function ImageSlider({ imageBefore, imageAfter, label }) {
    const [sliderValue, setSliderValue] = useState(50);
    return (
        <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-zinc-400 text-center">{label}</span>
            <div className="relative w-full aspect-[3/4] overflow-hidden rounded-xl select-none group bg-[#161616] border border-[#222]">
                {/* Before Image */}
                {imageBefore ? (
                    <img src={imageBefore} alt="Antes" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-600 gap-2 bg-[#111]">
                        <FiCamera className="size-6" />
                        <span className="text-xs">Sem foto Anterior</span>
                    </div>
                )}

                {/* After Image */}
                {imageAfter ? (
                    <img
                        src={imageAfter}
                        alt="Depois"
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{ clipPath: `inset(0 ${100 - sliderValue}% 0 0)` }}
                    />
                ) : (
                    <div
                        className="absolute inset-0 flex flex-col items-center justify-center text-zinc-600 gap-2 bg-[#111]"
                        style={{ clipPath: `inset(0 ${100 - sliderValue}% 0 0)` }}
                    >
                        <FiCamera className="size-6" />
                        <span className="text-xs">Sem foto Atual</span>
                    </div>
                )}

                {/* Slider Input */}
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderValue}
                    onChange={(e) => setSliderValue(e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-10 touch-none"
                />

                {/* Custom Slider Line */}
                <div
                    className="absolute top-0 bottom-0 w-0.5 bg-white pointer-events-none z-0"
                    style={{ left: `${sliderValue}%` }}
                >
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-lg border border-zinc-200">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 18l-6-6 6-6M9 18l6-6-6-6" />
                            <path d="M11 6L5 12L11 18M13 6L19 12L13 18" />
                        </svg>
                    </div>
                </div>

                {/* Labels */}
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold text-white uppercase tracking-wider">Antes</div>
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold text-white uppercase tracking-wider">Depois</div>
            </div>
        </div>
    );
}

export default function Evolucao() {
    const [checkins, setCheckins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState("gallery"); // gallery | new | compare
    const [userId, setUserId] = useState(null);

    // Form states
    const [weight, setWeight] = useState("");
    const [bodyFat, setBodyFat] = useState("");
    const [measurements, setMeasurements] = useState({
        peitoral: "", braco: "", cintura: "", abdomen: "", coxa: "", panturrilha: ""
    });
    const [tags, setTags] = useState("");
    const [photos, setPhotos] = useState({ front: null, side: null, back: null });
    const [photoPreviews, setPhotoPreviews] = useState({ front: null, side: null, back: null });
    const [saving, setSaving] = useState(false);

    // Compare states
    const [compareIdA, setCompareIdA] = useState("");
    const [compareIdB, setCompareIdB] = useState("");

    useEffect(() => {
        carregarCheckins();
    }, []);

    async function carregarCheckins() {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            setUserId(user.id);
            const { data } = await supabase
                .from("progress_checkins")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });
            setCheckins(data || []);
            
            if (data && data.length >= 2) {
                setCompareIdA(data[1].id);
                setCompareIdB(data[0].id);
            } else if (data && data.length === 1) {
                setCompareIdA(data[0].id);
                setCompareIdB(data[0].id);
            }
        }
        setLoading(false);
    }

    const handlePhotoChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            setPhotos((prev) => ({ ...prev, [type]: file }));
            setPhotoPreviews((prev) => ({ ...prev, [type]: URL.createObjectURL(file) }));
        }
    };

    const uploadPhoto = async (file, type) => {
        if (!file) return null;
        const ext = file.name.split(".").pop();
        const fileName = `${userId}/${Date.now()}_${type}.${ext}`;
        const { error } = await supabase.storage.from("evolution_photos").upload(fileName, file, { cacheControl: "3600", upsert: false });
        if (error) {
            console.error("Erro ao fazer upload da foto:", error);
            return null;
        }
        const { data } = supabase.storage.from("evolution_photos").getPublicUrl(fileName);
        return data.publicUrl;
    };

    const salvarCheckin = async () => {
        setSaving(true);
        try {
            // Upload photos sequentially to avoid issues
            const photoFrontUrl = await uploadPhoto(photos.front, "front");
            const photoSideUrl = await uploadPhoto(photos.side, "side");
            const photoBackUrl = await uploadPhoto(photos.back, "back");

            const tagsArray = tags.split(",").map(t => t.trim()).filter(t => t);

            const payload = {
                user_id: userId,
                weight: weight ? Number(weight) : null,
                body_fat: bodyFat ? Number(bodyFat) : null,
                measurements,
                tags: tagsArray,
                photo_front_url: photoFrontUrl,
                photo_side_url: photoSideUrl,
                photo_back_url: photoBackUrl,
            };

            const { error } = await supabase.from("progress_checkins").insert(payload);
            if (error) throw error;

            // Limpar form
            setWeight(""); setBodyFat(""); setTags("");
            setMeasurements({ peitoral: "", braco: "", cintura: "", abdomen: "", coxa: "", panturrilha: "" });
            setPhotos({ front: null, side: null, back: null });
            setPhotoPreviews({ front: null, side: null, back: null });

            await carregarCheckins();
            setView("gallery");
        } catch (err) {
            alert("Erro ao salvar check-in. Verifique se configurou a tabela e o bucket corretamente.");
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const renderDiff = (valA, valB, inverse = false) => {
        if (!valA || !valB) return <span className="text-zinc-500">-</span>;
        const diff = Number(valB) - Number(valA);
        if (diff === 0) return <span className="text-zinc-500 flex items-center gap-1"><FiMinus /> 0.0</span>;
        
        // Se inverse = true (ex: BF e Peso), diff negativo é bom (verde)
        const isGood = inverse ? diff < 0 : diff > 0;
        const color = isGood ? "text-green-400" : "text-red-400";
        const Icon = diff > 0 ? FiTrendingUp : FiTrendingDown;

        return (
            <span className={`flex items-center gap-1 ${color} font-bold text-sm`}>
                <Icon /> {diff > 0 ? "+" : ""}{diff.toFixed(1)}
            </span>
        );
    };

    const checkinA = checkins.find(c => c.id === compareIdA);
    const checkinB = checkins.find(c => c.id === compareIdB);

    return (
        <div className="flex h-screen bg-[#09090b]">
            <Sidebar />
            <div className="flex-1 flex flex-col lg:ml-64 w-full h-full overflow-hidden relative">
                <Header />

                <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-24 lg:pb-6">
                    <div className="max-w-4xl mx-auto space-y-6">
                        
                        {/* Page Title */}
                        <div className="flex flex-col gap-1 px-1 mt-2">
                            <h1 className="text-xl sm:text-2xl font-bold text-[#F0F0F0] tracking-tight">
                                Marcos de Evolução 📈
                            </h1>
                            <p className="text-sm text-zinc-500">
                                Acompanhe seu progresso físico com fotos e medidas
                            </p>
                        </div>

                        {/* Top Nav */}
                        <div className="flex items-center justify-between bg-[#161616] p-1.5 rounded-xl border border-[#222]">
                            <div className="flex gap-1">
                                <button
                                    onClick={() => setView("gallery")}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${view === "gallery" ? "bg-[#252525] text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200"}`}
                                >
                                    Galeria
                                </button>
                                <button
                                    onClick={() => setView("compare")}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${view === "compare" ? "bg-[#252525] text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200"}`}
                                >
                                    Comparar
                                </button>
                            </div>
                            <button
                                onClick={() => setView("new")}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold bg-[#E8881A] text-[#111] hover:bg-[#F09530] transition-colors"
                            >
                                <FiPlus className="size-4" /> Novo Check-in
                            </button>
                        </div>

                        {loading ? (
                            <div className="text-center text-zinc-500 py-10">Carregando...</div>
                        ) : (
                            <>
                                {/* VIEW: GALLERY */}
                                {view === "gallery" && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {checkins.length === 0 ? (
                                            <div className="col-span-full text-center py-10 bg-[#161616] border border-[#222] rounded-2xl">
                                                <FiCamera className="size-8 text-zinc-600 mx-auto mb-3" />
                                                <p className="text-zinc-400 font-medium">Nenhum check-in registrado ainda.</p>
                                                <button onClick={() => setView("new")} className="mt-4 text-[#E8881A] font-bold hover:underline">Registrar o primeiro</button>
                                            </div>
                                        ) : (
                                            checkins.map((checkin) => (
                                                <div key={checkin.id} className="bg-[#161616] border border-[#222] rounded-2xl p-5 flex flex-col gap-4">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <span className="text-white font-bold text-lg">
                                                                {new Date(checkin.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
                                                            </span>
                                                            <div className="flex gap-2 mt-2">
                                                                {checkin.tags?.map(t => (
                                                                    <span key={t} className="px-2 py-0.5 bg-[#252525] border border-[#333] rounded-md text-[10px] text-zinc-300 font-medium uppercase">{t}</span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            {checkin.weight && <div className="text-[#E8881A] font-black text-xl">{checkin.weight} <span className="text-xs text-zinc-500 font-medium">kg</span></div>}
                                                            {checkin.body_fat && <div className="text-zinc-400 font-bold text-sm">{checkin.body_fat}% <span className="text-xs font-normal">BF</span></div>}
                                                        </div>
                                                    </div>

                                                    {/* Thumbnails */}
                                                    <div className="grid grid-cols-3 gap-2 mt-2">
                                                        {[checkin.photo_front_url, checkin.photo_side_url, checkin.photo_back_url].map((url, i) => (
                                                            <div key={i} className="aspect-[3/4] bg-[#111] rounded-lg border border-[#222] overflow-hidden flex items-center justify-center">
                                                                {url ? <img src={url} alt="Progresso" className="w-full h-full object-cover" /> : <FiCamera className="text-zinc-700" />}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}

                                {/* VIEW: COMPARE */}
                                {view === "compare" && checkins.length > 0 && (
                                    <div className="bg-[#161616] border border-[#222] rounded-2xl p-5">
                                        <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
                                            <div className="flex-1 w-full">
                                                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Antes (A)</label>
                                                <select
                                                    value={compareIdA}
                                                    onChange={e => setCompareIdA(e.target.value)}
                                                    className="w-full mt-1 bg-[#111] border border-[#2A2A2A] rounded-xl px-3 py-2.5 text-white outline-none focus:border-[#E8881A]"
                                                >
                                                    {checkins.map(c => (
                                                        <option key={c.id} value={c.id}>{new Date(c.created_at).toLocaleDateString("pt-BR")}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="hidden md:flex h-10 w-10 shrink-0 items-end justify-center pb-2 text-zinc-600 font-black">VS</div>
                                            <div className="flex-1 w-full">
                                                <label className="text-xs font-semibold text-[#E8881A] uppercase tracking-wide">Depois (B)</label>
                                                <select
                                                    value={compareIdB}
                                                    onChange={e => setCompareIdB(e.target.value)}
                                                    className="w-full mt-1 bg-[#111] border border-[#E8881A]/40 rounded-xl px-3 py-2.5 text-white outline-none focus:border-[#E8881A]"
                                                >
                                                    {checkins.map(c => (
                                                        <option key={c.id} value={c.id}>{new Date(c.created_at).toLocaleDateString("pt-BR")}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        {checkinA && checkinB && (
                                            <div className="space-y-8">
                                                {/* Stats Diff */}
                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                                    <div className="bg-[#111] border border-[#222] p-4 rounded-xl flex flex-col items-center">
                                                        <span className="text-[10px] uppercase text-zinc-500 font-bold mb-1">Peso</span>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-lg text-white font-black">{checkinB.weight || "-"}</span>
                                                            {renderDiff(checkinA.weight, checkinB.weight, true)}
                                                        </div>
                                                    </div>
                                                    <div className="bg-[#111] border border-[#222] p-4 rounded-xl flex flex-col items-center">
                                                        <span className="text-[10px] uppercase text-zinc-500 font-bold mb-1">BF %</span>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-lg text-white font-black">{checkinB.body_fat || "-"}</span>
                                                            {renderDiff(checkinA.body_fat, checkinB.body_fat, true)}
                                                        </div>
                                                    </div>
                                                    <div className="bg-[#111] border border-[#222] p-4 rounded-xl flex flex-col items-center">
                                                        <span className="text-[10px] uppercase text-zinc-500 font-bold mb-1">Cintura</span>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-lg text-white font-black">{checkinB.measurements?.cintura || "-"}</span>
                                                            {renderDiff(checkinA.measurements?.cintura, checkinB.measurements?.cintura, true)}
                                                        </div>
                                                    </div>
                                                    <div className="bg-[#111] border border-[#222] p-4 rounded-xl flex flex-col items-center">
                                                        <span className="text-[10px] uppercase text-zinc-500 font-bold mb-1">Braço</span>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-lg text-white font-black">{checkinB.measurements?.braco || "-"}</span>
                                                            {renderDiff(checkinA.measurements?.braco, checkinB.measurements?.braco, false)}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Sliders */}
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                    <ImageSlider label="Frente" imageBefore={checkinA.photo_front_url} imageAfter={checkinB.photo_front_url} />
                                                    <ImageSlider label="Lado" imageBefore={checkinA.photo_side_url} imageAfter={checkinB.photo_side_url} />
                                                    <ImageSlider label="Costas" imageBefore={checkinA.photo_back_url} imageAfter={checkinB.photo_back_url} />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* VIEW: NEW CHECKIN */}
                                {view === "new" && (
                                    <div className="bg-[#161616] border border-[#222] rounded-2xl p-5 md:p-8 space-y-8">
                                        
                                        <div>
                                            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4"><FiTrendingUp className="text-[#E8881A]"/> Composição Corporal</h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <DecimalInput label="Peso" value={weight} onChange={setWeight} suffix="kg" />
                                                <DecimalInput label="Body Fat" value={bodyFat} onChange={setBodyFat} suffix="%" />
                                            </div>
                                        </div>

                                        <hr className="border-[#222]" />

                                        <div>
                                            <h3 className="text-lg font-bold text-white mb-4">Medidas (cm)</h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                                <DecimalInput label="Peitoral" value={measurements.peitoral} onChange={(v) => setMeasurements({...measurements, peitoral: v})} suffix="cm" />
                                                <DecimalInput label="Braço" value={measurements.braco} onChange={(v) => setMeasurements({...measurements, braco: v})} suffix="cm" />
                                                <DecimalInput label="Cintura" value={measurements.cintura} onChange={(v) => setMeasurements({...measurements, cintura: v})} suffix="cm" />
                                                <DecimalInput label="Abdômen" value={measurements.abdomen} onChange={(v) => setMeasurements({...measurements, abdomen: v})} suffix="cm" />
                                                <DecimalInput label="Coxa" value={measurements.coxa} onChange={(v) => setMeasurements({...measurements, coxa: v})} suffix="cm" />
                                                <DecimalInput label="Panturrilha" value={measurements.panturrilha} onChange={(v) => setMeasurements({...measurements, panturrilha: v})} suffix="cm" />
                                            </div>
                                        </div>

                                        <hr className="border-[#222]" />

                                        <div>
                                            <h3 className="text-lg font-bold text-white mb-4">Fotos</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                {["front", "side", "back"].map((type) => (
                                                    <div key={type} className="flex flex-col gap-2">
                                                        <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide">
                                                            {type === "front" ? "Frente" : type === "side" ? "Lado" : "Costas"}
                                                        </span>
                                                        <label className="relative w-full aspect-[3/4] bg-[#111] border-2 border-dashed border-[#2A2A2A] hover:border-[#E8881A] active:border-[#E8881A] active:bg-[#1A1A1A] transition-colors rounded-xl flex items-center justify-center cursor-pointer overflow-hidden group">
                                                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handlePhotoChange(e, type)} />
                                                            {photoPreviews[type] ? (
                                                                <>
                                                                    <img src={photoPreviews[type]} alt={type} className="w-full h-full object-cover" />
                                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                        <span className="text-xs font-bold text-white bg-[#E8881A] px-3 py-1.5 rounded-lg">Trocar</span>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <div className="flex flex-col items-center gap-2 text-zinc-600 group-hover:text-[#E8881A]">
                                                                    <FiCamera className="size-8" />
                                                                    <span className="text-xs font-semibold">Adicionar Foto</span>
                                                                </div>
                                                            )}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <hr className="border-[#222]" />

                                        <div>
                                            <h3 className="text-lg font-bold text-white mb-4">Tags</h3>
                                            <input 
                                                type="text" 
                                                placeholder="Ex: bulking, semana 4, cutting..."
                                                className="w-full bg-[#111] border border-[#2A2A2A] rounded-xl px-4 py-3 text-white outline-none focus:border-[#E8881A]"
                                                value={tags}
                                                onChange={e => setTags(e.target.value)}
                                            />
                                            <p className="text-[10px] text-zinc-500 mt-1.5">Separe as tags por vírgulas.</p>
                                        </div>

                                        <button
                                            onClick={salvarCheckin}
                                            disabled={saving || (!weight && !photos.front)}
                                            className="w-full flex items-center justify-center gap-2 py-4 text-[15px] font-bold text-[#111] bg-gradient-to-r from-[#E8881A] to-[#F09530] rounded-xl cursor-pointer transition-all duration-200 hover:shadow-[0_0_30px_rgba(232,136,26,0.3)] disabled:opacity-50 disabled:shadow-none"
                                        >
                                            {saving ? "Salvando e enviando fotos..." : "Salvar Check-in"}
                                        </button>

                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
