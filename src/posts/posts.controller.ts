import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put
} from "@nestjs/common";
import {PostModel, PostsService} from "./posts.service";

@Controller("posts")
export class PostsController {
  constructor(private readonly postsService: PostsService) {
  }

  @Get()
  getPosts() {
    return this.postsService.getAllPosts();
  }

  @Get(":id")
  getPost(@Param("id", ParseIntPipe) id: number) {
    return this.postsService.getPostById(id);
  }

  // 메서드 이름 + path
  @Post()
  postPosts(
    @Body("authorId") authorId: number,
    @Body("title") title: string,
    @Body("content") content: string,
    // new 생성자를 사용하면 호출시마다 생성됨: 파이프 클래스를 사용하는 것은 nest IOC 에서 주입해줌
    @Body('isPublic', new DefaultValuePipe(true)) isPublic: boolean
  ) {
    return this.postsService.createPost(authorId, title, content);
  }

  @Put(":id")
  putPost(
    @Param("id") id: string,
    @Body("title") title?: string,
    @Body("content") content?: string
  ) {
    return this.postsService.updatePost(+id, title, content);
  }

  @Delete(":id")
  deletePost(
    @Param("id") id: string
  ) {
    return this.postsService.deletePost(+id);
  }
}
