import {Body, Controller, Delete, Get, NotFoundException, Param, Post, Put} from "@nestjs/common";
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
  getPost(@Param("id") id: string) {
    return this.postsService.getPostById(+id);
  }

  // 메서드 이름 + path
  @Post()
  postPosts(
    @Body("authorId") authorId: number,
    @Body("title") title: string,
    @Body("content") content: string
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
