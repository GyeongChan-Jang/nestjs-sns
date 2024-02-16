import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {PostsModel} from "./entities/posts.entity";

export interface PostModel {
  id: number;
  author: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
}

let posts: PostModel[] = [
  {
    id: 1,
    author: "minji",
    title: "",
    likeCount: 1,
    content: "",
    commentCount: 1,
  },
  {
    id: 2,
    author: "rose",
    title: "",
    likeCount: 1,
    content: "",
    commentCount: 1,
  },
  {
    id: 3,
    author: "hany",
    title: "",
    likeCount: 1,
    content: "",
    commentCount: 1,
  },
];

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsModel)
    private readonly postsRepository: Repository<PostsModel>,
  ) {
  }

  async getAllPosts() {
    return this.postsRepository.find();
  }

  async getPostById(id: number) {
    const post = await this.postsRepository.findOne({
      where: {
        id
      }
    });
    if (!post) {
      throw new NotFoundException();
    }
    return post;
  }

  async createPost(authorId: number, title: string, content: string) {
    const post = this.postsRepository.create({
      author: {
        id: authorId
      },
      title,
      content,
      likeCount: 0,
      commentCount: 0
    });

    // id가 자동으로 생성되어 반환됨
    return await this.postsRepository.save(post);
  }

  async updatePost(postId: number, title: string, content: string) {
    // save 기능
    // 1. 만약에 데이터가 존재하지 않느다면 (id 기준으로) 새로 생성한다.
    // 2. 만약에 데이터가 존재한다면 (id 기준으로) 업데이트한다.
    const post = await this.postsRepository.findOne({
      where: {
        id: postId
      }
    });

    if (!post) {
      throw new NotFoundException();
    }

    if (title) post.title = title;

    if (content) post.content = content;

    return await this.postsRepository.save(post);
  }

  async deletePost(postId: number) {
    const post = this.postsRepository.findOne({
      where: {
        id: postId
      }
    });

    if (!post) {
      throw new NotFoundException();
    }

    await this.postsRepository.delete(postId);
    return postId;
  }
}
