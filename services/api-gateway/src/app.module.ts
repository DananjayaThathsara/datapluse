import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from './auth/auth.module';
import { ProxyModule } from './proxy/proxy.module';
import { WebhookModule } from './webhook/webhook.module';
import { User } from './auth/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (c: ConfigService) => ({
        type: 'postgres',
        host: c.get('DB_HOST', 'localhost'),
        port: c.get<number>('DB_PORT', 5432),
        username: c.get('DB_USERNAME', 'postgres'),
        password: c.get('DB_PASSWORD', 'postgres'),
        database: c.get('DB_NAME', 'datapulse'),
        entities: [User],
        synchronize: true,
      }),
    }),
    HttpModule,
    AuthModule,
    ProxyModule,
    WebhookModule,
  ],
})
export class AppModule {}
