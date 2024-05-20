import { Module } from '@nestjs/common';
import { NotificationModule } from './notification/notification.module';
import { SettingModule as SystemSettings } from './setting/setting.module';

@Module({
  imports: [NotificationModule, SystemSettings]
})
export class SettingModule { }
