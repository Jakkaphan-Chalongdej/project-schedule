import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { HttpModule } from '@nestjs/axios';
import { LineController } from './line.controller';
@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [LineController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
