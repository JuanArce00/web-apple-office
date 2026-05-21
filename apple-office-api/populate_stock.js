const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const csvData = `Modelo,CapacidadGB,Bateria,Condicion,Precio USD,Stock,Notas,Color,Precio ARS
Iphone XR ,64,85% - 89%,Usado,170,FALSE,,,258400
Iphone XR ,64,82% - 84%,Usado,0,FALSE,,,0
Iphone XR ,128,85% - 89%,Usado,0,FALSE,,,0
Iphone XR ,128,82% - 84%,Usado,0,FALSE,,,0
iPhone 11,64,90% - 100%,Usado,230,TRUE,,Lila,349600
iPhone 11,64,85% - 89%,Usado,0,FALSE,,,0
iPhone 11,64,82% - 84%,Usado,0,FALSE,,,0
iPhone 11,128,90% - 100%,Usado,250,TRUE,,verde,380000
iPhone 11,128,85% - 89%,Usado,0,FALSE,,,0
iPhone 11,128,82% - 84%,Usado,0,FALSE,,,0
iPhone 11 Pro,64,90% - 100%,Usado,0,FALSE,,,0
iPhone 11 Pro,64,85% - 89%,Usado,0,FALSE,,,0
iPhone 11 Pro,64,82% - 84%,Usado,0,FALSE,,,0
iPhone 11 Pro,256,90% - 100%,Usado,0,FALSE,,,0
iPhone 11 Pro,256,85% - 89%,Usado,0,FALSE,,,0
iPhone 11 Pro,256,82% - 84%,Usado,0,FALSE,,,0
iPhone 11 Pro Max,64,90% - 100%,Usado,290,TRUE,,gris,440800
iPhone 11 Pro Max,64,85% - 89%,Usado,0,FALSE,,,0
iPhone 11 Pro Max,64,82% - 84%,Usado,0,FALSE,,,0
iPhone 11 Pro Max,256,90% - 100%,Usado,0,FALSE,,,0
iPhone 11 Pro Max,256,85% - 89%,Usado,0,FALSE,,,0
iPhone 11 Pro Max,256,82% - 84%,Usado,0,FALSE,,,0
iPhone 12,64,90% - 100%,Usado,0,FALSE,,,0
iPhone 12,64,85% - 89%,Usado,0,FALSE,,,0
iPhone 12,64,82% - 84%,Usado,0,FALSE,,,0
iPhone 12,128,90% - 100%,Usado,310,TRUE,,lila,471200
iPhone 12,128,85% - 89%,Usado,0,FALSE,,,0
iPhone 12,128,82% - 84%,Usado,0,FALSE,,,0
iPhone 12,256,90% - 100%,Usado,0,FALSE,,,0
iPhone 12,256,85% - 89%,Usado,0,FALSE,,,0
iPhone 12,256,82% - 84%,Usado,0,FALSE,,,0
iPhone 12 mini,64,90% - 100%,Usado,0,FALSE,,,0
iPhone 12 mini,64,85% - 89%,Usado,0,FALSE,,,0
iPhone 12 mini,64,82% - 84%,Usado,0,FALSE,,,0
iPhone 12 mini,128,90% - 100%,Usado,0,FALSE,,,0
iPhone 12 mini,128,85% - 89%,Usado,0,FALSE,,,0
iPhone 12 mini,128,82% - 84%,Usado,0,FALSE,,,0
iPhone 12 Pro,128,90% - 100%,Usado,350,TRUE,,,532000
iPhone 12 Pro,128,85% - 89%,Usado,0,FALSE,,,0
iPhone 12 Pro,128,82% - 84%,Usado,0,FALSE,,,0
iPhone 12 Pro,256,90% - 100%,Usado,0,FALSE,,,0
iPhone 12 Pro,256,85% - 89%,Usado,0,FALSE,,,0
iPhone 12 Pro,256,82% - 84%,Usado,0,FALSE,,,0
iPhone 12 Pro Max,128,90% - 100%,Usado,0,FALSE,,,0
iPhone 12 Pro Max,128,85% - 89%,Usado,0,FALSE,,,0
iPhone 12 Pro Max,128,82% - 84%,Usado,0,FALSE,,,0
iPhone 12 Pro Max,256,90% - 100%,Usado,0,FALSE,,,0
iPhone 12 Pro Max,256,85% - 89%,Usado,0,FALSE,,,0
iPhone 12 Pro Max,256,82% - 84%,Usado,0,FALSE,,,0
iPhone 13,128,90% - 100%,Usado,390,TRUE,,"Azul, negro, ",592800
iPhone 13,128,85% - 89%,Usado,375,TRUE,,Azul ,570000
iPhone 13,128,82% - 84%,Usado,355,TRUE,,,539600
iPhone 13,256,90% - 100%,Usado,0,FALSE,,,0
iPhone 13,256,85% - 89%,Usado,0,FALSE,,,0
iPhone 13,256,82% - 84%,Usado,0,FALSE,,,0
iPhone 13,128,100%,sellado,0,FALSE,,,0
iPhone 13 mini,128,90% - 100%,Usado,0,FALSE,,,0
iPhone 13 mini,128,85% - 89%,Usado,0,FALSE,,,0
iPhone 13 mini,128,82% - 84%,Usado,0,FALSE,,,0
iPhone 13 mini,256,90% - 100%,Usado,0,FALSE,,,0
iPhone 13 mini,256,85% - 89%,Usado,0,FALSE,,,0
iPhone 13 mini,256,82% - 84%,Usado,0,FALSE,,,0
iPhone 13 Pro,128,90% - 100%,Usado,485,TRUE,,Negro verde,737200
iPhone 13 Pro,128,85% - 89%,Usado,475,FALSE,,Dorado verde celeste y gris,722000
iPhone 13 Pro,128,82% - 84%,Usado,460,FALSE,,negro  ,699200
iPhone 13 Pro,256,90% - 100%,Usado,0,FALSE,,,0
iPhone 13 Pro,256,85% - 89%,Usado,0,FALSE,,,0
iPhone 13 Pro,256,82% - 84%,Usado,0,FALSE,,,0
iPhone 13 Pro Max,128,90% - 100%,Usado,0,FALSE,,,0
iPhone 13 Pro Max,128,85% - 89%,Usado,570,FALSE,,Gris grafito ,866400
iPhone 13 Pro Max,128,82% - 84%,Usado,0,FALSE,,,0
iPhone 13 Pro Max,256,90% - 100%,Usado,0,FALSE,,,0
iPhone 13 Pro Max,256,85% - 89%,Usado,0,FALSE,,,0
iPhone 13 Pro Max,256,82% - 84%,Usado,0,FALSE,,,0
iPhone 13 Pro Max,512,90% - 100%,Usado,0,FALSE,,,0
iPhone 13 Pro Max,512,85% - 89%,Usado,0,FALSE,,,0
iPhone 13 Pro Max,512,82% - 84%,Usado,0,FALSE,,,0
iPhone 14,128,100%,Sellado,0,FALSE,,,0
iPhone 14,128,90% - 100%,Usado,410,TRUE,,celeste negro,623200
iPhone 14,128,85% - 89%,Usado,400,FALSE,,celeste,608000
iPhone 14,128,82% - 84%,Usado,0,FALSE,,,0
iPhone 14,256,90% - 100%,Usado,0,FALSE,,,0
iPhone 14,256,85% - 89%,Usado,0,FALSE,,,0
iPhone 14,256,82% - 84%,Usado,0,FALSE,,,0
iPhone 14 Plus,128,90% - 100%,Usado,0,FALSE,,,0
iPhone 14 Plus,128,85% - 89%,Usado,0,FALSE,,,0
iPhone 14 Plus,128,82% - 84%,Usado,0,FALSE,,,0
iPhone 14 Plus,128,90% - 100%,Usado,0,FALSE,,,0
iPhone 14 Plus,256,85% - 89%,Usado,0,FALSE,,,0
iPhone 14 Plus,256,82% - 84%,Usado,0,FALSE,,,0
iPhone 14 Pro,128,90% - 100%,Usado,560,TRUE,,,851200
iPhone 14 Pro,128,85% - 89%,Usado,550,FALSE,,,836000
iPhone 14 Pro,128,82% - 84%,Usado,535,FALSE,,,813200
iPhone 14 Pro,256,90% - 100%,Usado,0,FALSE,,,0
iPhone 14 Pro,256,85% - 89%,Usado,0,FALSE,,,0
iPhone 14 Pro,256,82% - 84%,Usado,0,FALSE,,,0
iPhone 14 Pro Max,128,90% - 100%,Usado,690,FALSE,,,1048800
iPhone 14 Pro Max,128,85% - 89%,Usado,675,TRUE,,negro,1026000
iPhone 14 Pro Max,128,82% - 84%,Usado,660,FALSE,,,1003200
iPhone 14 Pro Max,256,90% - 100%,Usado,0,FALSE,,,0
iPhone 14 Pro Max,256,85% - 89%,Usado,0,FALSE,,,0
iPhone 14 Pro Max,256,82% - 84%,Usado,0,FALSE,,,0
iPhone 15,128,100%,Sellado,0,FALSE,,,0
iPhone 15,128,90% - 100%,Usado,0,FALSE,,,0
iPhone 15,128,85% - 89%,Usado,520,TRUE,OFERTA 88% BAT. Detalles de uso,negro,790400
iPhone 15,128,82% - 84%,Usado,0,FALSE,,,0
iPhone 15,256,90% - 100%,Usado,0,FALSE,,,0
iPhone 15,256,85% - 89%,Usado,0,FALSE,,,0
iPhone 15,256,82% - 84%,Usado,0,FALSE,,,0
iPhone 15 Plus,128,90% - 100%,Usado,0,FALSE,,,0
iPhone 15 Plus,128,85% - 89%,Usado,0,FALSE,,,0
iPhone 15 Plus,128,82% - 84%,Usado,0,FALSE,,,0
iPhone 15 Plus,256,90% - 100%,Usado,0,FALSE,,,0
iPhone 15 Plus,256,85% - 89%,Usado,0,FALSE,,,0
iPhone 15 Plus,256,82% - 84%,Usado,0,FALSE,,,0
iPhone 15 Pro,128,90% - 100%,Usado,0,FALSE,,,0
iPhone 15 Pro,128,,Usado,0,FALSE,,,0
iPhone 15 Pro,128,82% - 84%,Usado,0,FALSE,,,0
iPhone 15 Pro,256,90% - 100%,Usado,0,FALSE,,,0
iPhone 15 Pro,256,85% - 89%,Usado,730,FALSE,,negro,1109600
iPhone 15 Pro,256,82% - 84%,Usado,0,FALSE,,,0
iPhone 15 Pro Max,256,90% - 100%,Usado,0,FALSE,,,0
iPhone 15 Pro Max,256,85% - 89%,Usado,835,TRUE,,negro,1269200
iPhone 15 Pro Max,256,82% - 84%,Usado,820,FALSE,,negro,1246400
iPhone 16,128,100%,Sellado,0,FALSE,,,0
iPhone 16,256,100%,Nuevo,0,FALSE,,,0
iPhone 16,128,90% - 100%,Usado,700,TRUE,,rosa,1064000
iPhone 16,256,90% - 100%,Usado,0,FALSE,,,0
iPhone 16 Plus,128,90% - 100%,Usado,0,FALSE,,,0
iPhone 16 Pro,128,100%,Nuevo,0,FALSE,,,0
iPhone 16 Pro,256,100%,Nuevo,0,FALSE,,,0
iPhone 16 Pro,128,90% - 100%,Usado,820,TRUE,Oferta 16 Pro 128gb 92% detalles de uso,negro,1246400
iPhone 16 Pro,256,90% - 100%,Usado,0,FALSE,,,0
iPhone 16 Pro Max,256,90% - 100%,Usado,1020,TRUE,,desert y negro,1550400
iPhone 16 Pro Max,512,90% - 100%,Usado,0,FALSE,,,0
iPhone 17 PRO,256,100%,Nuevo Sellado,1320,FALSE,,,2006400
iPhone 17 Pro Max,256,100%,Nuevo sellado,1490,FALSE,,,2264800`;

async function main() {
    console.log("Iniciando purga e importación de Stock desde el CSV...");
    
    // Purge old stock
    await prisma.iphoneStock.deleteMany();
    console.log("Registros antiguos de stock eliminados.");

    const lines = csvData.trim().split("\n");
    // Skip header line
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Parse row handling possible commas inside quoted strings if necessary, 
        // but this simple CSV is standard comma-separated. Let's write a generic splitter.
        const parts = [];
        let current = "";
        let inQuotes = false;
        for (let charIndex = 0; charIndex < line.length; charIndex++) {
            const char = line[charIndex];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                parts.push(current);
                current = "";
            } else {
                current += char;
            }
        }
        parts.push(current);

        if (parts.length < 5) continue;

        // Extract and trim properties
        let rawModel = parts[0].trim();
        const rawCap = parts[1].trim();
        const rawBat = parts[2].trim();
        const rawPriceUsd = parts[4].trim();

        const priceUsd = parseFloat(rawPriceUsd);

        // Skip rows with price_usd === 0 or empty/invalid price
        if (isNaN(priceUsd) || priceUsd === 0) {
            continue;
        }

        const capacity = parseInt(rawCap, 10);
        if (isNaN(capacity)) {
            console.log(`Fila omitida por capacidad inválida: ${line}`);
            continue;
        }

        // Normalize Model Name: trim, correct case like 'Iphone' to 'iPhone', and normalize space before Pro
        let model = rawModel
            .replace(/^Iphone/i, "iPhone")
            .replace(/\s+/g, " ")
            .trim();
        
        // Let's normalize iPhone 17 PRO -> iPhone 17 Pro
        if (model.toLowerCase().endsWith(" pro")) {
            model = model.substring(0, model.length - 4) + " Pro";
        } else if (model.toLowerCase().endsWith(" pro max")) {
            model = model.substring(0, model.length - 8) + " Pro Max";
        } else if (model.toLowerCase().endsWith(" xr")) {
            model = model.substring(0, model.length - 3) + " XR";
        }

        // Normalize battery status/range
        let battery = rawBat.trim();
        if (!battery) {
            battery = "Indistinto"; // distinct identifier for empty battery
        }

        console.log(`Insertando Stock -> Modelo: ${model}, Capacidad: ${capacity}GB, Batería: ${battery}, Precio: USD ${priceUsd}`);

        // Create the Stock record
        await prisma.iphoneStock.create({
            data: {
                model,
                capacity_gb: capacity,
                battery_status: battery,
                price_usd: priceUsd
            }
        });

        // Thorough UX optimization: Make sure this model exists in BaseModel configurations!
        try {
            await prisma.baseModel.upsert({
                where: { name: model },
                update: {},
                create: { name: model }
            });
        } catch (e) {
            // Already exists or handles unique constraint
        }

        // Make sure the capacity exists in BaseCapacity configurations!
        try {
            await prisma.baseCapacity.upsert({
                where: { size: capacity },
                update: {},
                create: { size: capacity }
            });
        } catch (e) {
            // Already exists
        }

        // Make sure the battery range/status exists in BaseBattery configurations!
        try {
            await prisma.baseBattery.upsert({
                where: { status: battery },
                update: {},
                create: { status: battery }
            });
        } catch (e) {
            // Already exists
        }
    }

    console.log("¡Importación de stock finalizada con total éxito!");
}

main()
    .catch((e) => {
        console.error("Error en la carga de Stock:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
