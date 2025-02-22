import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();

const configService = new ConfigService();
const dataSourceOptions: DataSourceOptions = {
    host: configService.get('DB_HOST'),
    type: 'mysql',
    port: Number(configService.get('DB_PORT')),
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_NAME'),
    logging: true,
    entities: [
      __dirname + '/../**/*.model.{ts,js}', // 🔹 Asegura que está bien configurado
  ],
  migrations: [
      __dirname + '/migrations/*.{ts,js}', // 🔹 Asegura que TypeORM ve las migraciones
  ],
    migrationsRun: false,
    synchronize: false,
    migrationsTableName: 'migrations',
  };
  
  const dataSource = new DataSource(dataSourceOptions);
  export default dataSource;