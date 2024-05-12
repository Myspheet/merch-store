import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local/local.strategy';
import { AuthController } from './auth.controller';
import { HashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt/bcrypt.service';
import { GoogleGuard } from './strategy/google/google.guard';
import { GoogleStrategy } from './strategy/google/google.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategy/jwt/jwt.strategy';
import jwtConfig from './config/jwt.config';
import { RefreshTokenRepository } from './repository/refreshToken.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AdminRepository } from './repository/admin.repository';
import { AdminJwtStrategy } from './strategy/jwt/admin-jwt.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    PrismaModule
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    {
      provide: HashingService,
      useClass: BcryptService
    },
    GoogleGuard,
    GoogleStrategy,
    RefreshTokenRepository,
    AdminRepository,
    AdminJwtStrategy
  ],
  controllers: [AuthController]
})
export class AuthModule { }
