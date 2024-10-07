import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export async function run(): Promise<void> {
    await prisma.mission.createMany({
        data: [
            {
                type: 'RECURSIVE',
                title: 'Daily Login',
                cooldown: 24 * 60 * 60,
                gold: 100,
                createdBy: 'Seeder',
                updatedBy: 'Seeder'
            },
            {
                type: 'RECURSIVE',
                title: 'Spin Roulette',
                cooldown: 8 * 60 * 60,
                gold: 500,
                createdBy: 'Seeder',
                updatedBy: 'Seeder'
            },
            {
                type: 'RECURSIVE',
                title: 'Subscribe Telegram Channel',
                cooldown: 24 * 60 * 60,
                gold: 100,
                socialTask: 'REQUIRED',
                createdBy: 'Seeder',
                updatedBy: 'Seeder'
            },
            {
                type: 'ONE_TIME',
                title: 'Follow Twitter',
                cooldown: 24 * 60 * 60,
                gold: 100,
                socialTask: "NORMAL",
                createdBy: 'Seeder',
                updatedBy: 'Seeder'
            },
        ]
    })
}

export async function clearMissions(): Promise<void> {
    await prisma.mission.deleteMany()
}

async function seed(): Promise<void> {
    await clearMissions()
    await run()
}

seed().catch((error: unknown) => {
    if (error instanceof Error) {
        console.error(error.message);
    } else {
        console.error('Unknown error occurred during seeding');
    }
    process.exit(1);
});