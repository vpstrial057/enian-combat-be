import path from 'path';
import fs from 'fs';

const file: string | undefined = process.env.npm_config_file;

async function runSingleFile(): Promise<void> {
  if (!file) {
    throw new Error('No file specified');
  }

  try {
    const seed = require(`./seeds/${file}`);
    console.log(`[seeder] started running seed from ${file}`);
    
    if (typeof seed.run === 'function') {
      await seed.run();
      console.log(`[seeder] successfully ran seed from ${file}`);
    } else {
      throw new Error(`seed.run is not a function in ${file}`);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(`[seeder] error while running seed from ${file}: ${error.message}`);
    } else {
      console.log(`[seeder] unknown error while running seed from ${file}`);
    }
    throw error;
  }
}

async function runAll(): Promise<void> {
  const directoryPath: string = path.join(__dirname, 'seeds');
  
  fs.readdir(directoryPath, async (err: NodeJS.ErrnoException | null, files: string[]): Promise<void> => {
    if (err) {
      console.log('Unable to scan directory: ' + err.message);
      return;
    }

    for (const file of files) {
      console.log(`[seeder] started running seed from ${file}`);
      try {
        const seed = require(`./seeds/${file}`);
        if (typeof seed.run === 'function') {
          await seed.run();
          console.log(`[seeder] successfully ran seed from ${file}`);
        } else {
          throw new Error(`seed.run is not a function in ${file}`);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.log(`[seeder] error while running seed from ${file}: ${error.message}`);
        } else {
          console.log(`[seeder] unknown error while running seed from ${file}`);
        }
        throw error;
      }
    }
  });
}

if (file) {
  runSingleFile().catch((error: unknown) => {
    if (error instanceof Error) {
      console.error(`Error occurred: ${error.message}`);
    } else {
      console.error('Unknown error occurred');
    }
    process.exit(1);
  });
} else {
  runAll().catch((error: unknown) => {
    if (error instanceof Error) {
      console.error(`Error occurred: ${error.message}`);
    } else {
      console.error('Unknown error occurred');
    }
    process.exit(1);
  });
}
