import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ShiftsModule } from './shifts/shifts.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [UsersModule, ShiftsModule, NotificationModule],
})
export class ApiModule {}
