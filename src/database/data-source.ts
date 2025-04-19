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
  entities: ['dist/**/*.entity{.js,.ts}'],
  migrations: ['dist/migrations/**/*.js'],
  migrationsTableName: 'migrations',
  migrationsRun: true,
});
