import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { UsersEntity } from 'src/database/entities/users.entity';
import { ShiftsEntity } from 'src/database/entities/shifts.entity';
config();

export default () =>
  ({
    type: process.env.DB_DIALECT || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_DATABASE || 'schedule',
    logging: process.env.DB_LOGGING === 'true',
    entities: [UsersEntity, ShiftsEntity],
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    autoLoadEntities: true,
  } as TypeOrmModuleOptions);
