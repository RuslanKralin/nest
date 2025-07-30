import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
  async createPost(dto: CreatePostDto) {}
}
