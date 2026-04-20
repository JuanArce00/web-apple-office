// @ts-nocheck
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const passwordHash = await bcrypt.hash('AppleOfficeFederico2026!', 10);
    const user = await prisma.user.upsert({
        where: { username: 'FedeOieni' },
        update: { password: passwordHash },
        create: { username: 'FedeOieni', password: passwordHash },
    });
    console.log('User seeded:', user.username);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
