import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT) ?? 3306,
  user: process.env.DB_USER ?? 'root',
  password: process.env.DB_PASSWORD ?? 'password',
  database: process.env.DB_NAME ?? 'stocksense',
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding roles...');

  await prisma.role.upsert({
    where: { name: 'INVENTORY_MANAGER' },
    update: {},
    create: { name: 'INVENTORY_MANAGER' },
  });

  await prisma.role.upsert({
    where: { name: 'WAREHOUSE_STAFF' },
    update: {},
    create: { name: 'WAREHOUSE_STAFF' },
  });

  console.log('Roles seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });