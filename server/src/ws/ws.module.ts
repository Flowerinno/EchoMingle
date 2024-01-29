import { Module } from '@nestjs/common';
import { WsService } from './ws.service';
import { WsGateway } from './ws.gateway';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [WsGateway, WsService, PrismaService],
})
export class WsModule {}
