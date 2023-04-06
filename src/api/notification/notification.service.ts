import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as line from '@line/bot-sdk';

@Injectable()
export class NotificationService {
  private client: line.Client;
  constructor(private readonly httpService: HttpService) {
    const config = {
      channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
      channelSecret: process.env.LINE_CHANNEL_SECRET,
    };
    this.client = new line.Client(config);
  }
  getClient(): line.Client {
    return this.client;
  }

  async send(userId: string) {
    const flexMessage = {
      type: 'bubble',
      hero: {
        type: 'image',
        url: 'https://images.pexels.com/photos/4239031/pexels-photo-4239031.jpeg?auto=compress&cs=tinysrgb&w=1600',
        size: 'full',
        aspectRatio: '20:13',
        aspectMode: 'cover',
      },
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: 'อย่าลืมทำเวรด้วยนะ',
            size: 'xl',
            weight: 'bold',
          },
        ],
      },
    };

    const message: any = {
      type: 'flex',
      altText: 'วันนี้อย่าลืมทำเวรด้วยนะ',
      contents: flexMessage,
    };
    this.getClient().pushMessage(userId, message);
  }
}
