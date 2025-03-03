import { Database } from "@/server/db/database";
import { loadEnvConfig } from '@next/env';

export default async () => {
    const projectDir = process.cwd()
    loadEnvConfig(projectDir)
}

export async function setup() {
    console.log("Setting up tests...")
}

export async function teardown() {
    const db = Database.getInstance();
    const testTableName = db.getTableName();

    if (!testTableName.toLowerCase().includes("test")) {
        throw new Error("Database test table might be not be a test table!")
    }

    console.log(`Deleting all items from ${testTableName} after testing...`);

    await db.deleteAllItems();

    Database.reset();
}