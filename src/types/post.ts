// Post 관련 타입

import { UserEntity } from './user';
import { CommentEntity } from './comment';
import { Media } from './media';

export interface PostEntity {
  id: number;
  attributes: {
    caption: string;
    image: Media;
    author: {
      data: UserEntity;
    };
    likes: {
      data: UserEntity[];
    };
    comments: {
      data: CommentEntity[];
    };
    createdAt: string;
    updatedAt: string;
    publishedAt?: string;
  };
}
