import { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { ShoppingCart, Calculator, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function SimulationPanel() {
    const { data } = useData();

    // --- STATE ---
    const [currentStep, setCurrentStep] = useState(1);

    const [selectedModel, setSelectedModel] = useState<string | null>(null);
    const [selectedCapacity, setSelectedCapacity] = useState<number | null>(null);
    const [selectedBattery, setSelectedBattery] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);

    const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);

    const [tradeInModel, setTradeInModel] = useState<string | null>(null);
    const [tradeInCapacity, setTradeInCapacity] = useState<number | null>(null);
    const [tradeInBattery, setTradeInBattery] = useState<string | null>(null);

    const [cashAdvanceUSD, setCashAdvanceUSD] = useState<number | ''>('');
    const [cashAdvanceARS, setCashAdvanceARS] = useState<number | ''>('');

    const [selectedCard, setSelectedCard] = useState<string | null>(null);
    const [selectedInstallments, setSelectedInstallments] = useState<number | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);

    // --- DERIVED DATA ---
    const matchedIphone = useMemo(() => {
        if (!selectedModel || !selectedCapacity || !selectedBattery || !selectedColor) return null;
        return data.iphoneStock.find(s =>
            s.model === selectedModel &&
            s.capacity_gb === selectedCapacity &&
            s.battery_status === selectedBattery &&
            s.color === selectedColor
        );
    }, [selectedModel, selectedCapacity, selectedBattery, selectedColor, data.iphoneStock]);

    const accessoriesTotalUSD = useMemo(() => {
        return selectedAccessories.reduce((total, id) => {
            const acc = data.accessories.find(a => a.id === id);
            return total + (acc ? acc.price_usd : 0);
        }, 0);
    }, [selectedAccessories, data.accessories]);
    const accessoriesTotalARS = accessoriesTotalUSD * data.config.dollar_value;

    const tradeInDiscountUSD = useMemo(() => {
        if (!tradeInModel || !tradeInCapacity || !tradeInBattery) return 0;
        const match = data.tradeInPrices.find(b =>
            b.model === tradeInModel &&
            b.capacity_gb === tradeInCapacity &&
            b.battery_range === tradeInBattery
        );
        return match ? match.price_usd : 0;
    }, [tradeInModel, tradeInCapacity, tradeInBattery, data.tradeInPrices]);
    const tradeInDiscountARS = tradeInDiscountUSD * data.config.dollar_value;

    const subtotalIphoneUSD = matchedIphone ? matchedIphone.price_usd : 0;
    const subtotalIphoneARS = subtotalIphoneUSD * data.config.dollar_value;

    const totalPurchaseARS = subtotalIphoneARS + accessoriesTotalARS;

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
        setSelectedColor(null);
        setSelectedAccessories([]);
        setTradeInModel(null);
        setTradeInCapacity(null);
        setTradeInBattery(null);
        setCashAdvanceUSD('');
        setCashAdvanceARS('');
        setSelectedCard(null);
        setSelectedInstallments(null);
        setIsModalOpen(false);
    };

    const toggleAccessory = (id: string) => {
        setSelectedAccessories(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
    };

    const handleNextStep = () => {
        if (canCheckout && (currentStep === 4 || currentStep === 5)) {
            setIsModalOpen(true);
        } else if (currentStep < 5) {
            setCurrentStep(s => s + 1);
        }
    };

    const TITLES = [
        "Equipo",
        "Accesorios",
        "Canje",
        "Efectivo",
        "Tarjetas"
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 relative items-start">

            {/* Left Column: Stepper Flow */}
            <div className="lg:col-span-8 flex flex-col h-full relative">

                {/* Stepper Progress indicators */}
                <div className="flex items-center justify-between mb-8 relative">
                    {/* Line behind circles */}
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 -translate-y-1/2 rounded-full hidden sm:block"></div>

                    {TITLES.map((title, idx) => {
                        const stepNum = idx + 1;
                        const isPast = stepNum < currentStep;
                        const isActive = stepNum === currentStep;

                        return (
                            <div key={title} className="flex flex-col items-center gap-2 group relative z-0 cursor-default">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ring-4 ring-[#fbfbfd] ${isActive ? 'bg-emerald-500 text-black shadow-lg scale-110' : isPast ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'}`}>
                                    {isPast ? <CheckCircle2 className="w-6 h-6" /> : stepNum}
                                </div>
                                <span className={`text-[10px] sm:text-xs font-bold text-center transition-all absolute -bottom-6 w-max ${isActive ? 'text-black' : isPast ? 'text-gray-900' : 'text-gray-400'}`}>
                                    {title}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Active Step Container */}
                <div className="bg-white rounded-[2rem] p-6 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:min-h-[500px] flex flex-col border border-gray-50 mt-4">

                    {currentStep === 1 && (
                        <div className="flex-1 animate-in fade-in slide-in-from-right-8 duration-500">
                            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-8 flex items-center gap-3">
                                <ShoppingCart className="w-8 h-8 text-emerald-500" />
                                Configura tu nuevo iPhone
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                {/* Models */}
                                <div>
                                    <label className="block text-xs md:text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Modelo</label>
                                    <div className="relative">
                                        <select
                                            value={selectedModel || ''}
                                            onChange={(e) => setSelectedModel(e.target.value)}
                                            className="w-full px-4 py-3.5 md:py-4 rounded-xl border-2 border-gray-200 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 hover:border-gray-300 font-bold bg-white text-gray-900 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%20stroke%3D%22%239CA3AF%22%20stroke-width%3D%223%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_1rem_center] cursor-pointer transition-all shadow-sm"
                                        >
                                            <option value="" disabled>Selecciona modelo</option>
                                            {data.models.map(m => (
                                                <option key={m} value={m} className="font-bold text-black">{m}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Capacity */}
                                <div>
                                    <label className="block text-xs md:text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Capacidad</label>
                                    <div className="relative">
                                        <select
                                            value={selectedCapacity === null ? '' : selectedCapacity}
                                            onChange={(e) => setSelectedCapacity(Number(e.target.value))}
                                            className="w-full px-4 py-3.5 md:py-4 rounded-xl border-2 border-gray-200 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 hover:border-gray-300 font-bold bg-white text-gray-900 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%20stroke%3D%22%239CA3AF%22%20stroke-width%3D%223%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_1rem_center] cursor-pointer transition-all shadow-sm"
                                        >
                                            <option value="" disabled>Selecciona capacidad</option>
                                            {data.capacities.map(c => (
                                                <option key={c} value={c} className="font-bold text-black">{c} GB</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Battery */}
                                <div>
                                    <label className="block text-xs md:text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Estado Batería</label>
                                    <div className="relative">
                                        <select
                                            value={selectedBattery || ''}
                                            onChange={(e) => setSelectedBattery(e.target.value)}
                                            className="w-full px-4 py-3.5 md:py-4 rounded-xl border-2 border-gray-200 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 hover:border-gray-300 font-bold bg-white text-gray-900 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%20stroke%3D%22%239CA3AF%22%20stroke-width%3D%223%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_1rem_center] cursor-pointer transition-all shadow-sm"
                                        >
                                            <option value="" disabled>Selecciona rango de batería</option>
                                            {data.batteries.map(b => (
                                                <option key={b} value={b} className="font-bold text-black">{b}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Color */}
                                <div>
                                    <label className="block text-xs md:text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Coloración</label>
                                    <div className="relative">
                                        <select
                                            value={selectedColor || ''}
                                            onChange={(e) => setSelectedColor(e.target.value)}
                                            className="w-full px-4 py-3.5 md:py-4 rounded-xl border-2 border-gray-200 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 hover:border-gray-300 font-bold bg-white text-gray-900 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%20stroke%3D%22%239CA3AF%22%20stroke-width%3D%223%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_1rem_center] cursor-pointer transition-all shadow-sm"
                                        >
                                            <option value="" disabled>Selecciona color</option>
                                            {data.colors.map(c => (
                                                <option key={c} value={c} className="font-bold text-black">{c}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Basic Match Feedback */}
                            <div className="mt-8 pt-6 border-t border-gray-100">
                                {selectedModel && selectedCapacity && selectedBattery && selectedColor ? (
                                    matchedIphone ? (
                                        <div className="flex justify-between items-center bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                                            <div>
                                                <h4 className="font-extrabold text-emerald-900 text-lg">Encontramos stock</h4>
                                                <p className="text-emerald-700 font-medium mt-1">{matchedIphone.model} {matchedIphone.capacity_gb}GB - {matchedIphone.color}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-extrabold text-2xl text-emerald-600">U$D {matchedIphone.price_usd}</p>
                                                <p className="text-sm font-bold text-emerald-800 opacity-70 mt-1">AR$ {(matchedIphone.price_usd * data.config.dollar_value).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-red-50 p-6 rounded-2xl border border-red-100 text-red-600 font-semibold text-center">
                                            Lo sentimos. Esta combinación no está configurada en nuestro catálogo.
                                        </div>
                                    )
                                ) : (
                                    <div className="text-gray-400 font-medium text-center bg-gray-50 p-6 rounded-2xl border-2 border-dashed border-gray-100">
                                        Selecciona todos los parámetros para ver el valor y stock de tu iPhone...
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="flex-1 animate-in fade-in slide-in-from-right-8 duration-500">
                            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">Accesorios</h2>
                            <p className="text-gray-500 font-medium mb-8">Personaliza tu equipo. Puedes omitir este paso si lo deseas.</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {data.accessories.map(acc => {
                                    const isSelected = selectedAccessories.includes(acc.id);
                                    const arsPrice = acc.price_usd * data.config.dollar_value;
                                    return (
                                        <div
                                            key={acc.id}
                                            onClick={() => toggleAccessory(acc.id)}
                                            className={`cursor-pointer border-2 rounded-2xl p-5 flex justify-between items-center transition-all ${isSelected ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100 hover:border-emerald-300'}`}
                                        >
                                            <div>
                                                <h4 className="font-bold text-gray-900">{acc.name}</h4>
                                                <p className="text-sm text-gray-500 font-medium mt-1">U$D {acc.price_usd}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold">AR$ {arsPrice.toLocaleString()}</p>
                                                <div className={`mt-2 text-xs font-bold uppercase tracking-widest ${isSelected ? 'text-emerald-600' : 'text-gray-400'}`}>
                                                    {isSelected ? '■ Agregado' : '+ Agregar'}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="flex-1 animate-in fade-in slide-in-from-right-8 duration-500">
                            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">Plan Canje</h2>
                            <p className="text-gray-500 font-medium mb-8">Entrega tu teléfono actual como parte de pago. O totalmente opcional.</p>

                            <div className="bg-gray-50 p-6 md:p-8 rounded-3xl border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Modelo</label>
                                    <select
                                        className="w-full border-gray-200 rounded-xl px-4 py-4 font-semibold text-gray-800 bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                                        value={tradeInModel || ""}
                                        onChange={e => {
                                            setTradeInModel(e.target.value);
                                            setTradeInCapacity(null);
                                            setTradeInBattery(null);
                                        }}
                                    >
                                        <option value="">No entregaré nada</option>
                                        {Array.from(new Set(data.tradeInPrices.map(b => b.model))).map(m => (
                                            <option key={m} value={m}>{m}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Gigas</label>
                                    <select
                                        className="w-full border-gray-200 rounded-xl px-4 py-4 font-semibold text-gray-800 bg-white focus:ring-2 focus:ring-emerald-500 outline-none disabled:opacity-50 disabled:bg-gray-50"
                                        value={tradeInCapacity || ""}
                                        onChange={e => {
                                            setTradeInCapacity(Number(e.target.value));
                                            setTradeInBattery(null);
                                        }}
                                        disabled={!tradeInModel}
                                    >
                                        <option value="">--</option>
                                        {data.tradeInPrices.filter(b => b.model === tradeInModel)
                                            .map(b => b.capacity_gb)
                                            .filter((v, i, a) => a.indexOf(v) === i)
                                            .map(c => (
                                                <option key={c} value={c}>{c} GB</option>
                                            ))
                                        }
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Batería</label>
                                    <select
                                        className="w-full border-gray-200 rounded-xl px-4 py-4 font-semibold text-gray-800 bg-white focus:ring-2 focus:ring-emerald-500 outline-none disabled:opacity-50 disabled:bg-gray-50"
                                        value={tradeInBattery || ""}
                                        onChange={e => setTradeInBattery(e.target.value)}
                                        disabled={!tradeInCapacity}
                                    >
                                        <option value="">--</option>
                                        {data.tradeInPrices.filter(b => b.model === tradeInModel && b.capacity_gb === tradeInCapacity)
                                            .map(b => b.battery_range)
                                            .filter((v, i, a) => a.indexOf(v) === i)
                                            .map(br => (
                                                <option key={br} value={br}>{br}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                            </div>

                            {tradeInDiscountARS > 0 && (
                                <div className="mt-6 bg-emerald-50 text-emerald-900 p-6 rounded-2xl border-2 border-emerald-500 flex items-center justify-between shadow-sm animate-in zoom-in-95 duration-300">
                                    <div>
                                        <span className="font-bold text-lg">Tomamos tu equipo en:</span><br />
                                        <span className="text-sm font-bold text-emerald-600 opacity-80 mt-1 block">COTIZ. DÓLAR: U$D {tradeInDiscountUSD}</span>
                                    </div>
                                    <span className="font-extrabold text-2xl">AR$ {tradeInDiscountARS.toLocaleString()}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {currentStep === 4 && (
                        <div className="flex-1 animate-in fade-in slide-in-from-right-8 duration-500">
                            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">Efectivo / Transferencia</h2>
                            <p className="text-gray-500 font-medium mb-8">Disminuye tu saldo combinando un poco de dólares o pesos si lo deseas.</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 md:p-8 rounded-3xl border border-gray-100">
                                <div>
                                    <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Monto en Dólares</label>
                                    <div className="relative">
                                        <span className="absolute left-5 top-4 text-gray-400 font-bold">U$D</span>
                                        <input
                                            type="number"
                                            min="0"
                                            className="pl-14 pr-4 py-4 border-gray-200 rounded-2xl w-full text-xl font-bold bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            placeholder="0"
                                            value={cashAdvanceUSD}
                                            onChange={e => setCashAdvanceUSD(e.target.value === '' ? '' : Number(e.target.value))}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Monto en Pesos</label>
                                    <div className="relative">
                                        <span className="absolute left-5 top-4 text-gray-400 font-bold">AR$</span>
                                        <input
                                            type="number"
                                            min="0"
                                            className="pl-14 pr-4 py-4 border-gray-200 rounded-2xl w-full text-xl font-bold bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            placeholder="0"
                                            value={cashAdvanceARS}
                                            onChange={e => setCashAdvanceARS(e.target.value === '' ? '' : Number(e.target.value))}
                                        />
                                    </div>
                                </div>
                            </div>

                            {contribCashARS > 0 && (
                                <div className="mt-6 flex justify-between items-center text-emerald-700 font-bold p-4 bg-emerald-50 rounded-xl">
                                    <span>Poder de compra total aportado ahora:</span>
                                    <span className="text-xl">AR$ {contribCashARS.toLocaleString()}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {currentStep === 5 && (
                        <div className="flex-1 animate-in fade-in slide-in-from-right-8 duration-500">
                            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2 flex items-center gap-3">
                                <Calculator className="w-8 h-8 text-emerald-500" />
                                Tarjetas de Crédito
                            </h2>
                            <p className="text-gray-500 font-medium mb-8">Financia el resto que falta. Si es 0, no necesitas llenar esto.</p>

                            {missingBeforeCardARS === 0 ? (
                                <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-10 flex flex-col items-center justify-center text-center">
                                    <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
                                    <h3 className="text-xl font-bold text-emerald-900 mb-2">¡No necesitas tarjeta!</h3>
                                    <p className="text-emerald-700 font-medium">El saldo del dispositivo está íntegramente cubierto por tu efectivo o tu equipo en canje.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Seleccionar Banco/Tarjeta</label>
                                        <div className="flex flex-col gap-3">
                                            {data.cards.map(c => (
                                                <button
                                                    key={c.card_name}
                                                    onClick={() => {
                                                        if (selectedCard === c.card_name) {
                                                            setSelectedCard(null);
                                                            setSelectedInstallments(null);
                                                        } else {
                                                            setSelectedCard(c.card_name);
                                                            setSelectedInstallments(null);
                                                        }
                                                    }}
                                                    className={`px-5 py-4 rounded-xl border-2 text-left font-bold transition-all ${selectedCard === c.card_name ? 'border-emerald-500 bg-emerald-50 text-emerald-900' : 'border-gray-100 hover:border-gray-300'}`}
                                                >
                                                    {c.card_name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Planes Oficiales Disponibles</label>
                                        {selectedCard ? (
                                            <div className="grid grid-cols-2 gap-3">
                                                {data.plans.filter(f => f.card_name === selectedCard).length === 0 && <span className="text-sm font-medium text-gray-400">No hay planes.</span>}
                                                {data.plans.filter(f => f.card_name === selectedCard).map(f => (
                                                    <button
                                                        key={f.id}
                                                        onClick={() => setSelectedInstallments(f.installments)}
                                                        className={`px-4 py-4 rounded-xl border-2 text-center font-bold transition-all flex flex-col items-center justify-center min-h-[6rem] ${selectedInstallments === f.installments ? 'border-emerald-500 bg-emerald-50 text-emerald-900' : 'border-gray-100 hover:border-gray-300'}`}
                                                    >
                                                        <span className="text-2xl">{f.installments}</span>
                                                        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600/70 mt-1">Cuotas</span>
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-sm font-medium text-gray-400 bg-gray-50 rounded-2xl p-6 border border-dashed border-gray-200 h-full flex items-center justify-center text-center">
                                                Elige un banco para ver planes.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Stepper Navigation */}
                    <div className="mt-12 pt-6 border-t border-gray-100 flex justify-between items-center z-10 w-full">
                        <button
                            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                            className={`px-4 md:px-6 py-4 font-bold rounded-xl text-gray-500 hover:bg-gray-100 transition-colors ${currentStep === 1 ? 'invisible' : ''}`}
                        >
                            <span className="hidden sm:inline">Paso Anterior</span>
                            <span className="sm:hidden">Volver</span>
                        </button>

                        <button
                            onClick={handleNextStep}
                            disabled={(currentStep === 1 && !matchedIphone) || (currentStep === 5 && !canCheckout)}
                            className={`px-6 md:px-8 py-4 rounded-xl font-extrabold transition-all active:scale-95 flex items-center gap-2 ${(currentStep === 1 && !matchedIphone) || (currentStep === 5 && !canCheckout)
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : (canCheckout && currentStep >= 4)
                                    ? 'bg-black text-white hover:bg-gray-800 shadow-xl'
                                    : 'bg-emerald-500 text-white hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                                }`}
                        >
                            <span className="hidden sm:inline">{(canCheckout && currentStep >= 4) || currentStep === 5 ? 'Finalizar Presupuesto' : 'Siguiente Paso'}</span>
                            <span className="sm:hidden">{(canCheckout && currentStep >= 4) || currentStep === 5 ? 'Finalizar' : 'Continuar'}</span>
                            {(canCheckout && currentStep >= 4) || currentStep === 5 ? null : <ArrowRight className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Column: Order Summary Floating */}
            <div className="lg:col-span-4 sticky top-24">
                <div className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-50">
                    <h3 className="text-xl font-extrabold mb-6 flex items-center justify-between text-gray-900">
                        Resumen Caja
                        {canCheckout && <span className="text-xs font-extrabold bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full uppercase tracking-wider">CUBIERTO</span>}
                    </h3>

                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                            <span className="text-gray-500 font-bold text-sm uppercase tracking-wide">Equipo</span>
                            <span className="font-extrabold">AR$ {subtotalIphoneARS.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                            <span className="text-gray-500 font-bold text-sm uppercase tracking-wide">Accesorios</span>
                            <span className="font-extrabold">AR$ {accessoriesTotalARS.toLocaleString()}</span>
                        </div>

                        <div className="flex justify-between items-end py-2">
                            <span className="text-gray-900 font-extrabold text-lg">Subtotal Total</span>
                            <div className="text-right">
                                <div className="text-xl font-black text-emerald-500">AR$ {totalPurchaseARS.toLocaleString()}</div>
                                <div className="text-xs font-bold text-gray-400 mt-1 uppercase">Ref: U$D {(totalPurchaseARS / data.config.dollar_value).toFixed(1)}</div>
                            </div>
                        </div>

                        {(contribTradeInARS > 0 || contribCashARS > 0 || contribCardARS > 0) && (
                            <div className="mt-4 p-5 bg-gray-50 rounded-2xl">
                                <h4 className="font-extrabold text-gray-900 text-xs uppercase tracking-widest mb-4">Aportes Restados</h4>

                                {contribTradeInARS > 0 && (
                                    <div className="flex justify-between text-emerald-600 font-bold text-sm mb-3">
                                        <span>Canje / Usado</span>
                                        <span>- AR$ {contribTradeInARS.toLocaleString()}</span>
                                    </div>
                                )}
                                {contribCashARS > 0 && (
                                    <div className="flex justify-between text-emerald-600 font-bold text-sm mb-3">
                                        <span>Adelanto Cash</span>
                                        <span>- AR$ {contribCashARS.toLocaleString()}</span>
                                    </div>
                                )}
                                {contribCardARS > 0 && (
                                    <div className="flex justify-between text-black font-bold text-sm">
                                        <span>Tarjetas asume</span>
                                        <span>- AR$ {contribCardARS.toLocaleString()}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className={`mt-2 p-5 rounded-2xl border-2 flex justify-between items-center transition-all ${remainingToCoverARS === 0 && totalPurchaseARS > 0 ? 'bg-emerald-50 border-emerald-500' : 'bg-white border-gray-100'}`}>
                            <span className="font-extrabold text-sm uppercase tracking-widest text-gray-600">Restante</span>
                            <span className={`font-black text-2xl ${remainingToCoverARS === 0 && totalPurchaseARS > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                AR$ {remainingToCoverARS.toLocaleString()}
                            </span>
                        </div>

                        {contribCardARS > 0 && cardConfig && financingPlan && (
                            <div className="mt-4 p-5 bg-gray-900 rounded-2xl text-white shadow-xl">
                                <div className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">
                                    Abona al banco
                                </div>
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-xl font-bold bg-white text-black px-2 py-1 rounded-md">{financingPlan.installments} cuotas</span>
                                </div>
                                <div className="text-lg font-black text-emerald-400">
                                    de AR$ {Math.round(monthlyInstallmentARS).toLocaleString()} /mes
                                </div>
                                <div className="mt-3 pt-3 border-t border-gray-700 text-xs text-gray-400 font-bold">
                                    Monto final financiado: AR$ {Math.round(finalFinancedTotalARS).toLocaleString()}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* SUCCESS MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-start justify-center p-4 py-6 bg-black/60 backdrop-blur-md overflow-y-auto">
                    <div className="bg-white rounded-[2rem] max-w-md w-full p-8 md:p-10 shadow-2xl animate-in fade-in zoom-in duration-300 my-auto">
                        <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(16,185,129,0.5)]">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <h2 className="text-3xl font-extrabold text-center mb-2 text-gray-900">¡Presupuesto Perfecto!</h2>
                        <p className="text-gray-500 text-center mb-8 font-medium">El saldo del equipo principal fue absorbido en su totalidad con éxito.</p>

                        <div className="bg-gray-50 p-6 md:p-8 rounded-3xl text-sm mb-8 flex flex-col gap-3 border border-gray-200 font-bold shadow-inner">

                            <h4 className="text-[10px] uppercase tracking-widest text-gray-400 text-center mb-2">Detalle de tu carrito</h4>

                            <div className="flex justify-between items-center text-gray-800">
                                <span className="font-semibold">{matchedIphone?.model} <span className="text-emerald-600">{matchedIphone?.capacity_gb}GB</span></span>
                                <span>AR$ {subtotalIphoneARS.toLocaleString()}</span>
                            </div>

                            {accessoriesTotalARS > 0 && (
                                <div className="flex justify-between items-center text-gray-800">
                                    <span className="font-semibold">Accesorios ({selectedAccessories.length})</span>
                                    <span>AR$ {accessoriesTotalARS.toLocaleString()}</span>
                                </div>
                            )}

                            <div className="flex justify-between items-center text-black font-extrabold text-base border-t border-dashed border-gray-300 pt-3 mt-1">
                                <span>TOTAL COMPRA</span>
                                <span>AR$ {totalPurchaseARS.toLocaleString()}</span>
                            </div>

                            <div className="h-px w-full bg-gray-200 my-4"></div>

                            <h4 className="text-[10px] uppercase tracking-widest text-gray-400 text-center mb-2">Formas de Pago Aplicadas</h4>

                            {contribTradeInARS > 0 && (
                                <div className="flex justify-between items-center text-gray-700">
                                    <span className="font-semibold">Plan Canje</span>
                                    <span className="text-emerald-600">- AR$ {contribTradeInARS.toLocaleString()}</span>
                                </div>
                            )}
                            {contribCashARS > 0 && (
                                <div className="flex justify-between items-start text-gray-700">
                                    <span className="font-semibold">Efectivo / Transf.</span>
                                    <div className="text-right">
                                        {cashAdvanceResolvedUSD > 0 && (
                                            <div className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded mb-1">
                                                U$D {cashAdvanceResolvedUSD.toLocaleString()} = AR$ {cashAdvanceResolvedARSFromUSD.toLocaleString()}
                                            </div>
                                        )}
                                        {cashAdvanceResolvedARSFromARS > 0 && (
                                            <div className="text-xs font-bold text-gray-500">
                                                AR$ {cashAdvanceResolvedARSFromARS.toLocaleString()} en pesos
                                            </div>
                                        )}
                                        <span className="text-emerald-600 font-bold">- AR$ {contribCashARS.toLocaleString()}</span>
                                    </div>
                                </div>
                            )}
                            {contribCardARS > 0 && financingPlan && (
                                <div className="mt-2 pt-3 border-t border-gray-200">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-semibold text-black">Tarjeta de Crédito</span>
                                        <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">{selectedCard}</span>
                                    </div>
                                    <div className="bg-black rounded-2xl p-4 flex items-center justify-between">
                                        <div>
                                            <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Cuotas</div>
                                            <div className="text-2xl font-black text-white">{financingPlan.installments}x</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Valor cuota</div>
                                            <div className="text-2xl font-black text-emerald-400">AR$ {Math.round(monthlyInstallmentARS).toLocaleString()}</div>
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-500 font-bold text-center mt-2 uppercase tracking-wider">
                                        Total al banco: AR$ {Math.round(finalFinancedTotalARS).toLocaleString()}
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-between items-center text-black text-lg border-t-4 border-gray-900 pt-4 mt-2">
                                <span>SALDO RESTANTE</span>
                                <span className="flex items-center gap-1.5 text-emerald-600 font-black">
                                    <CheckCircle2 className="w-5 h-5" /> COMPLETADO
                                </span>
                            </div>

                        </div>

                        <button
                            onClick={resetAll}
                            className="w-full bg-black text-white font-extrabold text-lg py-5 rounded-2xl hover:bg-gray-800 transition-colors active:scale-95"
                        >
                            Volver al Cotizador
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
