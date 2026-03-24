import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './events/event.entity';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [
    // Loads .env file — isGlobal means available in every module
    ConfigModule.forRoot({ isGlobal: true }),

    // Connects to PostgreSQL using .env values
    // synchronize: true — auto-creates/updates tables from entities
    // ONLY use in development — use migrations in production
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST', 'localhost'),
        port: config.get('DB_PORT', 5432),
        username: config.get('DB_USERNAME', 'postgres'),
        password: config.get('DB_PASSWORD', 'postgres'),
        database: config.get('DB_NAME', 'datapulse'),
        entities: [Event],
        synchronize: true,
      }),
    }),
    EventsModule,
    KafkaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
