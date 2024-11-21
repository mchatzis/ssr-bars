import { Resource } from "sst";
import { Database } from "./db/Database";

const db = Database.instantiate({ tableName: Resource.DynamoTable.name });