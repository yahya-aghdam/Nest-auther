import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NestAutherController } from './nest-auther/nest-auth.controller';

@Module({
  imports: [],
  controllers: [AppController, NestAutherController],
  providers: [AppService],
})
export class AppModule {}
