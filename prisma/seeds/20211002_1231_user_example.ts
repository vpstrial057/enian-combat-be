import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

export async function run(): Promise<void> {
  await prisma.user.createMany({ data: generateUsers(5) });
}

function generateUsers(count: number): Array<{
  telegramId: string;
  tonAddress: string;
  evmAddress: string;
  gold: number;
  createdBy: string;
  updatedBy: string;
}> {
  const users = [];

  for (let index = 0; index < count; index++) {
    if (index === 0) {
      users.push({
        id: '3136aa1a-fec8-11de-a55f-00003925d394',
        telegramId: 'test-telegram-id',
        tonAddress: 'test-ton-wallet',
        evmAddress: 'test-evm-address',
        gold: 100,
        createdBy: 'Seeder',
        updatedBy: 'Seeder',
      });
    } else {
      users.push({
        telegramId: faker.string.numeric(10),
        tonAddress: faker.string.hexadecimal({
          length: 16,
          prefix: 'TON',
          casing: 'upper',
        }),
        evmAddress: faker.string.hexadecimal({ length: 16, prefix: '0x' }),
        gold: Math.floor(Math.random() * 1000),
        createdBy: 'Seeder',
        updatedBy: 'Seeder',
      });
    }
  }

  return users;
}
