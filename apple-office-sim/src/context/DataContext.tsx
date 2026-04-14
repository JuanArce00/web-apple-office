import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export type FeatureCard = {
    icon: string;
    title: string;
    desc: string;
};

export type AppData = {
    config: { dollar_value: number };
    feature_cards: FeatureCard[];
    models: string[];
    capacities: number[];
    batteries: string[];
    colors: string[];
    accessories: Array<{ id: string, name: string, price_usd: number }>;
    iphoneStock: Array<{ id: string, model: string, capacity_gb: number, battery_status: string, color: string, price_usd: number }>;
    tradeInPrices: Array<{ id: string, model: string, capacity_gb: number, battery_range: string, price_usd: number }>;
    cards: Array<{ card_name: string, base_factor: number }>;
    plans: Array<{ id: string, card_name: string, installments: number, surcharge_coefficient: number }>;
    gallery: Array<{ id: string, image_url: string, description: string, created_at: string }>;
    storeGallery: Array<{ id: string, image_url: string, description: string, created_at: string }>;
};

const DEFAULT_FEATURE_CARDS: FeatureCard[] = [
    { icon: 'Package', title: 'Equipos Nuevos', desc: 'Sellados en caja, directo de fábrica. Con la seguridad de un unpacked genuino.' },
    { icon: 'ShieldCheck', title: 'Garantía Oficial', desc: 'Dormí tranquilo. Tenés 12 meses de garantía directa de Apple internacional.' },
    { icon: 'RefreshCw', title: 'Plan Canje', desc: 'Dejá tu equipo actual como parte de pago. Lo cotizamos al mejor valor del mercado.' },
    { icon: 'MessageCircleHeart', title: 'Atención Premium', desc: 'Te guiamos y migramos tus datos mientras disfrutás del ambiente.' }
];

const defaultData: AppData = {
    config: { dollar_value: 1000 },
    feature_cards: DEFAULT_FEATURE_CARDS,
    models: [], capacities: [], batteries: [], colors: [],
    accessories: [], iphoneStock: [], tradeInPrices: [], cards: [], plans: [], gallery: [], storeGallery: []
};

type DataContextType = {
    data: AppData;
    refreshData: () => Promise<void>;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [data, setData] = useState<AppData>(defaultData);

    const refreshData = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/data');
            const json = await res.json();
            setData({
                ...json,
                feature_cards: json.feature_cards?.length ? json.feature_cards : DEFAULT_FEATURE_CARDS
            });
        } catch (e) {
            console.error("Failed to load DB data", e);
        }
    };

    useEffect(() => {
        refreshData();
    }, []);

    return <DataContext.Provider value={{ data, refreshData }}>{children}</DataContext.Provider>;
};

export const useData = () => {
    const ctx = useContext(DataContext);
    if (!ctx) throw new Error("useData must be used inside DataProvider");
    return ctx;
};
