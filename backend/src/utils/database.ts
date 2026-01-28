import fs from 'fs';
import path from 'path';

const DATA_FILE = process.env.DATABASE_URL || './data/barbearia.json';

interface Database {
  users: any[];
  barbershops: any[];
  services: any[];
  appointments: any[];
  availability: any[];
}

let db: Database | null = null;

function ensureDataDir() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export async function getDatabase(): Promise<Database> {
  if (db) {
    return db;
  }

  ensureDataDir();

  if (fs.existsSync(DATA_FILE)) {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    db = JSON.parse(data);
  } else {
    db = {
      users: [],
      barbershops: [],
      services: [],
      appointments: [],
      availability: []
    };
  }

  return db as Database;
}

export async function saveDatabase(): Promise<void> {
  if (!db) return;
  ensureDataDir();
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
}

export async function initializeDatabase(): Promise<void> {
  const database = await getDatabase();
  await saveDatabase();
  console.log('Database initialized');
}
