import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }), UserModule, AuthModule, PrismaModule, CategoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
