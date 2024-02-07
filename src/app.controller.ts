import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

interface Post {
  author: string
  title: string
  content: string
  likeCount: number
  commentCount: number
}
@Controller('post') // 접두어
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return ''
  }
}
