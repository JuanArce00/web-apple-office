const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function diagnose() {
  console.log("--- DIAGNÓSTICO DE BASE DE DATOS ---");
  try {
    const userCount = await prisma.user.count();
    console.log("✅ Tabla 'users' accesible. Cantidad:", userCount);
    
    const configCount = await prisma.config.count();
    console.log("✅ Tabla 'config' accesible. Cantidad:", configCount);
    
    const modelCount = await prisma.baseModel.count();
    console.log("✅ Tabla 'baseModel' accesible. Cantidad:", modelCount);

    console.log("--- TODO PARECE OK EN PRISMA ---");
    process.exit(0);
  } catch (e) {
    console.error("❌ ERROR CRÍTICO EN DB:");
    console.error(e.message);
    process.exit(1);
  }
}

diagnose();
