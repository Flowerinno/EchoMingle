import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import axios from 'axios';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  healthCheck() {
    return { message: 'OK' };
  }

  @Get('ice')
  async generateIceServers() {
    try {
      const { data } = await axios.get(
        `https://echomingle.metered.live/api/v1/turn/credentials?apiKey=${process.env.METERED_API_KEY}`,
      );
      return data;
    } catch (error) {
      
    }
  }
}
