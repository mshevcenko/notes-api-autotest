import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: +process.env.DB_PORT || 5432,
  username: process.env.DB_USERNAME || 'user',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'notes',
  entities: ['dist/**/*.entity{.js,.ts}', 'src/**/*.entity.ts'],
  migrations: ['dist/migrations/**/*.js', 'src/migrations/**/*.ts'],
  migrationsTableName: 'migrations',
  migrationsRun: true,
});
