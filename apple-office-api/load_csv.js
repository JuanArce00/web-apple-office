const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const csvData = `capacity_gb,price_usd,model,battery_range,notes,price_ars,id,created_date,updated_date,created_by_id,created_by,is_sample
"256","630","iPhone 15 Pro Max","85% - 89%","","900900","69ea1cf542657ca6173fadcc","2026-04-23T13:21:57.300000","2026-04-23T13:21:57.300000","699f03093dabc6bf144f9cfd","juarezfloresdamianmartin@gmail.com","false"
"256","540","iPhone 15 Pro","+90%","","772200","69ea0fa5c5659091dfeb42e2","2026-04-23T12:25:09.575000","2026-04-23T12:25:09.575000","699f03093dabc6bf144f9cfd","juarezfloresdamianmartin@gmail.com","false"
"256","540","iPhone 15 Pro","85% - 89%","","772200","69ea0f9742032bd5435f1ae0","2026-04-23T12:24:55.201000","2026-04-23T12:24:55.201000","699f03093dabc6bf144f9cfd","juarezfloresdamianmartin@gmail.com","false"
"128","520","iPhone 15 Pro","+90%","","743600","69ea0f75925ce1de6be4e4bb","2026-04-23T12:24:21.916000","2026-04-23T12:24:21.916000","699f03093dabc6bf144f9cfd","juarezfloresdamianmartin@gmail.com","false"
"128","520","iPhone 15 Pro","85% - 89%","","743600","69ea0f4c10c5faa5fb2d62b3","2026-04-23T12:23:40.135000","2026-04-23T12:23:40.135000","699f03093dabc6bf144f9cfd","juarezfloresdamianmartin@gmail.com","false"
"256","440","iPhone 15 Plus","","","629200","69ea0f284d13894ce0a2d9c0","2026-04-23T12:23:04.784000","2026-04-23T12:23:04.784000","699f03093dabc6bf144f9cfd","juarezfloresdamianmartin@gmail.com","false"
"128","430","iPhone 15 Plus","","","614900","69ea0f1bd95b371445c8621e","2026-04-23T12:22:51.531000","2026-04-23T12:22:51.531000","699f03093dabc6bf144f9cfd","juarezfloresdamianmartin@gmail.com","false"
"128","420","iPhone 15","+90%","","600600","69ea0efdc147c82d4ea09de7","2026-04-23T12:22:21.050000","2026-04-23T12:22:21.050000","699f03093dabc6bf144f9cfd","juarezfloresdamianmartin@gmail.com","false"
"128","400","iPhone 15","82% - 84%","","572000","69ea0eeab10c21584a91a311","2026-04-23T12:22:02.358000","2026-04-23T12:22:02.358000","699f03093dabc6bf144f9cfd","juarezfloresdamianmartin@gmail.com","false"
"128","410","iPhone 15","85% - 89%","","586300","69ea0ebcd297632b88470448","2026-04-23T12:21:16.555000","2026-04-23T12:21:16.555000","699f03093dabc6bf144f9cfd","juarezfloresdamianmartin@gmail.com","false"
"256","520","iPhone 14 Pro Max","","","743600","69ea0e9875a6bbccc91c43e0","2026-04-23T12:20:40.105000","2026-04-23T12:20:40.105000","699f03093dabc6bf144f9cfd","juarezfloresdamianmartin@gmail.com","false"
"128","500","iPhone 14 Pro Max","","","715000","69ea0e89bfb4a5ae9702dbe6","2026-04-23T12:20:25.403000","2026-04-23T12:20:25.403000","699f03093dabc6bf144f9cfd","juarezfloresdamianmartin@gmail.com","false"
"256","425","iPhone 14 Pro","","","607750","69ea0e7ce17dff0f1850fff7","2026-04-23T12:20:12.188000","2026-04-23T12:20:12.188000","699f03093dabc6bf144f9cfd","juarezfloresdamianmartin@gmail.com","false"
"128","410","iPhone 14 Pro","","","586300","69ea0e6cc9b9ba56c1f71c3d","2026-04-23T12:19:56.575000","2026-04-23T12:19:56.575000","699f03093dabc6bf144f9cfd","juarezfloresdamianmartin@gmail.com","false"
"128","315","iPhone 14 Plus","","","450450","69ea0e600dd917b525bac6fe","2026-04-23T12:19:44.070000","2026-04-23T12:19:44.070000","699f03093dabc6bf144f9cfd","juarezfloresdamianmartin@gmail.com","false"
"256","315","iPhone 14","","","450450","69ea0e4db5308b97607110d2","2026-04-23T12:19:25.609000","2026-04-23T12:19:25.609000","699f03093dabc6bf144f9cfd","juarezfloresdamianmartin@gmail.com","false"
"128","300","iPhone 14","","","429000","69ea0e3daf28a0711c6daec6","2026-04-23T12:19:09.560000","2026-04-23T12:19:09.560000","699f03093dabc6bf144f9cfd","juarezfloresdamianmartin@gmail.com","false"
"128","200","iPhone 13 mini","","","286000","69ea0e26067fd67cb53ba7e0","2026-04-23T12:18:46.689000","2026-04-23T12:18:46.689000","699f03093dabc6bf144f9cfd","juarezfloresdamianmartin@gmail.com","false"
"256","430","iPhone 13 Pro Max","","","614900","69ea0e11317e68dc8272f0bc","2026-04-23T12:18:25.029000","2026-04-23T12:18:25.029000","699f03093dabc6bf144f9cfd","juarezfloresdamianmartin@gmail.com","false"
"128","410","iPhone 13 Pro Max","","","586300","69ea0e01bf4623202280fc54","2026-04-23T12:18:09.685000","2026-04-23T12:18:09.685000","699f03093dabc6bf144f9cfd","juarezfloresdamianmartin@gmail.com","false"
"256","360","iPhone 13 Pro","","","514800","69ea0dea1e0ffcf6b533f5c5","2026-04-23T12:17:46.339000","2026-04-23T12:17:46.339000","699f03093dabc6bf144f9cfd","juarezfloresdamianmartin@gmail.com","false"
"128","350","iPhone 13 Pro","","","500500","69ea0ddefa6a678f05c2c567","2026-04-23T12:17:34.802000","2026-04-23T12:17:34.802000","699f03093dabc6bf144f9cfd","juarezfloresdamianmartin@gmail.com","false"
"256","270","iPhone 13","","","386100","69ea0dca59f8198688902966","2026-04-23T12:17:14.726000","2026-04-23T12:17:14.726000","699f03093dabc6bf144f9cfd","juarezfloresdamianmartin@gmail.com","false"
"128","260","iPhone 13","","","371800","69ea0d9b3f4978e7bc50f424","2026-04-23T12:16:27.198000","2026-04-23T12:16:27.198000","699f03093dabc6bf144f9cfd","juarezfloresdamianmartin@gmail.com","false"
"128","110","iPhone 12 mini","","","157300","69de359379aadf35dd8cefcd","2026-04-14T12:39:47.668000","2026-04-14T12:39:47.668000","699f03093dabc6bf144f9cfd","juarezfloresdamianmartin@gmail.com","false"
"64","100","iPhone 12 mini","","","143000","69de3583999c271a0b153f76","2026-04-14T12:39:31.069000","2026-04-14T12:39:31.069000","699f03093dabc6bf144f9cfd","juarezfloresdamianmartin@gmail.com","false"
"256","290","iPhone 12 Pro Max","","","414700","69de356d92dda0a53f8c124a","2026-04-14T12:39:09.668000","2026-04-14T12:39:09.668000","699f03093dabc6bf144f9cfd","juarezfloresdamianmartin@gmail.com","false"
"128","280","iPhone 12 Pro Max","","","400400","69de356235cc45fdbb277dfc","2026-04-14T12:38:58.364000","2026-04-14T12:38:58.364000","699f03093dabc6bf144f9cfd","juarezfloresdamianmartin@gmail.com","false"
"256","250","iPhone 12 Pro","","","357500","69de35499677a7899c7ef953","2026-04-14T12:38:33.903000","2026-04-14T12:38:33.903000","699f03093dabc6bf144f9cfd","juarezfloresdamianmartin@gmail.com","false"
"128","240","iPhone 12 Pro","","","343200","69de353f3dbc778d825c63c3","2026-04-14T12:38:23.878000","2026-04-14T12:38:23.878000","699f03093dabc6bf144f9cfd","juarezfloresdamianmartin@gmail.com","false"
"128","180","iPhone 12","","","257400","69de35100d1d65f23e947098","2026-04-14T12:37:36.137000","2026-04-14T12:37:52.818000","699f03093dabc6bf144f9cfd","juarezfloresdamianmartin@gmail.com","false"
"64","170","iPhone 12","","","243100","69de350778a2bbc25f2f9bfd","2026-04-14T12:37:27.470000","2026-04-14T12:38:12.365000","699f03093dabc6bf144f9cfd","juarezfloresdamianmartin@gmail.com","false"
"256","200","iPhone 11 Pro Max","","","286000","69de34faf39fedd4a931b7c6","2026-04-14T12:37:14.017000","2026-04-14T12:37:14.017000","699f03093dabc6bf144f9cfd","juarezfloresdamianmartin@gmail.com","false"
"64","185","iPhone 11 Pro Max","","","264550","69de34e90f9d376d2ec5d41d","2026-04-14T12:36:57.908000","2026-04-14T12:36:57.908000","699f03093dabc6bf144f9cfd","juarezfloresdamianmartin@gmail.com","false"
"256","160","iPhone 11 Pro","","","228800","69de34dd4c4e06efdeee92e0","2026-04-14T12:36:45.015000","2026-04-14T12:36:45.015000","699f03093dabc6bf144f9cfd","juarezfloresdamianmartin@gmail.com","false"
"64","150","iPhone 11 Pro","","","214500","69de34cb9a73534b2749bffd","2026-04-14T12:36:27.853000","2026-04-14T12:36:27.853000","699f03093dabc6bf144f9cfd","juarezfloresdamianmartin@gmail.com","false"
"256","110","iPhone 11","","","157300","69de34c0b979d24db62d6e66","2026-04-14T12:36:16.130000","2026-04-23T12:15:32.263000","699f03093dabc6bf144f9cfd","juarezfloresdamianmartin@gmail.com","false"
"128","100","iPhone 11","","","143000","69de34b118df107bbae47ea4","2026-04-14T12:36:01.220000","2026-04-23T12:15:23.928000","699f03093dabc6bf144f9cfd","juarezfloresdamianmartin@gmail.com","false"
"64","90","iPhone 11","","","128700","69de3492f1ea70a16bc56c70","2026-04-14T12:35:30.576000","2026-04-23T12:15:15.311000","699f03093dabc6bf144f9cfd","juarezfloresdamianmartin@gmail.com","false"`;

async function main() {
    console.log("Starting CSV data load...");
    
    // Parse CSV lines
    const lines = csvData.trim().split("\n");
    const headers = lines[0].split(",");
    
    const records = [];
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // Split handling quotes correctly
        const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
        if (!matches || matches.length < headers.length) {
            // fallback split if regex fails
            const simpleSplit = line.split(",");
            if (simpleSplit.length >= 4) {
                const cap = simpleSplit[0].replace(/"/g, '').trim();
                const price = simpleSplit[1].replace(/"/g, '').trim();
                const model = simpleSplit[2].replace(/"/g, '').trim();
                let batt = simpleSplit[3].replace(/"/g, '').trim();
                if (!batt) batt = "Indistinto";
                records.push({
                    model,
                    capacity_gb: parseInt(cap, 10),
                    battery_range: batt,
                    price_usd: parseFloat(price)
                });
            }
            continue;
        }
        
        const cleanValues = matches.map(v => v.replace(/^"|"$/g, '').trim());
        const cap = cleanValues[0];
        const price = cleanValues[1];
        const model = cleanValues[2];
        let batt = cleanValues[3];
        
        if (!batt) {
            batt = "Indistinto";
        }
        
        records.push({
            model,
            capacity_gb: parseInt(cap, 10),
            battery_range: batt,
            price_usd: parseFloat(price)
        });
    }

    console.log(`Parsed ${records.length} records. Cleaning database...`);
    
    // Clean existing trade-in prices
    await prisma.tradeInPrice.deleteMany();
    
    console.log("Loading new trade-in prices...");
    
    // Create new records
    await prisma.tradeInPrice.createMany({
        data: records
    });
    
    console.log("✅ Seeding of CSV Trade-In prices finished successfully!");
}

main()
    .catch(e => {
        console.error("❌ Error loading CSV data:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
