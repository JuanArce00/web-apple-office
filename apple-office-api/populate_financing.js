const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const cards = [
    { card_name: "Su Credito", base_factor: 1.18 },
    { card_name: "Master Card", base_factor: 1.12 },
    { card_name: "Sol", base_factor: 1.12 },
    { card_name: "Naranja", base_factor: 1.0 },
    { card_name: "Visa", base_factor: 1.12 }
];

const plans = [
    { card_name: "Master Card", installments: 12, surcharge_coefficient: 1.677 },
    { card_name: "Master Card", installments: 9, surcharge_coefficient: 1.489 },
    { card_name: "Master Card", installments: 6, surcharge_coefficient: 1.3 },
    { card_name: "Master Card", installments: 3, surcharge_coefficient: 1.16 },
    { card_name: "Sol", installments: 12, surcharge_coefficient: 1.5 },
    { card_name: "Sol", installments: 9, surcharge_coefficient: 1.4 },
    { card_name: "Sol", installments: 6, surcharge_coefficient: 1.32 },
    { card_name: "Sol", installments: 3, surcharge_coefficient: 1.25 },
    { card_name: "Naranja", installments: 12, surcharge_coefficient: 1.923 },
    { card_name: "Naranja", installments: 10, surcharge_coefficient: 1.734 },
    { card_name: "Naranja", installments: 9, surcharge_coefficient: 1.657 },
    { card_name: "Naranja", installments: 6, surcharge_coefficient: 1.422 },
    { card_name: "Naranja", installments: 5, surcharge_coefficient: 1.362 },
    { card_name: "Naranja", installments: 3, surcharge_coefficient: 1.25 },
    { card_name: "Naranja", installments: 1, surcharge_coefficient: 1.15 },
    { card_name: "Visa", installments: 12, surcharge_coefficient: 1.584 },
    { card_name: "Visa", installments: 9, surcharge_coefficient: 1.429 },
    { card_name: "Visa", installments: 6, surcharge_coefficient: 1.267 },
    { card_name: "Visa", installments: 3, surcharge_coefficient: 1.145 },
    { card_name: "Su Credito", installments: 3, surcharge_coefficient: 1.259 },
    { card_name: "Visa", installments: 1, surcharge_coefficient: 1.05 }
];

async function main() {
    console.log("Iniciando depuración y carga de tarjetas y planes...");
    
    // Delete existing records
    await prisma.financingPlan.deleteMany();
    await prisma.financingCard.deleteMany();
    console.log("Registros antiguos eliminados correctamente.");

    // Insert new cards
    for (const card of cards) {
        await prisma.financingCard.create({
            data: card
        });
        console.log(`Tarjeta agregada: ${card.card_name} (Base Factor: ${card.base_factor})`);
    }

    // Insert new plans
    for (const plan of plans) {
        await prisma.financingPlan.create({
            data: plan
        });
        console.log(`Plan agregado para ${plan.card_name}: ${plan.installments} cuotas (Surcharge: ${plan.surcharge_coefficient})`);
    }

    console.log("¡Carga completada de forma exitosa!");
}

main()
    .catch((e) => {
        console.error("Error al poblar la base de datos:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
