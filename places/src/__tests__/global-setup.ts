import { Database } from "@/lib/db/Database";
import { Resource } from "sst";

export const testTableName = Resource.DynamoTestTable.name;

function validateEnvironment() {
    if (Resource.App.stage === "production" || process.env.NODE_ENV !== "test") {
        throw Error("ERROR: You are trying to run tests in a non test environment!")
    }
    if (!testTableName.toLowerCase().includes("test")) {
        throw Error("ERROR: Test db does not include TEST in its name! Be very careful since tests delete entries!")
    }
}
validateEnvironment()

export async function setup() {
    console.log("Running tests with Vitest. ENV=", process.env.NODE_ENV)
}

export async function teardown() {
    Database.instantiate({ tableName: testTableName });
    const db = Database.getInstance();

    console.log("Deleting all items from table: ", testTableName)
    await db?.deleteAllItems();

    Database.reset();
}