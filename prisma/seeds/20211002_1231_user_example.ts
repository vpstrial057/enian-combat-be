import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient();

export async function run(): Promise<void> {
  await prisma.user.createMany({ data: generateUsers(5) });
}

function generateUsers(count: number): Array<{
  walletAddress: string;
  telegramId: string;
  tonWallet: string;
  evmAddress: string;
  gold: number;
  createdBy: string;
  updatedBy: string;
}> {
  const users = [];

  for (let index = 0; index < count; index++) {
    const timestamp = Date.now();
    users.push({
      walletAddress: faker.string.hexadecimal({ length: 16, prefix: '0x' }),
      telegramId: faker.string.numeric(10),
      tonWallet: faker.string.hexadecimal({ length: 16, prefix: 'TON', casing: 'upper' }),
      evmAddress: faker.string.hexadecimal({ length: 16, prefix: '0x' }),
      gold: Math.floor(Math.random() * 1000),
      createdBy: 'Seeder',
      updatedBy: 'Seeder',
    });
  }

  return users;
}