import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NestAuthController } from './nest-auth/nest-auth.controller';

@Module({
  imports: [],
  controllers: [AppController, NestAuthController],
  providers: [AppService],
})
export class AppModule {}
