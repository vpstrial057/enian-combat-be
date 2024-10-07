import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function run(): Promise<void> {
  const users = generateUsers(10);
  
  for (const user of users) {
    try {
      await prisma.user.create({ data: user });
      console.log(`Created user with wallet address: ${user.walletAddress}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Failed to create user with wallet address: ${user.walletAddress}, Error: ${error.message}`);
      } else {
        console.error(`Failed to create user with wallet address: ${user.walletAddress}, Unknown error occurred`);
      }
    }
  }
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
      walletAddress: `0x${timestamp}${index}`,
      telegramId: `telegram${index}`,
      tonWallet: `ton${timestamp}${index}`,
      evmAddress: `evm${timestamp}${index}`,
      gold: Math.floor(Math.random() * 1000),
      createdBy: 'Seeder',
      updatedBy: 'Seeder',
    });
  }
  
  return users;
}
