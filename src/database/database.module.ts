import { Module, Global } from '@nestjs/common';
import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config(); //solo usaremos dotenv temporalmente hasta resolver el tema de variables de entorno con nest
const API_KEY = '12345634';
const API_KEY_PROD = 'PROD1212121SA';

const { DATABASE_URI, DATABASE_NAME } = process.env;
/* const uri =
  'mongodb://root:root@localhost:27017/?authSource=admin&readPreference=primary';

const client = new MongoClient(uri);
async function run() {
  await client.connect();
  const database = client.db('platzi-store');
  const taskCollection = database.collection('tasks');
  const tasks = await taskCollection.find().toArray();
  console.log(tasks);
}
run();
 */
@Global()
@Module({
  providers: [
    {
      provide: 'API_KEY',
      useValue: process.env.NODE_ENV === 'prod' ? API_KEY_PROD : API_KEY,
    },
    {
      provide: 'MONGO',
      useFactory: async () => {
        const uri = DATABASE_URI
          ? DATABASE_URI
          : 'mongodb://root:root@localhost:27017/?authSource=admin&readPreference=primary';

        const client = new MongoClient(uri);
        await client.connect();
        const database = client.db(
          DATABASE_NAME ? DATABASE_NAME : 'platzi-store',
        );
        return database;
      },
    },
  ],
  exports: ['API_KEY', 'MONGO'],
})
export class DatabaseModule {}
