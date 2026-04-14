export interface IphoneModel {
    name: string;
}

export interface Capacity {
    value: number; // GB
}

export interface BatteryStatus {
    name: string;
}

export interface IphoneStock {
    id: string; // convenient for mapping
    model: string;
    capacity_gb: number;
    battery_status: string;
    color: string;
    price_usd: number;
    price_ars: number; // we can calculate this dynamically using Configuration or store it. Prompt suggests keeping it.
    in_stock: boolean;
}

export interface AccessoryStock {
    id: string;
    product_name: string;
    category: "Case" | "Charger" | "Screen Protector" | "Audio" | "Other";
    price_ars: number;
    in_stock: boolean;
}

export interface BuybackPrice {
    model: string;
    capacity_gb: number;
    battery_range: string;
    price_usd: number;
    price_ars: number;
}

export interface Promotion {
    id: string;
    name: string;
    description: string;
    price_ars: number; // typically negative for discount
    is_active: boolean;
}

export interface FinancingCard {
    card_name: string;
    base_factor: number;
}

export interface FinancingPlan {
    id: string;
    card_name: string;
    installments: number;
    surcharge_coefficient: number;
}

export interface Configuration {
    dollar_value: number;
}

// ----------------------------------------------------
// Mock Data Initialization
// ----------------------------------------------------

export const Config: Configuration = {
    dollar_value: 1200, // Example ARS per USD
};

export const IphoneModels: IphoneModel[] = [
    { name: "iPhone 15 Pro Max" },
    { name: "iPhone 15 Pro" },
    { name: "iPhone 15" },
    { name: "iPhone 14 Pro" },
    { name: "iPhone 14" },
];

export const Capacities: Capacity[] = [
    { value: 128 },
    { value: 256 },
    { value: 512 },
    { value: 1024 },
];

export const BatteryStatuses: BatteryStatus[] = [
    { name: "Nuevo (Sellado)" },
    { name: "90-100%" },
    { name: "80-89%" },
    { name: "Menor a 80%" }
];

export const Colors = ["Titanium Black", "Natural Titanium", "Space Black", "Deep Purple", "Starlight", "Midnight"];

// Generate some sample stock
export const IphoneStocks: IphoneStock[] = [
    { id: "1", model: "iPhone 15 Pro Max", capacity_gb: 256, battery_status: "Nuevo (Sellado)", color: "Natural Titanium", price_usd: 1200, price_ars: 1200 * Config.dollar_value, in_stock: true },
    { id: "2", model: "iPhone 15 Pro", capacity_gb: 128, battery_status: "Nuevo (Sellado)", color: "Titanium Black", price_usd: 1000, price_ars: 1000 * Config.dollar_value, in_stock: true },
    { id: "3", model: "iPhone 15", capacity_gb: 128, battery_status: "90-100%", color: "Midnight", price_usd: 750, price_ars: 750 * Config.dollar_value, in_stock: true },
    { id: "4", model: "iPhone 14 Pro", capacity_gb: 256, battery_status: "80-89%", color: "Deep Purple", price_usd: 650, price_ars: 650 * Config.dollar_value, in_stock: true },
];

export const AccessoryStocks: AccessoryStock[] = [
    { id: "a1", product_name: "Funda MagSafe Clear", category: "Case", price_ars: 50000, in_stock: true },
    { id: "a2", product_name: "Cargador USB-C 20W", category: "Charger", price_ars: 35000, in_stock: true },
    { id: "a3", product_name: "Vidrio Templado Premium", category: "Screen Protector", price_ars: 15000, in_stock: true },
    { id: "a4", product_name: "AirPods Pro 2", category: "Audio", price_ars: 300000, in_stock: true },
];

// Example Trade-ins
export const BuybackPrices: BuybackPrice[] = [
    { model: "iPhone 13 Pro", capacity_gb: 128, battery_range: "90-100%", price_usd: 400, price_ars: 400 * Config.dollar_value },
    { model: "iPhone 13 Pro", capacity_gb: 128, battery_range: "80-89%", price_usd: 350, price_ars: 350 * Config.dollar_value },
    { model: "iPhone 12", capacity_gb: 64, battery_range: "80-89%", price_usd: 150, price_ars: 150 * Config.dollar_value },
];

export const Promotions: Promotion[] = [
    { id: "p1", name: "Descuento Lanzamiento", description: "Bono especial por comprar hoy", price_ars: -25000, is_active: true },
    { id: "p2", name: "Cupón VIP", description: "Cupón exclusivo para clientes VIP", price_ars: -50000, is_active: true },
];

export const FinancingCards: FinancingCard[] = [
    { card_name: "Visa", base_factor: 1.0 },
    { card_name: "Mastercard", base_factor: 1.0 },
    { card_name: "American Express", base_factor: 1.05 }, // 5% extra base
];

export const FinancingPlans: FinancingPlan[] = [
    { id: "f1", card_name: "Visa", installments: 1, surcharge_coefficient: 1.0 },
    { id: "f2", card_name: "Visa", installments: 3, surcharge_coefficient: 1.15 },
    { id: "f3", card_name: "Visa", installments: 6, surcharge_coefficient: 1.30 },
    { id: "f4", card_name: "Visa", installments: 12, surcharge_coefficient: 1.60 },

    { id: "f5", card_name: "Mastercard", installments: 1, surcharge_coefficient: 1.0 },
    { id: "f6", card_name: "Mastercard", installments: 3, surcharge_coefficient: 1.20 },
    { id: "f7", card_name: "Mastercard", installments: 6, surcharge_coefficient: 1.40 },
    { id: "f8", card_name: "Mastercard", installments: 12, surcharge_coefficient: 1.70 },

    { id: "f9", card_name: "American Express", installments: 1, surcharge_coefficient: 1.0 },
    { id: "f10", card_name: "American Express", installments: 3, surcharge_coefficient: 1.10 },
    { id: "f11", card_name: "American Express", installments: 6, surcharge_coefficient: 1.25 },
];
