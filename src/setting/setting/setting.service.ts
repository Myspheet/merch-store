import { Injectable } from '@nestjs/common';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

@Injectable()
export class SettingService {
  settingModel: Prisma.SettingDelegate<DefaultArgs>;

  constructor(
    private readonly prismaService: PrismaService
  ) {
    this.settingModel = this.prismaService.getModel('setting');
  }

  async create(createSettingDto: CreateSettingDto) {
    return await this.settingModel.create({
      data: {
        ...createSettingDto
      }
    });
  }

  async findOne(id: number) {
    return await this.settingModel.findUnique({
      where: { id }
    });
  }

  async update(id: number, updateSettingDto: UpdateSettingDto) {
    return await this.settingModel.update({
      where: { id },
      data: {
        ...updateSettingDto
      }
    });
  }
}
