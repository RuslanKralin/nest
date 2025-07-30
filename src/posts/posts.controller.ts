import { Body, Controller } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private PostService: PostsService) {}
  createPost(@Body() dto: CreatePostDto) {
    this.PostService.createPost(dto);
  }

  getAllPosts() {}

  getPost() {}

  deletePost() {}
}
