import { Module, Global } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoClient } from 'mongodb';

import config from 'src/config';
const API_KEY = '12345634';
const API_KEY_PROD = 'PROD1212121SA';

@Global()
@Module({
  imports: [
    // MongooseModule.forRoot(
    //   'mongoURI',
    // ),
    //*Ahora vamos a lanzar mongoose de forma asincrona para pasarle variables de entorno
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigType<typeof config>) => {
        const { dbName, dbUri } = configService.mongo;
        return {
          uri: dbUri,
          dbName,
        };
      },
      //Inyectamos dependencias
      inject: [config.KEY],
    }),
  ],
  providers: [
    {
      provide: 'API_KEY',
      useValue: process.env.NODE_ENV === 'prod' ? API_KEY_PROD : API_KEY,
    },
    {
      provide: 'MONGO',
      useFactory: async (configService: ConfigType<typeof config>) => {
        const { dbName, dbUri } = configService.mongo;
        const client = new MongoClient(dbUri, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        await client.connect();
        const database = client.db(dbName);
        return database;
      },
      //Inyectamos dependencias
      inject: [config.KEY],
    },
  ],
  exports: ['API_KEY', 'MONGO', MongooseModule],
})
export class DatabaseModule {}
