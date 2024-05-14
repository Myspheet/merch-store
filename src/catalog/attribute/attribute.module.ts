import { Module } from '@nestjs/common';
import { AttributeService } from './attribute.service';
import { AttributeController } from './attribute.controller';
import { AttributeRepository } from './repository/attribute.repository';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AttributeController],
  providers: [AttributeService, AttributeRepository],
})
export class AttributeModule { }
