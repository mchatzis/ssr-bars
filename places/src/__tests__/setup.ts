import { Database } from '@/lib/db/Database';
import { testTableName } from './global-setup';

Database.instantiate({ tableName: testTableName });