const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    await prisma.config.create({ data: { key: 'dollar_value', value: '1450' } });

    const models = ["iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 15", "iPhone 14 Pro", "iPhone 14", "iPhone 13 Pro", "iPhone 13", "iPhone 12", "iPhone 11"];
    for (const m of models) await prisma.baseModel.create({ data: { name: m } });

    const caps = [64, 128, 256, 512, 1024];
    for (const c of caps) await prisma.baseCapacity.create({ data: { size: c } });

    const batts = ["Nuevo (Sellado)", "90-100%", "80-89%", "70-79%", "Menor a 70%"];
    for (const b of batts) await prisma.baseBattery.create({ data: { status: b } });

    const colors = ["Titanium Black", "Natural Titanium", "Space Black", "Deep Purple", "Midnight", "Starlight", "Blue"];
    for (const c of colors) await prisma.baseColor.create({ data: { name: c } });

    const accs = [
        { name: "Funda MagSafe Clear", price_usd: 50 },
        { name: "Cargador USB-C 20W", price_usd: 30 },
        { name: "Vidrio Templado Premium", price_usd: 15 },
        { name: "AirPods Pro 2", price_usd: 250 },
    ];
    for (const a of accs) await prisma.accessory.create({ data: a });

    await prisma.iphoneStock.createMany({
        data: [
            { model: "iPhone 15 Pro", capacity_gb: 128, battery_status: "Nuevo (Sellado)", color: "Titanium Black", price_usd: 1000 },
            { model: "iPhone 13", capacity_gb: 128, battery_status: "80-89%", color: "Blue", price_usd: 500 },
        ]
    });

    await prisma.tradeInPrice.createMany({
        data: [
            { model: "iPhone 11", capacity_gb: 64, battery_range: "70-79%", price_usd: 150 },
            { model: "iPhone 13 Pro", capacity_gb: 128, battery_range: "90-100%", price_usd: 400 },
        ]
    });

    await prisma.financingCard.createMany({
        data: [
            { card_name: "Visa", base_factor: 1.0 },
            { card_name: "Mastercard", base_factor: 1.0 },
        ]
    });

    await prisma.financingPlan.createMany({
        data: [
            { card_name: "Visa", installments: 3, surcharge_coefficient: 1.15 },
            { card_name: "Visa", installments: 6, surcharge_coefficient: 1.30 },
            { card_name: "Mastercard", installments: 3, surcharge_coefficient: 1.20 },
        ]
    });

    console.log("Seeding finished!");
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
