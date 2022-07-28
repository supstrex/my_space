import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Request,
  UseGuards,
  Put,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('comment')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post(':post_id')
  @ApiCreatedResponse({ description: 'Post successfully commented' })
  @ApiBadRequestResponse({ description: 'Post Id does not match ' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized User.' })
  createComment(
    @Param('post_id') post_id: string,
    @Body() createCommentDto: CreateCommentDto,
    @Request() req: any,
  ): Promise<Object> {
    return this.commentService.postComment(
      post_id,
      req.user.userId,
      createCommentDto,
    );
  }

  @Get(':post_id')
  @ApiOkResponse({ description: 'The comments was found successfully' })
  @ApiBadRequestResponse({ description: 'Comments does not match ' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized User.' })
  findAllComment(@Param('post_id') post_id: string): Promise<Object> {
    return this.commentService.findAllComment(post_id);
  }

  @Put(':post_id/:comment_id')
  @ApiOkResponse({ description: 'Comment successfully updated' })
  @ApiBadRequestResponse({ description: 'Post OR Comment does not exist ' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized User.' })
  updateComment(
    @Param('post_id') post_id: string,
    @Param('comment_id') comment_id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<Object> {
    return this.commentService.updateComment(
      post_id,
      comment_id,
      updateCommentDto,
    );
  }

  @Delete(':post_id/:comment_id')
  @ApiOkResponse({
    description: 'Request for delete comment successfully complete',
  })
  @ApiBadRequestResponse({ description: 'Post OR Comment does not exist ' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized User.' })
  removeComment(
    @Param('post_id') post_id: string,
    @Param('comment_id') comment_id: string,
  ) {
    return this.commentService.removeComment(post_id, comment_id);
  }
}
