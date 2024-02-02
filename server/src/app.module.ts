import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WsModule } from './ws/ws.module';
import { PrismaModule } from './prisma/prisma.module';
import { RoomModule } from './room/room.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [WsModule, PrismaModule, RoomModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
