const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const modelsToSeed = [
    "iPhone XR",
    "iPhone XS",
    "iPhone XS Max",
    "iPhone 11",
    "iPhone 11 Pro",
    "iPhone 11 Pro Max",
    "iPhone SE (2020)",
    "iPhone 12 mini",
    "iPhone 12",
    "iPhone 12 Pro",
    "iPhone 12 Pro Max",
    "iPhone 13 mini",
    "iPhone 13",
    "iPhone 13 Pro",
    "iPhone 13 Pro Max",
    "iPhone SE (2022)",
    "iPhone 14",
    "iPhone 14 Plus",
    "iPhone 14 Pro",
    "iPhone 14 Pro Max",
    "iPhone 15",
    "iPhone 15 Plus",
    "iPhone 15 Pro",
    "iPhone 15 Pro Max",
    "iPhone 16",
    "iPhone 16 Plus",
    "iPhone 16 Pro",
    "iPhone 16 Pro Max"
];

async function main() {
    console.log("Starting iPhone models population (XR onwards)...");
    
    let addedCount = 0;
    let existingCount = 0;

    for (const modelName of modelsToSeed) {
        // Find or create base models
        const existing = await prisma.baseModel.findUnique({
            where: { name: modelName }
        });

        if (!existing) {
            await prisma.baseModel.create({
                data: { name: modelName }
            });
            addedCount++;
        } else {
            existingCount++;
        }
    }

    console.log(`✅ Finished population! Added: ${addedCount}, Already existed: ${existingCount}`);
}

main()
    .catch(e => {
        console.error("❌ Error populating models:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
