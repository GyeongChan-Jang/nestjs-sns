import { Module } from "@nestjs/common";
import { PostsService } from "./posts.service";
import { PostsController } from "./posts.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostsModel } from "./entities/posts.entity";

@Module({
  imports: [
    // forRoot: 타입 ORM 연결 설정
    // forFeature: 모델에 해당되는 레포지토리 설정
    TypeOrmModule.forFeature([PostsModel]),
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
