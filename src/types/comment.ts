// Comment 관련 타입

import { UserEntity } from './user';

export interface CommentEntity {
  id: number;
  attributes: {
    content: string;
    createdAt: string;
    updatedAt: string;
    author: {
      data: UserEntity;
    };
  };
}
