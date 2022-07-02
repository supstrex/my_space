import { LikesService } from './likes.service';
import { AuthGuard } from '@nestjs/passport';
import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('likes')
@Controller('likes')
export class LikesController {
  constructor(private likesService: LikesService) {}

  @Get(':post_id')
  @ApiOkResponse({
    description: 'Requested Posts likes successfully are found',
  })
  @ApiBadRequestResponse({ description: 'Requested Posts likes are not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized User.' })
  async getCurrentPostLikes(@Param('post_id') post_id: string) {
    return this.likesService.getCurrentPostLikes(post_id);
  }

  @Post(':post_id')
  @ApiCreatedResponse({
    description: 'Requested Posts likes successfully liked',
  })
  @ApiBadRequestResponse({ description: 'Requested Posts is not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized User.' })
  async postCurrentPostLikes(
    @Param('post_id') post_id: string,
    @Request() req: any,
  ) {
    return this.likesService.postCurrentPostLikes(req.user, post_id);
  }

  @Delete(':post_id')
  @ApiOkResponse({ description: 'Requested Posts like successfully deleted' })
  @ApiBadRequestResponse({ description: 'Requested like is not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized User.' })
  async deleteCurrentPostLikes(
    @Param('post_id') post_id: string,
    @Request() req: any,
  ) {
    return this.likesService.deleteCurrentPostLikes(req.user, post_id);
  }
}
