import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('get-session')
export class GetSessionController {
  @Get()
  getCookie(@Req() request: Request): string {
    const cookies = request.headers.cookie; 
    return cookies;
  }
}
