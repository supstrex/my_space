import {
  Controller,
  Sse,
  Request,
  UseGuards,
  Get,
  Param,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { interval, map, Observable } from 'rxjs';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Notif } from './notification.schema';

interface NotificationEvent {
  notification: string | object;
}

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('notification')
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Sse('subscribe')
  @ApiOkResponse({ description: 'Notification service is working' })
  async sendNotification(
    @Request() req,
  ): Promise<Observable<NotificationEvent>> {
    return interval(2000).pipe(
      map(() => ({
        notification: this.notificationService.sendNewNotifications(
          req.user.userId,
        ),
      })),
    );
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Notification has been read' })
  @ApiBadRequestResponse({ description: 'Notification Id is not correct' })
  async readNotification(@Param('id') id: string) {
    return this.notificationService.readNotification(id);
  }

  @Get()
  @ApiOkResponse({ description: 'All notifications have been sent' })
  async sendAllNotifications(@Request() req): Promise<Notif[]> {
    return this.notificationService.sendAllNotifications(req.user.userId);
  }
}
