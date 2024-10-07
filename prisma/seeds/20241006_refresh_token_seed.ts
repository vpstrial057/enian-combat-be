import { PrismaClient, User } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import * as jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function run(): Promise<void> {
  const users: User[] = await prisma.user.findMany({ take: 5 });

  for (const user of users) {
    const jti: string = uuidv4();
    const refreshToken: string = jwt.sign(
      { sub: user.id, jti },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        jti,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days 
      },
    });
    console.log(`Created refresh token for user: ${user.id}`);
  }
}

async function clearRefreshTokens(): Promise<void> {
  await prisma.refreshToken.deleteMany({});
  console.log('Cleared existing refresh tokens from the database');
}

async function seed(): Promise<void> {
  await clearRefreshTokens();
  await run();
}

seed().catch((error: unknown) => {
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error('Unknown error occurred during seeding');
  }
  process.exit(1);
});
