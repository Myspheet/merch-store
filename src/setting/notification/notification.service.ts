import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

@Injectable()
export class NotificationService {
  adminId = 1;
  notificationModel: Prisma.NotificationDelegate<DefaultArgs>;

  constructor(
    private readonly prismaService: PrismaService
  ) {
    this.notificationModel = this.prismaService.getModel('notification');
  }

  async create(createNotificationDto: CreateNotificationDto) {
    return await this.notificationModel.create({
      data: {
        ...createNotificationDto,
        adminId: this.adminId
      }
    });
  }

  async findOne(id: number, adminId: number) {
    return await this.notificationModel.findUnique({
      where: { adminId, id }
    });
  }

  async update(id: number, updateNotificationDto: UpdateNotificationDto, adminId: number) {
    return await this.notificationModel.update({
      where: { id, adminId },
      data: {
        ...updateNotificationDto
      }
    });
  }
}
