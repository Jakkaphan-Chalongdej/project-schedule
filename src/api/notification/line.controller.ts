import { Controller, Post, Body } from '@nestjs/common';

@Controller('')
export class LineController {
  constructor() {}

  @Post()
  testConnection(@Body() body: any) {
    if (body?.events?.length > 0) {
      const event = body.events[0];
      if (event.type === 'message' && event.message.type === 'text') {
        const userId = event.source.userId;
        console.log(`User ID: ${userId}`);
      }
    }
    return 'ok';
  }
}
