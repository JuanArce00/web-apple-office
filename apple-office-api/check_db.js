const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    const stock = await prisma.iphoneStock.findMany();
    console.log("✅ Conexión con DB OK. Cantidad de iPhones en stock:", stock.length);
    process.exit(0);
  } catch (e) {
    console.error("❌ ERROR conectando con la DB:", e.message);
    process.exit(1);
  }
}

check();
