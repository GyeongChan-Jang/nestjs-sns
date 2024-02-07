import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class PostsModel {
  // 자동으로 생성되는 id 필드를 정의
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  author: string;
  @Column()
  title: string;
  @Column()
  content: string;
  @Column()
  likeCount: number;
  @Column()
  commentCount: number;
}
