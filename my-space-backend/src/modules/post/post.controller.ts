import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Post as PostInterface } from './interface/post.interface';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('posts')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: 'images',
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Image Title and Description',
    type: CreatePostDto,
  })
  @ApiCreatedResponse({
    description: 'Your request of post is successfully done.',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized User.' })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() createPostDto: CreatePostDto,
    @Request() req,
  ): Promise<Express.Multer.File | unknown> {
    try {
      const newPost = await this.postService.createPost(
        file,
        req.user.userId,
        createPostDto,
      );
      return newPost;
    } catch (error) {
      throw new HttpException(error, HttpStatus.FORBIDDEN);
    }
  }

  @Get()
  @ApiOkResponse({ description: 'You have successfully received the Posts.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized User.' })
  async getAllPosts(): Promise<PostInterface[]> {
    return await this.postService.getPosts();
  }

  @Get(':id')
  @ApiOkResponse({ description: 'You have successfully received the post.' })
  @ApiBadRequestResponse({ description: 'The post does not exist.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized User.' })
  async getPost(@Param('id') postId: string): Promise<PostInterface> {
    return await this.postService.getPostById(postId);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Post successfully deleted.' })
  @ApiBadRequestResponse({ description: 'The post does not exist.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized User.' })
  async remove(@Param('id') postId: string): Promise<void> {
    this.postService.remove(postId);
  }

  @Put(':id')
  @ApiBody({
    description: 'Update Title and Description',
    type: UpdatePostDto,
  })
  @ApiCreatedResponse({ description: 'Post successfully updated.' })
  @ApiBadRequestResponse({ description: 'The post does not exist.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized User.' })
  async update(
    @Param('id') postId: string,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<PostInterface> {
    return this.postService.update(postId, updatePostDto);
  }
}
