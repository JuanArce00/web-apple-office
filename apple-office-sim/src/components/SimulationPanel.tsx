import { useState, useMemo, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { ShoppingCart, Calculator, ArrowRight, CheckCircle2, Smartphone, HelpCircle } from 'lucide-react';

export default function SimulationPanel() {
    const { data } = useData();

    // --- STATE ---
    const [currentStep, setCurrentStep] = useState(1);

    const [selectedModel, setSelectedModel] = useState<string | null>(null);
    const [selectedCapacity, setSelectedCapacity] = useState<number | null>(null);
    const [selectedBattery, setSelectedBattery] = useState<string | null>(null);

    const [hasTradeIn, setHasTradeIn] = useState<boolean | null>(null);
    const [tradeInModel, setTradeInModel] = useState<string | null>(null);
    const [tradeInCapacity, setTradeInCapacity] = useState<number | null>(null);
    const [tradeInBattery, setTradeInBattery] = useState<string | null>(null);

    const [cashAdvanceUSD, setCashAdvanceUSD] = useState<number | ''>('');
    const [cashAdvanceARS, setCashAdvanceARS] = useState<number | ''>('');

    const [selectedCard, setSelectedCard] = useState<string | null>(null);
    const [selectedInstallments, setSelectedInstallments] = useState<number | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isModalOpen]);

    // --- DERIVED DATA ---
    const matchedIphone = useMemo(() => {
        if (!selectedModel || !selectedCapacity || !selectedBattery) return null;
        // Buscamos ignorando el color
        return data.iphoneStock.find(s =>
            s.model === selectedModel &&
            s.capacity_gb === selectedCapacity &&
            s.battery_status === selectedBattery
        );
    }, [selectedModel, selectedCapacity, selectedBattery, data.iphoneStock]);

    const tradeInDiscountUSD = useMemo(() => {
        if (!hasTradeIn || !tradeInModel || !tradeInCapacity || !tradeInBattery) return 0;
        const match = data.tradeInPrices.find(b =>
            b.model === tradeInModel &&
            b.capacity_gb === tradeInCapacity &&
            b.battery_range === tradeInBattery
        );
        return match ? match.price_usd : 0;
    }, [hasTradeIn, tradeInModel, tradeInCapacity, tradeInBattery, data.tradeInPrices]);
    const tradeInDiscountARS = tradeInDiscountUSD * data.config.dollar_value;

    const subtotalIphoneUSD = matchedIphone ? matchedIphone.price_usd : 0;
    const subtotalIphoneARS = subtotalIphoneUSD * data.config.dollar_value;

    const totalPurchaseARS = subtotalIphoneARS; 

    const cashAdvanceResolvedUSD = Number(cashAdvanceUSD) || 0;
    const cashAdvanceResolvedARSFromUSD = cashAdvanceResolvedUSD * data.config.dollar_value;
    const cashAdvanceResolvedARSFromARS = Number(cashAdvanceARS) || 0;

    const contribTradeInARS = tradeInDiscountARS;
    const contribCashARS = cashAdvanceResolvedARSFromUSD + cashAdvanceResolvedARSFromARS;

    const missingBeforeCardARS = Math.max(0, totalPurchaseARS - contribTradeInARS - contribCashARS);
    const contribCardARS = selectedCard ? missingBeforeCardARS : 0;
    const remainingToCoverARS = Math.max(0, missingBeforeCardARS - contribCardARS);

    const canCheckout = (totalPurchaseARS > 0) && (remainingToCoverARS === 0);

    const financingPlan = useMemo(() => {
        if (!selectedCard || !selectedInstallments) return null;
        return data.plans.find(f => f.card_name === selectedCard && f.installments === selectedInstallments);
    }, [selectedCard, selectedInstallments, data.plans]);

    const cardConfig = useMemo(() => {
        if (!selectedCard) return null;
        return data.cards.find(c => c.card_name === selectedCard);
    }, [selectedCard, data.cards]);

    const finalFinancedTotalARS = useMemo(() => {
        if (!financingPlan || !cardConfig) return contribCardARS;
        return contribCardARS * cardConfig.base_factor * financingPlan.surcharge_coefficient;
    }, [contribCardARS, financingPlan, cardConfig]);

    const monthlyInstallmentARS = financingPlan ? finalFinancedTotalARS / financingPlan.installments : finalFinancedTotalARS;

    // --- HANDLERS ---
    const resetAll = () => {
        setCurrentStep(1);
        setSelectedModel(null);
        setSelectedCapacity(null);
        setSelectedBattery(null);
        setHasTradeIn(null);
        setTradeInModel(null);
        setTradeInCapacity(null);
        setTradeInBattery(null);
        setCashAdvanceUSD('');
        setCashAdvanceARS('');
        setSelectedCard(null);
        setSelectedInstallments(null);
        setIsModalOpen(false);
    };

    const handleNextStep = () => {
        if (canCheckout && (currentStep === 4 || currentStep === 5)) {
            setIsModalOpen(true);
        } else if (currentStep === 2) {
            if (hasTradeIn) {
                setCurrentStep(3);
            } else {
                setCurrentStep(4);
            }
        } else if (currentStep < 5) {
            setCurrentStep(s => s + 1);
        }
    };

    const handlePrevStep = () => {
        if (currentStep === 4 && !hasTradeIn) {
            setCurrentStep(2);
        } else {
            setCurrentStep(prev => Math.max(1, prev - 1));
        }
    };

    const TITLES = [
        "Equipo",
        "¿Canje?",
        "Detalle",
        "Efectivo",
        "Cuotas"
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 relative items-start">

            {/* Columna Izquierda: Flujo de Pasos */}
            <div className="lg:col-span-8 flex flex-col h-full relative">

                {/* Indicadores de Progreso */}
                <div className="flex items-center justify-between mb-8 relative">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 -translate-y-1/2 rounded-full hidden sm:block"></div>

                    {TITLES.map((title, idx) => {
                        const stepNum = idx + 1;
                        const isPast = stepNum < currentStep;
                        const isActive = stepNum === currentStep;
                        const isSkipped = !hasTradeIn && stepNum === 3;

                        return (
                            <div key={title} className={`flex flex-col items-center gap-2 group relative z-0 cursor-default ${isSkipped ? 'opacity-30' : ''}`}>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ring-4 ring-[#fbfbfd] ${isActive ? 'bg-emerald-500 text-black shadow-lg scale-110' : isPast ? 'bg-black text-white' : 'bg-gray-200 text-gray-400'}`}>
                                    {isPast ? <CheckCircle2 className="w-6 h-6" /> : stepNum}
                                </div>
                                <span className={`text-[10px] sm:text-xs font-bold text-center transition-all absolute -bottom-6 w-max ${isActive ? 'text-black' : isPast ? 'text-gray-900' : 'text-gray-400'}`}>
                                    {title}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Contenedor del Paso Activo */}
                <div className="bg-white rounded-[2rem] p-6 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:min-h-[500px] flex flex-col border border-gray-50 mt-4">

                    {currentStep === 1 && (
                        <div className="flex-1 animate-in fade-in slide-in-from-right-8 duration-500">
                            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-8 flex items-center gap-3">
                                <ShoppingCart className="w-8 h-8 text-emerald-500" />
                                Configurá tu nuevo iPhone
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                <div>
                                    <label className="block text-xs md:text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Modelo</label>
                                    <select
                                        value={selectedModel || ''}
                                        onChange={(e) => setSelectedModel(e.target.value)}
                                        className="w-full px-4 py-4 rounded-xl border-2 border-gray-100 font-bold bg-white text-gray-900 focus:border-emerald-500 outline-none"
                                    >
                                        <option value="" disabled>Seleccioná modelo</option>
                                        {data.models.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs md:text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Capacidad</label>
                                    <select
                                        value={selectedCapacity === null ? '' : selectedCapacity}
                                        onChange={(e) => setSelectedCapacity(Number(e.target.value))}
                                        className="w-full px-4 py-4 rounded-xl border-2 border-gray-100 font-bold bg-white text-gray-900 focus:border-emerald-500 outline-none"
                                    >
                                        <option value="" disabled>Seleccioná capacidad</option>
                                        {data.capacities.map(c => <option key={c} value={c}>{c} GB</option>)}
                                    </select>
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-xs md:text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Estado Batería</label>
                                    <select
                                        value={selectedBattery || ''}
                                        onChange={(e) => setSelectedBattery(e.target.value)}
                                        className="w-full px-4 py-4 rounded-xl border-2 border-gray-100 font-bold bg-white text-gray-900 focus:border-emerald-500 outline-none"
                                    >
                                        <option value="" disabled>Seleccioná rango de batería</option>
                                        {data.batteries.map(b => <option key={b} value={b}>{b}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-100">
                                {selectedModel && selectedCapacity && selectedBattery ? (
                                    matchedIphone ? (
                                        <div className="flex justify-between items-center bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                                            <div className="flex items-center gap-4">
                                                <div className="bg-white p-3 rounded-xl shadow-sm"><Smartphone className="w-8 h-8 text-emerald-500" /></div>
                                                <div>
                                                    <h4 className="font-extrabold text-emerald-900 text-lg">Inversión del equipo</h4>
                                                    <p className="text-emerald-700 font-medium mt-1">{matchedIphone.model} {matchedIphone.capacity_gb}GB</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-extrabold text-2xl text-emerald-600">U$D {matchedIphone.price_usd}</p>
                                                <p className="text-sm font-bold text-emerald-800 opacity-70 mt-1">AR$ {(matchedIphone.price_usd * data.config.dollar_value).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-red-50 p-6 rounded-2xl border border-red-100 text-red-600 font-semibold text-center">
                                            Lo sentimos. Esta combinación no está disponible en stock actualmente.
                                        </div>
                                    )
                                ) : (
                                    <div className="text-gray-400 font-medium text-center bg-gray-50 p-6 rounded-2xl border-2 border-dashed border-gray-100">
                                        Seleccioná modelo, capacidad y batería para ver el valor...
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="flex-1 animate-in fade-in slide-in-from-right-8 duration-500 flex flex-col items-center justify-center text-center py-10">
                            <div className="bg-emerald-50 p-6 rounded-full mb-8"><HelpCircle className="w-16 h-16 text-emerald-500" /></div>
                            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">¿Tenés un iPhone para entregar?</h2>
                            <p className="text-gray-500 font-medium mb-12 max-w-md">Tomamos tu equipo actual como parte de pago para que te lleves el nuevo.</p>

                            <div className="grid grid-cols-2 gap-6 w-full max-w-lg">
                                <button
                                    onClick={() => { setHasTradeIn(true); setCurrentStep(3); }}
                                    className="py-6 rounded-3xl font-black text-xl transition-all border-4 border-gray-100 bg-white hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50"
                                >
                                    SÍ, TENGO
                                </button>
                                <button
                                    onClick={() => { setHasTradeIn(false); setCurrentStep(4); }}
                                    className="py-6 rounded-3xl font-black text-xl transition-all border-4 border-gray-100 bg-white hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50"
                                >
                                    NO, SOLO COMPRA
                                </button>
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="flex-1 animate-in fade-in slide-in-from-right-8 duration-500">
                            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">Detalles de tu Canje</h2>
                            <p className="text-gray-500 font-medium mb-8">Configurá el equipo que entregás para calcular su valor de toma.</p>

                            <div className="bg-gray-50 p-6 md:p-8 rounded-3xl border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Modelo</label>
                                    <select
                                        className="w-full border-gray-200 rounded-xl px-4 py-4 font-semibold text-gray-800 bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                                        value={tradeInModel || ""}
                                        onChange={e => { setTradeInModel(e.target.value); setTradeInCapacity(null); setTradeInBattery(null); }}
                                    >
                                        <option value="" disabled>Seleccioná modelo</option>
                                        {Array.from(new Set(data.tradeInPrices.map(b => b.model))).map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Capacidad</label>
                                    <select
                                        className="w-full border-gray-200 rounded-xl px-4 py-4 font-semibold text-gray-800 bg-white disabled:opacity-50"
                                        value={tradeInCapacity || ""}
                                        onChange={e => { setTradeInCapacity(Number(e.target.value)); setTradeInBattery(null); }}
                                        disabled={!tradeInModel}
                                    >
                                        <option value="">--</option>
                                        {data.tradeInPrices.filter(b => b.model === tradeInModel).map(b => b.capacity_gb).filter((v, i, a) => a.indexOf(v) === i).map(c => <option key={c} value={c}>{c} GB</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Batería</label>
                                    <select
                                        className="w-full border-gray-200 rounded-xl px-4 py-4 font-semibold text-gray-800 bg-white disabled:opacity-50"
                                        value={tradeInBattery || ""}
                                        onChange={e => setTradeInBattery(e.target.value)}
                                        disabled={!tradeInCapacity}
                                    >
                                        <option value="">--</option>
                                        {data.tradeInPrices.filter(b => b.model === tradeInModel && b.capacity_gb === tradeInCapacity).map(b => b.battery_range).filter((v, i, a) => a.indexOf(v) === i).map(br => <option key={br} value={br}>{br}</option>)}
                                    </select>
                                </div>
                            </div>
                            {tradeInDiscountARS > 0 && (
                                <div className="mt-10 bg-emerald-50 text-emerald-900 p-8 rounded-3xl border-2 border-emerald-500 flex items-center justify-between shadow-xl">
                                    <div>
                                        <span className="font-bold text-lg">Te lo tomamos en:</span><br />
                                        <span className="text-sm font-bold text-emerald-600 opacity-80 mt-1 block tracking-wider uppercase">U$D {tradeInDiscountUSD} COTIZADO</span>
                                    </div>
                                    <span className="font-black text-3xl">AR$ {tradeInDiscountARS.toLocaleString()}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {currentStep === 4 && (
                        <div className="flex-1 animate-in fade-in slide-in-from-right-8 duration-500">
                            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">Efectivo / Transferencia</h2>
                            <p className="text-gray-500 font-medium mb-8">Ingresá si vas a realizar un pago inicial para reducir las cuotas.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 md:p-8 rounded-3xl border border-gray-100">
                                <div>
                                    <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Entrego en Dólares</label>
                                    <input
                                        type="number"
                                        className="w-full px-5 py-4 border-gray-200 rounded-2xl text-xl font-bold bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                                        placeholder="U$D 0"
                                        value={cashAdvanceUSD}
                                        onChange={e => setCashAdvanceUSD(e.target.value === '' ? '' : Number(e.target.value))}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Entrego en Pesos</label>
                                    <input
                                        type="number"
                                        className="w-full px-5 py-4 border-gray-200 rounded-2xl text-xl font-bold bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                                        placeholder="AR$ 0"
                                        value={cashAdvanceARS}
                                        onChange={e => setCashAdvanceARS(e.target.value === '' ? '' : Number(e.target.value))}
                                    />
                                </div>
                            </div>
                            {contribCashARS > 0 && (
                                <div className="mt-8 flex justify-between items-center text-emerald-800 font-black p-6 bg-emerald-50 rounded-2xl border border-emerald-100 shadow-sm">
                                    <span>Total aportado ahora:</span>
                                    <span className="text-2xl">AR$ {contribCashARS.toLocaleString()}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {currentStep === 5 && (
                        <div className="flex-1 animate-in fade-in slide-in-from-right-8 duration-500">
                            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2 flex items-center gap-3"><Calculator className="w-8 h-8 text-emerald-500" /> Saldo con Tarjeta</h2>
                            <p className="text-gray-500 font-medium mb-8">Si queda un resto pendiente, podés financiarlo acá.</p>
                            {missingBeforeCardARS === 0 ? (
                                <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-10 flex flex-col items-center justify-center text-center">
                                    <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
                                    <h3 className="text-xl font-bold text-emerald-900 mb-2">¡Monto Cubierto!</h3>
                                    <p className="text-emerald-700 font-medium">No necesitás tarjeta para completar el pago de este equipo.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Elegí tu Tarjeta</label>
                                        <div className="grid grid-cols-1 gap-3">
                                            {data.cards.map(c => (
                                                <button key={c.card_name} onClick={() => { setSelectedCard(selectedCard === c.card_name ? null : c.card_name); setSelectedInstallments(null); }} className={`px-6 py-4 rounded-2xl border-4 text-left font-black transition-all ${selectedCard === c.card_name ? 'border-emerald-500 bg-emerald-50 shadow-md' : 'border-gray-100 bg-white hover:border-gray-200'}`}>{c.card_name}</button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Planes de Cuotas</label>
                                        {selectedCard ? (
                                            <div className="grid grid-cols-2 gap-4">
                                                {data.plans.filter(f => f.card_name === selectedCard).map(f => (
                                                    <button key={f.id} onClick={() => setSelectedInstallments(f.installments)} className={`px-4 py-5 rounded-2xl border-4 text-center font-black transition-all flex flex-col items-center justify-center ${selectedInstallments === f.installments ? 'border-emerald-500 bg-emerald-50 shadow-md' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
                                                        <span className="text-3xl">{f.installments}</span><span className="text-xs font-bold uppercase text-emerald-600/70 mt-1">Cuotas</span>
                                                    </button>
                                                ))}
                                            </div>
                                        ) : <div className="text-sm font-medium text-gray-400 bg-gray-50 rounded-2xl p-8 border-2 border-dashed border-gray-200 h-full flex items-center justify-center text-center">Elegí un banco para ver los planes.</div>}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Navegación Inferior */}
                    <div className="mt-12 pt-6 border-t border-gray-100 flex justify-between items-center z-10 w-full">
                        <button onClick={handlePrevStep} className={`px-6 py-4 font-bold rounded-xl text-gray-500 hover:bg-gray-100 transition-colors ${currentStep === 1 ? 'invisible' : ''}`}>Volver</button>
                        <button
                            onClick={handleNextStep}
                            disabled={(currentStep === 1 && !matchedIphone) || (currentStep === 3 && !tradeInBattery) || (currentStep === 5 && !canCheckout)}
                            className={`px-8 py-4 rounded-xl font-black transition-all flex items-center gap-2 ${(currentStep === 2) ? 'hidden' : ((currentStep === 1 && !matchedIphone) || (currentStep === 5 && !canCheckout) ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-emerald-500 text-white hover:bg-emerald-400 shadow-lg')}`}
                        >
                            {currentStep >= 4 && canCheckout ? 'Finalizar' : 'Siguiente'}
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Columna Derecha: Resumen Flotante */}
            <div className="lg:col-span-4 sticky top-24">
                <div className="bg-white rounded-[2rem] p-8 shadow-[0_15px_40px_rgba(0,0,0,0.06)] border border-gray-100">
                    <h3 className="text-xl font-black mb-8 text-gray-900 border-b border-gray-50 pb-4 flex justify-between">Tu Resumen {canCheckout && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">OK</span>}</h3>
                    <div className="flex flex-col gap-6">
                        <div className="flex justify-between items-start">
                            <div className="flex flex-col"><span className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Nuevo iPhone</span><span className="font-extrabold">{selectedModel || '---'} {selectedCapacity ? `${selectedCapacity}GB` : ''}</span></div>
                            <span className="font-extrabold text-gray-900">AR$ {subtotalIphoneARS.toLocaleString()}</span>
                        </div>
                        {(contribTradeInARS > 0 || contribCashARS > 0 || contribCardARS > 0) && (
                            <div className="p-4 bg-gray-50 rounded-2xl flex flex-col gap-3">
                                {contribTradeInARS > 0 && <div className="flex justify-between text-emerald-600 font-bold text-xs"><span>Canje ({tradeInModel})</span><span>- AR$ {contribTradeInARS.toLocaleString()}</span></div>}
                                {contribCashARS > 0 && <div className="flex justify-between text-emerald-600 font-bold text-xs"><span>Efectivo/Pago Inic.</span><span>- AR$ {contribCashARS.toLocaleString()}</span></div>}
                                {contribCardARS > 0 && <div className="flex justify-between text-gray-900 font-bold text-xs"><span>A Financiar</span><span>- AR$ {contribCardARS.toLocaleString()}</span></div>}
                            </div>
                        )}
                        <div className={`p-6 rounded-3xl border-4 flex justify-between items-center transition-all ${remainingToCoverARS === 0 && totalPurchaseARS > 0 ? 'bg-emerald-50 border-emerald-500' : 'bg-white border-gray-100'}`}>
                            <span className="font-black text-xs uppercase text-gray-500">Restante</span>
                            <span className={`font-black text-2xl ${remainingToCoverARS === 0 && totalPurchaseARS > 0 ? 'text-emerald-500' : 'text-red-500'}`}>AR$ {remainingToCoverARS.toLocaleString()}</span>
                        </div>
                        {contribCardARS > 0 && selectedCard && selectedInstallments && (
                            <div className="p-6 bg-black rounded-[2rem] text-white shadow-xl">
                                <div className="text-[10px] font-black text-gray-500 mb-4 uppercase">Cuotas con {selectedCard}</div>
                                <div className="text-2xl font-black text-emerald-400">{selectedInstallments}x AR$ {Math.round(monthlyInstallmentARS).toLocaleString()}</div>
                                <div className="mt-4 pt-4 border-t border-gray-800 text-[10px] text-gray-400 font-bold uppercase">Total financiado: AR$ {Math.round(finalFinancedTotalARS).toLocaleString()}</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* MODAL DE ÉXITO */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xl">
                    <div className="bg-white rounded-[3rem] max-w-md w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in duration-300 border border-white/20">
                        <div className="overflow-y-auto p-10 custom-scrollbar flex-1">
                            <div className="w-24 h-24 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg"><CheckCircle2 className="w-12 h-12" /></div>
                            <h2 className="text-3xl font-black text-center mb-10 text-gray-900">¡Cotización Lista!</h2>
                            <div className="bg-gray-50 p-6 rounded-[2rem] flex flex-col gap-5 mb-8">
                                {/* NUEVO EQUIPO */}
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Nuevo Equipo</span>
                                    <div className="flex justify-between items-center text-gray-900">
                                        <span className="font-extrabold text-lg">{selectedModel} {selectedCapacity}GB</span>
                                        <span className="font-black">AR$ {subtotalIphoneARS.toLocaleString()}</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-400">Bateria {selectedBattery}</span>
                                </div>

                                <div className="h-px bg-gray-200"></div>

                                {/* CANJE (Si existe) */}
                                {contribTradeInARS > 0 && (
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Entregás (Canje)</span>
                                        <div className="flex justify-between items-center text-gray-600 font-bold">
                                            <span>{tradeInModel} {tradeInCapacity}GB</span>
                                            <span>- AR$ {contribTradeInARS.toLocaleString()}</span>
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-400">Bateria {tradeInBattery}</span>
                                    </div>
                                )}

                                {/* PAGOS */}
                                <div className="flex flex-col gap-2 pt-2 border-t border-dashed border-gray-300">
                                    {contribCashARS > 0 && (
                                        <div className="flex justify-between text-sm font-bold text-gray-600 italic">
                                            <span>Entrega en Efectivo</span>
                                            <span>- AR$ {contribCashARS.toLocaleString()}</span>
                                        </div>
                                    )}
                                    {contribCardARS > 0 && (
                                        <div className="flex flex-col gap-1">
                                            <div className="flex justify-between text-sm font-black text-emerald-600">
                                                <span>Financiado con {selectedCard}</span>
                                                <span>{selectedInstallments}x AR$ {Math.round(monthlyInstallmentARS).toLocaleString()}</span>
                                            </div>
                                            <span className="text-[9px] font-bold text-gray-400 text-right uppercase">Total financiado: AR$ {Math.round(finalFinancedTotalARS).toLocaleString()}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* GIFT SECTION */}
                            <div className="mb-10 animate-bounce-subtle">
                                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-[2px] rounded-3xl shadow-lg shadow-emerald-500/20">
                                    <div className="bg-white rounded-[calc(1.5rem-2px)] p-6 text-center">
                                        <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full mb-4">
                                            <ShoppingCart className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-xl font-black text-gray-900 mb-2 leading-tight tracking-tight">¡TENEMOS UN REGALO PARA VOS!</h3>
                                        <p className="text-gray-600 font-bold text-sm leading-relaxed px-2">
                                            Con tu compra, te regalamos {hasTradeIn ? '' : <span className="text-emerald-600">Cargador, </span>}
                                            cable, funda y film blindado!
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* WHATSAPP CTA (NEW) */}
                            {(() => {
                                const message = `¡Hola Apple Office! Acabo de realizar una cotización en la web y me interesa concretar la compra:

*NUEVO EQUIPO:* ${selectedModel} ${selectedCapacity}GB
*Salud:* ${selectedBattery}
*Valor:* AR$ ${subtotalIphoneARS.toLocaleString()}

${contribTradeInARS > 0 ? `*ENTREGO COMO CANJE:* ${tradeInModel} ${tradeInCapacity}GB (${tradeInBattery}) por AR$ ${contribTradeInARS.toLocaleString()}` : '*SIN CANJE*'}

*ENTREGA EFECTIVO:* AR$ ${contribCashARS.toLocaleString()}
${contribCardARS > 0 ? `*FINANCIACIÓN:* ${selectedInstallments} cuotas con ${selectedCard} (Cuota: AR$ ${Math.round(monthlyInstallmentARS).toLocaleString()})` : '*TOTAL CUBIERTO*'}

¿Me podrían confirmar disponibilidad y los pasos a seguir? ¡Gracias!`;
                                const whatsappUrl = `https://wa.me/5493855953712?text=${encodeURIComponent(message)}`;
                                
                                return (
                                    <div className="flex flex-col gap-3">
                                        <a 
                                            href={whatsappUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="w-full bg-[#25D366] text-white font-black text-xl py-6 rounded-[1.5rem] hover:bg-[#128C7E] active:scale-95 shadow-xl transition-all flex items-center justify-center gap-3"
                                        >
                                            <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                            </svg>
                                            Continuar por WhatsApp
                                        </a>
                                        <button onClick={resetAll} className="w-full text-gray-400 font-bold text-sm py-4 hover:text-black transition-all">Hacer otra cotización</button>
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
