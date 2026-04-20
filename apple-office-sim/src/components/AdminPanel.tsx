import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { Trash2, Plus, Save, Lock, Users, LogIn, HelpCircle } from 'lucide-react';

import Login from './Login';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const API_URL = `${BASE_URL}/api`;

function getToken(): string | null {
    return localStorage.getItem('apple_admin_token');
}

function authHeaders(): Record<string, string> {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
    };
}

// ─── Main Panel ──────────────────────────────────────────────────────────────

export default function AdminPanel() {
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('apple_admin_token'));
    const [username, setUsername] = useState<string | null>(() => localStorage.getItem('apple_admin_username'));
    const [activeTab, setActiveTab] = useState('base');


    const handleLogin = (newToken: string, newUsername: string) => {
        localStorage.setItem('apple_admin_token', newToken);
        localStorage.setItem('apple_admin_username', newUsername);
        setToken(newToken);
        setUsername(newUsername);
    };

    const handleLogout = () => {
        localStorage.removeItem('apple_admin_token');
        localStorage.removeItem('apple_admin_username');
        setToken(null);
        setUsername(null);
    };

    // Detect token expiry on 401/403
    const isAdmin = !!token;

    if (!isAdmin) {
        return (
            <div className="min-h-[80vh]">
                <div className="max-w-7xl mx-auto px-4 pt-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <Lock className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Configuración Restringida</h1>
                            <p className="text-sm text-gray-500">Esta sección requiere autenticación de administrador</p>
                        </div>
                    </div>
                </div>
                <Login onLogin={handleLogin} />
            </div>
        );
    }

    const tabs = [
        { id: 'base', label: 'Base y Dólar' },
        { id: 'propuesta', label: '📌 Propuesta' },
        { id: 'stock', label: 'iPhones (Stock)' },
        { id: 'trade', label: 'Trade-In (Toma)' },
        { id: 'finance', label: 'Financiación' },
        { id: 'gallery', label: 'Galería Clientes' },
        { id: 'store', label: '🏗️ Local' },
        { id: 'iphones', label: '📱 iPhones' },
        { id: 'accessories', label: '🎧 Accesorios' },
        { id: 'faqs', label: '❓ FAQs' },
        { id: 'users', label: '👤 Usuarios' },
    ];


    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header with session info */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Panel de Administración</h1>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                        <LogIn className="w-4 h-4" />
                        Sesión activa como <span className="font-semibold text-black ml-1">{username}</span>
                    </p>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl font-medium hover:bg-red-100 transition-colors text-sm border border-red-100"
                >
                    Cerrar Sesión
                </button>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-1 bg-gray-100 p-1 rounded-2xl mb-8">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 min-w-max px-4 py-2.5 text-sm font-medium rounded-xl transition-all ${activeTab === tab.id
                            ? 'bg-white shadow-sm text-black'
                            : 'text-gray-500 hover:text-black'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === 'base' && <AdminBase />}
            {activeTab === 'propuesta' && <AdminPropuesta />}
            {activeTab === 'stock' && <AdminStock />}
            {activeTab === 'trade' && <AdminTradeIn />}
            {activeTab === 'finance' && <AdminFinance />}
            {activeTab === 'gallery' && <AdminGallery />}
            {activeTab === 'store' && <AdminStoreGallery />}
            { activeTab === 'iphones' && <AdminLandingIphones /> }
            {activeTab === 'accessories' && <AdminLandingAccessories />}
            {activeTab === 'faqs' && <AdminFaqs />}
            {activeTab === 'users' && <AdminUsers currentUsername={username || ''} />}
        </div>

    );
}

// ─── Base y Dólar ─────────────────────────────────────────────────────────────

function AdminBase() {
    const { data, refreshData } = useData();
    const [dolar, setDolar] = useState(data.config.dollar_value);

    const saveDolar = async () => {
        await fetch(`${API_URL}/config`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ dollar_value: dolar })
        });
        await refreshData();
        alert("Cotización guardada exitosamente en la base de datos.");
    };

    const addBase = async (entity: string, promptText: string) => {
        const p = prompt(promptText);
        if (!p) return;
        try {
            await fetch(`${API_URL}/base/${entity}`, {
                method: 'POST',
                headers: authHeaders(),
                body: JSON.stringify({ value: p })
            });
            await refreshData();
        } catch (e) { 
            alert("Error al guardar entidad base. Revisa la consola o los permisos.");
        }
    };

    const removeBase = async (entity: string, val: any) => {
        try {
            await fetch(`${API_URL}/base/${entity}`, {
                method: 'DELETE',
                headers: authHeaders(),
                body: JSON.stringify({ value: val })
            });
            await refreshData();
        } catch (e) { }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border shadow-sm col-span-full mb-4 flex items-end gap-4">
                <div>
                    <h3 className="font-semibold text-lg mb-2">Valor Dólar a ARS</h3>
                    <input
                        type="number"
                        value={dolar}
                        onChange={e => setDolar(Number(e.target.value))}
                        className="border rounded-lg px-4 py-2 w-full md:w-64"
                    />
                </div>
                <button onClick={saveDolar} className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 flex items-center gap-2">
                    <Save className="w-4 h-4" /> Guardar Dólar
                </button>
            </div>

            <ListEditor title="Modelos" items={data.models} onAdd={() => addBase('model', 'Nombre del modelo:')} onRemove={(v) => removeBase('model', v)} />
            <ListEditor title="Capacidades (GB)" items={data.capacities} onAdd={() => addBase('capacity', 'Capacidad en GB:')} onRemove={(v) => removeBase('capacity', v)} />
            <ListEditor title="Baterías" items={data.batteries} onAdd={() => addBase('battery', 'Estado de Batería:')} onRemove={(v) => removeBase('battery', v)} />
        </div>
    );
}

function ListEditor({ title, items, onAdd, onRemove }: { title: string, items: any[], onAdd: () => void, onRemove: (v: any) => void }) {
    return (
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">{title}</h3>
                <button onClick={onAdd} className="bg-gray-100 p-2 rounded-full hover:bg-gray-200"><Plus className="w-4 h-4" /></button>
            </div>
            <div className="flex flex-col gap-2">
                {items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-lg text-sm border border-gray-100">
                        <span>{item}</span>
                        <button onClick={() => onRemove(item)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                    </div>
                ))}
                {items.length === 0 && <span className="text-sm text-gray-400">Sin datos</span>}
            </div>
        </div>
    );
}

// ─── Stock ────────────────────────────────────────────────────────────────────

function AdminStock() {
    const { data, refreshData } = useData();
    const [model, setModel] = useState(data.models[0] || "");
    const [cap, setCap] = useState(data.capacities[0] || 0);
    const [bat, setBat] = useState(data.batteries[0] || "");
    const [price, setPrice] = useState(0);

    useEffect(() => {
        if (!model && data.models.length > 0) setModel(data.models[0]);
        if (cap === 0 && data.capacities.length > 0) setCap(data.capacities[0]);
        if (!bat && data.batteries.length > 0) setBat(data.batteries[0]);
    }, [data.models, data.capacities, data.batteries]);

    const handleAdd = async () => {
        if (!model || cap === 0 || !bat || price === 0) return alert("Completa todos los campos con valores válidos");
        await fetch(`${API_URL}/stock`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ model, capacity_gb: cap, battery_status: bat, price_usd: price })
        });
        await refreshData();
        alert("Stock agregado a la base de datos");
    };

    const removeStock = async (id: string) => {
        await fetch(`${API_URL}/stock/${id}`, { method: 'DELETE', headers: authHeaders() });
        await refreshData();
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="bg-white p-6 rounded-2xl border shadow-sm lg:col-span-4 self-start">
                <h3 className="font-semibold text-lg mb-4">Alta de Combinación (Venta)</h3>
                <div className="flex flex-col gap-3">
                    <select value={model} onChange={e => setModel(e.target.value)} className="border p-2 rounded w-full">
                        <option value="">Seleccionar Modelo...</option>
                        {data.models.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <select value={cap} onChange={e => setCap(Number(e.target.value))} className="border p-2 rounded w-full">
                        <option value={0}>Seleccionar Capacidad...</option>
                        {data.capacities.map(c => <option key={c} value={c}>{c} GB</option>)}
                    </select>
                    <select value={bat} onChange={e => setBat(e.target.value)} className="border p-2 rounded w-full">
                        <option value="">Seleccionar Batería...</option>
                        {data.batteries.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                    <div className="mt-2">
                        <label className="text-xs text-gray-500">Precio de Venta (USD)</label>
                        <input type="number" value={price === 0 ? '' : price} onChange={e => setPrice(Number(e.target.value))} className="border p-2 rounded w-full" placeholder="Ej: 1100" />
                    </div>
                    <button onClick={handleAdd} className="mt-2 w-full bg-black text-white p-2 text-sm rounded-lg hover:bg-gray-800">Agregar Stock</button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border shadow-sm lg:col-span-8">
                <h3 className="font-semibold text-lg mb-4">Stock en Base de Datos</h3>
                <div className="flex flex-col gap-2">
                    {data.iphoneStock.length === 0 && <p className="text-gray-400">No hay equipos en stock</p>}
                    {data.iphoneStock.map(s => (
                        <div key={s.id} className="flex justify-between items-center p-3 border rounded-xl hover:bg-gray-50">
                            <div>
                                <span className="font-semibold">{s.model} {s.capacity_gb}GB</span> - <span className="text-sm font-medium text-blue-600 px-2 py-1 bg-blue-50 rounded">{s.battery_status}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <div className="font-bold">U$D {s.price_usd}</div>
                                </div>
                                <button onClick={() => removeStock(s.id)} className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─── Trade-In ─────────────────────────────────────────────────────────────────

function AdminTradeIn() {
    const { data, refreshData } = useData();
    const [model, setModel] = useState(data.models[0] || "");
    const [cap, setCap] = useState(data.capacities[0] || 0);
    const [bat, setBat] = useState(data.batteries[0] || "");
    const [price, setPrice] = useState(0);

    useEffect(() => {
        if (!model && data.models.length > 0) setModel(data.models[0]);
        if (cap === 0 && data.capacities.length > 0) setCap(data.capacities[0]);
        if (!bat && data.batteries.length > 0) setBat(data.batteries[0]);
    }, [data.models, data.capacities, data.batteries]);

    const handleAdd = async () => {
        if (!model || cap === 0 || !bat || price === 0) return alert("Completa todos los campos con valores válidos");
        await fetch(`${API_URL}/tradein`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ model, capacity_gb: cap, battery_range: bat, price_usd: price })
        });
        await refreshData();
    };

    const removeTradeIn = async (id: string) => {
        await fetch(`${API_URL}/tradein/${id}`, { method: 'DELETE', headers: authHeaders() });
        await refreshData();
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="bg-white p-6 rounded-2xl border shadow-sm lg:col-span-4 self-start">
                <h3 className="font-semibold text-lg mb-4">Alta Precio de Toma (Trade-In)</h3>
                <div className="flex flex-col gap-3">
                    <select value={model} onChange={e => setModel(e.target.value)} className="border p-2 rounded w-full">
                        <option value="">Seleccionar Modelo...</option>
                        {data.models.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <select value={cap} onChange={e => setCap(Number(e.target.value))} className="border p-2 rounded w-full">
                        <option value={0}>Seleccionar Capacidad...</option>
                        {data.capacities.map(c => <option key={c} value={c}>{c} GB</option>)}
                    </select>
                    <select value={bat} onChange={e => setBat(e.target.value)} className="border p-2 rounded w-full">
                        <option value="">Seleccionar Batería...</option>
                        {data.batteries.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                    <div className="mt-2">
                        <label className="text-xs text-gray-500">Precio de toma USD</label>
                        <input type="number" value={price === 0 ? '' : price} onChange={e => setPrice(Number(e.target.value))} className="border p-2 rounded w-full" placeholder="Ej: 300" />
                    </div>
                    <button onClick={handleAdd} className="mt-2 w-full bg-black text-white p-2 text-sm rounded-lg hover:bg-gray-800">Agregar Toma DB</button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border shadow-sm lg:col-span-8">
                <h3 className="font-semibold text-lg mb-4">Catálogo de Tomas</h3>
                <div className="flex flex-col gap-2">
                    {data.tradeInPrices.map(s => (
                        <div key={s.id} className="flex justify-between items-center p-3 border rounded-xl hover:bg-gray-50">
                            <div>
                                <span className="font-semibold">{s.model} {s.capacity_gb}GB</span> - {s.battery_range}
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="font-bold">U$D {s.price_usd}</div>
                                <button onClick={() => removeTradeIn(s.id)} className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─── Financiación ─────────────────────────────────────────────────────────────

function AdminFinance() {
    const { data, refreshData } = useData();

    const addCard = async () => {
        const p = prompt("Nombre de la tarjeta (Ej: Visa):");
        if (!p) return;
        const factor = prompt("Coeficiente Base de la tarjeta (Ej 1 para normal, 1.05 para American Express):");
        const numFactor = Number(factor);
        if (!isNaN(numFactor)) {
            await fetch(`${API_URL}/cards`, {
                method: 'POST',
                headers: authHeaders(),
                body: JSON.stringify({ card_name: p, base_factor: numFactor })
            });
            await refreshData();
        }
    };

    const removeCard = async (card_name: string) => {
        await fetch(`${API_URL}/cards/${card_name}`, { method: 'DELETE', headers: authHeaders() });
        await refreshData();
    };

    const addPlan = async (card_name: string) => {
        const quotas = prompt(`¿Cuántas cuotas para ${card_name}? (Ej: 3)`);
        if (!quotas) return;
        const coef = prompt(`Coeficiente de recargo por las ${quotas} cuotas:`);
        if (!isNaN(Number(quotas)) && !isNaN(Number(coef))) {
            await fetch(`${API_URL}/plans`, {
                method: 'POST',
                headers: authHeaders(),
                body: JSON.stringify({ card_name, installments: Number(quotas), surcharge_coefficient: Number(coef) })
            });
            await refreshData();
        }
    };

    const removePlan = async (id: string) => {
        await fetch(`${API_URL}/plans/${id}`, { method: 'DELETE', headers: authHeaders() });
        await refreshData();
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border">
                <div>
                    <h2 className="text-xl font-bold">Tarjetas y Planes DB</h2>
                    <p className="text-gray-500 text-sm">Gestiona financiamiento remoto.</p>
                </div>
                <button onClick={addCard} className="bg-black text-white px-4 py-2 font-medium rounded-lg hover:bg-gray-800">
                    Nueva Tarjeta
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.cards.map(c => (
                    <div key={c.card_name} className="bg-white p-6 rounded-2xl border shadow-sm">
                        <div className="flex justify-between items-center mb-4 border-b pb-4">
                            <div>
                                <h3 className="font-bold text-lg">{c.card_name}</h3>
                                <p className="text-xs text-gray-500">Base factor: {c.base_factor}</p>
                            </div>
                            <button onClick={() => removeCard(c.card_name)} className="text-red-500 bg-red-50 p-2 rounded hover:bg-red-100"><Trash2 className="w-5 h-5" /></button>
                        </div>

                        <div className="flex flex-col gap-2 mb-4">
                            {data.plans.filter(p => p.card_name === c.card_name).map(p => (
                                <div key={p.id} className="flex justify-between items-center bg-gray-50 p-2 rounded border border-gray-100">
                                    <span className="font-medium">{p.installments} Cuotas</span>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-bold text-blue-600">x{p.surcharge_coefficient}</span>
                                        <button onClick={() => removePlan(p.id)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button onClick={() => addPlan(c.card_name)} className="w-full border border-dashed border-gray-300 rounded-lg py-2 text-sm font-medium text-gray-600 hover:border-gray-500">
                            + Añadir Plan
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Galería ──────────────────────────────────────────────────────────────────

function AdminGallery() {
    const { data, refreshData } = useData();
    const [description, setDescription] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [successModal, setSuccessModal] = useState(false);

    const handleSave = async () => {
        if (!file && !editingId) return alert("Selecciona una imagen");
        const formData = new FormData();
        if (file) formData.append('image', file);
        formData.append('description', description);

        const url = editingId ? `${API_URL}/gallery/${editingId}` : `${API_URL}/gallery`;
        const method = editingId ? 'PUT' : 'POST';

        await fetch(url, {
            method,
            headers: { 'Authorization': `Bearer ${getToken()}` },
            body: formData
        });
        await refreshData();
        setFile(null);
        setDescription("");
        setEditingId(null);
        setSuccessModal(true);
        setTimeout(() => setSuccessModal(false), 2500);
    };

    const handleEdit = (item: any) => {
        setEditingId(item.id);
        setDescription(item.description || "");
        setFile(null);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Eliminar imagen?")) return;
        await fetch(`${API_URL}/gallery/${id}`, { method: 'DELETE', headers: authHeaders() });
        await refreshData();
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
            {successModal && (
                <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white p-8 rounded-[2rem] text-center shadow-2xl transition-all scale-100 w-full max-w-sm">
                        <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <h3 className="text-2xl font-bold mb-2">¡Cargado Exitosamente!</h3>
                        <p className="text-gray-500 font-medium">La galería fue actualizada correctamente.</p>
                    </div>
                </div>
            )}
            <div className="bg-white p-6 rounded-2xl border shadow-sm lg:col-span-4 self-start">
                <h3 className="font-semibold text-lg mb-4">{editingId ? 'Editar Imagen' : 'Nueva Imagen'}</h3>
                <div className="flex flex-col gap-3">
                    <div>
                        <label className="text-xs text-gray-500 block mb-1">Imagen</label>
                        <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="border p-2 rounded w-full text-sm" />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 block mb-1">Descripción</label>
                        <input type="text" value={description} onChange={e => setDescription(e.target.value)} className="border p-2 rounded w-full text-sm" placeholder="Ej: Cliente feliz con su iPhone 15" />
                    </div>
                    <button onClick={handleSave} className="mt-2 w-full bg-black text-white p-2 text-sm rounded-lg hover:bg-gray-800">
                        {editingId ? 'Actualizar' : 'Subir Imagen'}
                    </button>
                    {editingId && <button onClick={() => { setEditingId(null); setDescription(""); setFile(null); }} className="w-full text-gray-500 text-sm hover:underline mt-2">Cancelar Edición</button>}
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border shadow-sm lg:col-span-8">
                <h3 className="font-semibold text-lg mb-4">Fotos de la Galería</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {data.gallery?.map(g => (
                        <div key={g.id} className="border rounded-xl overflow-hidden shadow-sm flex flex-col">
                            <div className="h-48 bg-gray-100 relative">
                                <img src={`${BASE_URL}${g.image_url}`} alt={g.description} className="w-full h-full object-cover" />
                            </div>
                            <div className="p-3 bg-white flex flex-col flex-1 justify-between">
                                <p className="text-sm text-gray-700 italic mb-3">"{g.description}"</p>
                                <div className="flex justify-between items-center mt-auto">
                                    <button onClick={() => handleEdit(g)} className="text-sm font-medium text-blue-600 hover:text-blue-800">Editar</button>
                                    <button onClick={() => handleDelete(g.id)} className="text-sm font-medium text-red-600 hover:text-red-800">Eliminar</button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {(!data.gallery || data.gallery.length === 0) && <p className="text-gray-400 p-4">No hay fotos en la galería.</p>}
                </div>
            </div>
        </div>
    );
}

// ─── Gestión de Usuarios ──────────────────────────────────────────────────────

interface UserEntry {
    id: string;
    username: string;
}

function AdminUsers({ currentUsername }: { currentUsername: string }) {
    const [users, setUsers] = useState<UserEntry[]>([]);
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchUsers = async () => {
        try {
            const res = await fetch(`${API_URL}/users`, { headers: authHeaders() });
            if (res.ok) {
                setUsers(await res.json());
            }
        } catch (e) { }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newUsername.trim() || !newPassword.trim()) return;
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const res = await fetch(`${API_URL}/users`, {
                method: 'POST',
                headers: authHeaders(),
                body: JSON.stringify({ username: newUsername.trim(), password: newPassword })
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || 'Error al crear usuario');
            } else {
                setSuccess(`Usuario "${data.username}" creado exitosamente.`);
                setNewUsername('');
                setNewPassword('');
                await fetchUsers();
            }
        } catch (e) {
            setError('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, username: string) => {
        if (username === currentUsername) {
            alert('No puedes eliminar tu propio usuario.');
            return;
        }
        if (!confirm(`¿Eliminar el usuario "${username}"? Esta acción no se puede deshacer.`)) return;
        try {
            await fetch(`${API_URL}/users/${id}`, { method: 'DELETE', headers: authHeaders() });
            await fetchUsers();
        } catch (e) { }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Create user form */}
            <div className="bg-white p-6 rounded-2xl border shadow-sm lg:col-span-4 self-start">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-9 h-9 bg-black text-white rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4" />
                    </div>
                    <h3 className="font-semibold text-lg">Nuevo Usuario</h3>
                </div>
                <form onSubmit={handleCreate} className="flex flex-col gap-3">
                    <div>
                        <label className="text-xs text-gray-500 block mb-1">Nombre de usuario</label>
                        <input
                            type="text"
                            value={newUsername}
                            onChange={e => setNewUsername(e.target.value)}
                            className="border p-2.5 rounded-xl w-full text-sm focus:outline-none focus:ring-1 focus:ring-black"
                            placeholder="Ej: JuanAdmin"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 block mb-1">Contraseña</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            className="border p-2.5 rounded-xl w-full text-sm focus:outline-none focus:ring-1 focus:ring-black"
                            placeholder="Contraseña segura"
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 text-xs bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
                    {success && <p className="text-green-600 text-xs bg-green-50 px-3 py-2 rounded-lg">{success}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-2 w-full bg-black text-white p-2.5 text-sm rounded-xl hover:bg-gray-900 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        {loading ? 'Creando...' : 'Dar de Alta'}
                    </button>
                </form>
                <p className="mt-4 text-xs text-gray-400 leading-relaxed">Todos los usuarios pueden acceder y gestionar la configuración completa del sistema.</p>
            </div>

            {/* Users list */}
            <div className="bg-white p-6 rounded-2xl border shadow-sm lg:col-span-8">
                <h3 className="font-semibold text-lg mb-4">
                    Usuarios del Sistema
                    <span className="ml-2 text-sm font-normal text-gray-400">({users.length} usuarios)</span>
                </h3>
                <div className="flex flex-col gap-3">
                    {users.map(u => (
                        <div
                            key={u.id}
                            className="flex justify-between items-center p-4 border rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
                                    {u.username.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-semibold">{u.username}</p>
                                    {u.username === currentUsername && (
                                        <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Tu sesión actual</span>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={() => handleDelete(u.id, u.username)}
                                disabled={u.username === currentUsername}
                                className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                title={u.username === currentUsername ? 'No puedes eliminarte a ti mismo' : `Eliminar ${u.username}`}
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    {users.length === 0 && (
                        <p className="text-gray-400 text-sm text-center py-8">No hay usuarios cargados.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Propuesta (Nuestra Garantía cards) ──────────────────────────────────────

const ICON_OPTIONS = ['Package', 'ShieldCheck', 'RefreshCw', 'MessageCircleHeart', 'Star', 'Zap', 'Award', 'Heart'];

function AdminPropuesta() {
    const { data, refreshData } = useData();
    const [cards, setCards] = useState(() => data.feature_cards);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const updateCard = (index: number, field: 'title' | 'desc' | 'icon', value: string) => {
        setCards(prev => prev.map((c, i) => i === index ? { ...c, [field]: value } : c));
        setSaved(false);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await fetch(`${API_URL}/feature-cards`, {
                method: 'POST',
                headers: authHeaders(),
                body: JSON.stringify({ feature_cards: cards })
            });
            await refreshData();
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (e) {
            alert('Error al guardar');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border">
                <div>
                    <h2 className="text-xl font-bold">Sección "Nuestra Garantía"</h2>
                    <p className="text-gray-500 text-sm mt-1">Editá los 4 cards que se muestran en la landing page.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all ${saved ? 'bg-emerald-500 text-white' : 'bg-black text-white hover:bg-gray-900'} disabled:opacity-50`}
                >
                    <Save className="w-4 h-4" />
                    {saving ? 'Guardando...' : saved ? '✓ Guardado' : 'Guardar Cambios'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cards.map((card, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border shadow-sm flex flex-col gap-4">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-sm">{i + 1}</div>
                            <h3 className="font-bold text-gray-700">Card {i + 1}</h3>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Ícono</label>
                            <select
                                value={card.icon}
                                onChange={e => updateCard(i, 'icon', e.target.value)}
                                className="border rounded-xl px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            >
                                {ICON_OPTIONS.map(icon => (
                                    <option key={icon} value={icon}>{icon}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Título</label>
                            <input
                                type="text"
                                value={card.title}
                                onChange={e => updateCard(i, 'title', e.target.value)}
                                className="border rounded-xl px-3 py-2.5 w-full text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder="Ej: Garantía Oficial"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Descripción</label>
                            <textarea
                                value={card.desc}
                                onChange={e => updateCard(i, 'desc', e.target.value)}
                                rows={3}
                                className="border rounded-xl px-3 py-2.5 w-full text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder="Describí este beneficio..."
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Store Gallery ─────────────────────────────────────────────────────────────

function AdminStoreGallery() {
    const { data, refreshData } = useData();
    const [uploading, setUploading] = useState(false);
    const [description, setDescription] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const fileRef = React.useRef<HTMLInputElement>(null);

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;
        setUploading(true);
        const formData = new FormData();
        formData.append('image', file);
        if (description) formData.append('description', description);
        try {
            await fetch(`${API_URL}/store-gallery`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${localStorage.getItem('apple_admin_token')}` },
                body: formData
            });
            setDescription('');
            setFile(null);
            if (fileRef.current) fileRef.current.value = '';
            await refreshData();
        } catch {
            alert('Error al subir la imagen.');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Eliminar esta foto del local?')) return;
        await fetch(`${API_URL}/store-gallery/${id}`, {
            method: 'DELETE',
            headers: authHeaders()
        });
        await refreshData();
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border">
                <h2 className="text-xl font-bold mb-1">Fotos del Local</h2>
                <p className="text-gray-500 text-sm mb-6">Subí fotos del interior. Aparecerán en la sección "Nuestro Local" de la landing, desplazándose de derecha a izquierda.</p>
                <form onSubmit={handleUpload} className="flex flex-col sm:flex-row gap-4">
                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        onChange={e => setFile(e.target.files?.[0] ?? null)}
                        className="flex-1 border rounded-xl px-3 py-2.5 text-sm"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Descripción (opcional)"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className="flex-1 border rounded-xl px-3 py-2.5 text-sm"
                    />
                    <button
                        type="submit"
                        disabled={uploading}
                        className="flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-800 transition disabled:opacity-50"
                    >
                        <Plus className="w-4 h-4" />
                        {uploading ? 'Subiendo...' : 'Subir Foto'}
                    </button>
                </form>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {(data.storeGallery ?? []).map(item => (
                    <div key={item.id} className="bg-white rounded-2xl overflow-hidden border shadow-sm group relative">
                        <img
                            src={`${BASE_URL}${item.image_url}`}
                            alt={item.description || 'Local'}
                            className="w-full aspect-[3/4] object-cover"
                        />
                        <div className="p-3">
                            <p className="text-xs text-gray-500 truncate">{item.description || '—'}</p>
                        </div>
                        <button
                            onClick={() => handleDelete(item.id)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                ))}
                {(data.storeGallery ?? []).length === 0 && (
                    <p className="text-gray-400 text-sm col-span-full text-center py-12">Todavía no hay fotos del local cargadas.</p>
                )}
            </div>
        </div>
    );
}

// ─── Landing Iphones Management ────────────────────────────────────────────────

function AdminLandingIphones() {
    const { data, refreshData } = useData();
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [order, setOrder] = useState(0);
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const fileRef = React.useRef<HTMLInputElement>(null);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file && !name) return;
        setLoading(true);
        const formData = new FormData();
        if (file) formData.append('image', file);
        formData.append('name', name);
        formData.append('price_string', price);
        formData.append('order_index', String(order));

        try {
            await fetch(`${API_URL}/landing-iphones`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${localStorage.getItem('apple_admin_token')}` },
                body: formData
            });
            setName('');
            setPrice('');
            setOrder(0);
            setFile(null);
            if (fileRef.current) fileRef.current.value = '';
            await refreshData();
        } catch {
            alert('Error al guardar el iPhone.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Eliminar este iPhone de la landing?')) return;
        await fetch(`${API_URL}/landing-iphones/${id}`, {
            method: 'DELETE',
            headers: authHeaders()
        });
        await refreshData();
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border">
                <h2 className="text-xl font-bold mb-1">Catálogo de iPhones (Landing)</h2>
                <p className="text-gray-500 text-sm mb-6">Gestioná los modelos que aparecen en la sección destacada de la página principal.</p>
                <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="flex flex-col gap-1 md:col-span-2">
                        <label className="text-[10px] uppercase font-bold text-gray-400 ml-1">Modelo / Nombre</label>
                        <input
                            type="text"
                            placeholder="Ej: iPhone 17 Pro"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="border rounded-xl px-3 py-2.5 text-sm"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase font-bold text-gray-400 ml-1">Precio (Texto)</label>
                        <input
                            type="text"
                            placeholder="Ej: Desde $799.999"
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                            className="border rounded-xl px-3 py-2.5 text-sm"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase font-bold text-gray-400 ml-1">Orden</label>
                        <input
                            type="number"
                            value={order}
                            onChange={e => setOrder(Number(e.target.value))}
                            className="border rounded-xl px-3 py-2.5 text-sm"
                        />
                    </div>
                    <div className="flex flex-col gap-1 md:col-span-3">
                        <label className="text-[10px] uppercase font-bold text-gray-400 ml-1">Imagen del Producto</label>
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            onChange={e => setFile(e.target.files?.[0] ?? null)}
                            className="border rounded-xl px-3 py-2 text-sm w-full"
                            required
                        />
                    </div>
                    <div className="flex items-end md:col-span-1">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            {loading ? 'Guardando...' : 'Agregar iPhone'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {(data.landingIphones ?? []).map(item => (
                    <div key={item.id} className="bg-white rounded-[2rem] overflow-hidden border shadow-sm group relative flex flex-col">
                        <div className="aspect-square bg-[#f5f5f7] p-8 flex items-center justify-center">
                            <img
                                src={`${BASE_URL}${item.image_url}`}
                                alt={item.name}
                                className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        <div className="p-5 flex-1 flex flex-col items-center text-center">
                            <span className="text-[10px] uppercase font-bold text-emerald-600 mb-1">Orden: {item.order_index}</span>
                            <h4 className="font-bold text-lg mb-1">{item.name}</h4>
                            <p className="text-gray-500 text-sm font-medium">{item.price_string}</p>
                        </div>
                        <button
                            onClick={() => handleDelete(item.id)}
                            className="absolute top-4 right-4 bg-white/80 backdrop-blur-md text-red-500 p-2 rounded-full shadow-md hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
                {(data.landingIphones ?? []).length === 0 && (
                    <p className="text-gray-400 text-sm col-span-full text-center py-12 bg-gray-50 rounded-[2rem] border border-dashed">No hay iPhones cargados para la landing.</p>
                )}
            </div>
        </div>
    );
}

// ─── Landing Accessories Management ────────────────────────────────────────────

function AdminLandingAccessories() {
    const { data, refreshData } = useData();
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [order, setOrder] = useState(0);
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const fileRef = React.useRef<HTMLInputElement>(null);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file && !name) return;
        setLoading(true);
        const formData = new FormData();
        if (file) formData.append('image', file);
        formData.append('name', name);
        formData.append('price_string', price);
        formData.append('order_index', String(order));

        try {
            await fetch(`${API_URL}/landing-accessories`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${localStorage.getItem('apple_admin_token')}` },
                body: formData
            });
            setName('');
            setPrice('');
            setOrder(0);
            setFile(null);
            if (fileRef.current) fileRef.current.value = '';
            await refreshData();
        } catch {
            alert('Error al guardar el accesorio.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Eliminar este accesorio de la landing?')) return;
        await fetch(`${API_URL}/landing-accessories/${id}`, {
            method: 'DELETE',
            headers: authHeaders()
        });
        await refreshData();
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border">
                <h2 className="text-xl font-bold mb-1">Catálogo de Accesorios (Landing)</h2>
                <p className="text-gray-500 text-sm mb-6">Gestioná los modelos que aparecen en la sección destacada de accesorios de la página principal.</p>
                <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="flex flex-col gap-1 md:col-span-2">
                        <label className="text-[10px] uppercase font-bold text-gray-400 ml-1">Modelo / Nombre</label>
                        <input
                            type="text"
                            placeholder="Ej: AirPods Pro"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="border rounded-xl px-3 py-2.5 text-sm"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase font-bold text-gray-400 ml-1">Precio (Texto)</label>
                        <input
                            type="text"
                            placeholder="Ej: Desde $299.999"
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                            className="border rounded-xl px-3 py-2.5 text-sm"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase font-bold text-gray-400 ml-1">Orden</label>
                        <input
                            type="number"
                            value={order}
                            onChange={e => setOrder(Number(e.target.value))}
                            className="border rounded-xl px-3 py-2.5 text-sm"
                        />
                    </div>
                    <div className="flex flex-col gap-1 md:col-span-3">
                        <label className="text-[10px] uppercase font-bold text-gray-400 ml-1">Imagen del Producto</label>
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            onChange={e => setFile(e.target.files?.[0] ?? null)}
                            className="border rounded-xl px-3 py-2 text-sm w-full"
                            required
                        />
                    </div>
                    <div className="flex items-end md:col-span-1">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            {loading ? 'Guardando...' : 'Agregar Accesorio'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {(data.landingAccessories ?? []).map(item => (
                    <div key={item.id} className="bg-white rounded-[2rem] overflow-hidden border shadow-sm group relative flex flex-col">
                        <div className="aspect-square bg-[#f5f5f7] p-8 flex items-center justify-center">
                            <img
                                src={`${BASE_URL}${item.image_url}`}
                                alt={item.name}
                                className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        <div className="p-5 flex-1 flex flex-col items-center text-center">
                            <span className="text-[10px] uppercase font-bold text-emerald-600 mb-1">Orden: {item.order_index}</span>
                            <h4 className="font-bold text-lg mb-1">{item.name}</h4>
                            <p className="text-gray-500 text-sm font-medium">{item.price_string}</p>
                        </div>
                        <button
                            onClick={() => handleDelete(item.id)}
                            className="absolute top-4 right-4 bg-white/80 backdrop-blur-md text-red-500 p-2 rounded-full shadow-md hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
                {(data.landingAccessories ?? []).length === 0 && (
                    <p className="text-gray-400 text-sm col-span-full text-center py-12 bg-gray-50 rounded-[2rem] border border-dashed">No hay accesorios cargados para la landing.</p>
                )}
            </div>
        </div>
    );
}

// ─── FAQ Management ────────────────────────────────────────────────────────────

function AdminFaqs() {
    const { data, refreshData } = useData();
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [order, setOrder] = useState(0);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!question || !answer) return;
        setLoading(true);
        const payload = { question, answer, order: Number(order) };
        const url = editingId ? `${API_URL}/faqs/${editingId}` : `${API_URL}/faqs`;
        const method = editingId ? 'PUT' : 'POST';

        try {
            await fetch(url, {
                method,
                headers: authHeaders(),
                body: JSON.stringify(payload)
            });
            setQuestion('');
            setAnswer('');
            setOrder(0);
            setEditingId(null);
            await refreshData();
        } catch {
            alert('Error al guardar la FAQ.');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (faqi: any) => {
        setEditingId(faqi.id);
        setQuestion(faqi.question);
        setAnswer(faqi.answer);
        setOrder(faqi.order);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Eliminar esta pregunta frecuente?')) return;
        await fetch(`${API_URL}/faqs/${id}`, {
            method: 'DELETE',
            headers: authHeaders()
        });
        await refreshData();
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="bg-white p-6 rounded-2xl border shadow-sm lg:col-span-4 self-start">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-9 h-9 bg-black text-white rounded-full flex items-center justify-center">
                        <HelpCircle className="w-4 h-4" />
                    </div>
                    <h3 className="font-semibold text-lg">{editingId ? 'Editar FAQ' : 'Nueva FAQ'}</h3>
                </div>
                <form onSubmit={handleSave} className="flex flex-col gap-3">
                    <div>
                        <label className="text-xs text-gray-500 block mb-1">Pregunta</label>
                        <input
                            type="text"
                            value={question}
                            onChange={e => setQuestion(e.target.value)}
                            className="border p-2.5 rounded-xl w-full text-sm focus:outline-none focus:ring-1 focus:ring-black"
                            placeholder="¿Cuál es la garantía?"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 block mb-1">Respuesta</label>
                        <textarea
                            value={answer}
                            onChange={e => setAnswer(e.target.value)}
                            className="border p-2.5 rounded-xl w-full text-sm focus:outline-none focus:ring-1 focus:ring-black"
                            rows={4}
                            placeholder="La garantía es de 12 meses..."
                            required
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 block mb-1">Orden</label>
                        <input
                            type="number"
                            value={order}
                            onChange={e => setOrder(Number(e.target.value))}
                            className="border p-2.5 rounded-xl w-full text-sm focus:outline-none focus:ring-1 focus:ring-black"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-2 w-full bg-black text-white p-2.5 text-sm rounded-xl hover:bg-gray-900 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        {loading ? 'Guardando...' : editingId ? 'Actualizar FAQ' : 'Agregar FAQ'}
                    </button>
                    {editingId && (
                        <button
                            type="button"
                            onClick={() => { setEditingId(null); setQuestion(''); setAnswer(''); setOrder(0); }}
                            className="text-gray-500 text-xs hover:underline mt-1"
                        >
                            Cancelar edición
                        </button>
                    )}
                </form>
            </div>

            <div className="bg-white p-6 rounded-2xl border shadow-sm lg:col-span-8">
                <h3 className="font-semibold text-lg mb-4">Listado de Preguntas Frecuentes</h3>
                <div className="flex flex-col gap-4">
                    {(data.faqs ?? []).map(f => (
                        <div key={f.id} className="p-4 border rounded-xl bg-gray-50 flex justify-between gap-4 group hover:bg-white transition-colors">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="bg-white px-2 py-0.5 rounded text-[10px] font-bold border text-gray-500">Pos: {f.order}</span>
                                    <h4 className="font-bold text-gray-900">{f.question}</h4>
                                </div>
                                <p className="text-sm text-gray-600 font-medium">{f.answer}</p>
                            </div>
                            <div className="flex flex-col gap-2 items-end">
                                <button
                                    onClick={() => handleEdit(f)}
                                    className="text-blue-600 hover:text-blue-800 text-xs font-bold bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDelete(f.id)}
                                    className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-lg hover:bg-red-100 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                    {(data.faqs?.length === 0) && (
                        <p className="text-gray-400 text-center py-12 border border-dashed rounded-2xl">No hay preguntas frecuentes cargadas.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

