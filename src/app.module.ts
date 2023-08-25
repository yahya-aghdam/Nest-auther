import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GetSessionController } from './get-session/get-session.controller';
import { SaveSessionController } from './save-session/save-session.controller';

@Module({
  imports: [],
  controllers: [AppController, GetSessionController, SaveSessionController],
  providers: [AppService],
})
export class AppModule {}
