import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SharedModule } from './shared/shared.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UserModule } from './app/user/user.module';
import { MissionController } from './app/mission/mission.controller';
import { MissionModule } from './app/mission/mission.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'swagger-static'),
      serveRoot: process.env.NODE_ENV === 'development' ? '/' : '/api-docs',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION') || '2h',
        },
      }),
      inject: [ConfigService],
      global: true,
    }),
    SharedModule,
    AuthModule,
    UserModule,
    MissionModule,
  ],
  controllers: [AppController, MissionController],
  providers: [AppService],
})
export class AppModule {}
