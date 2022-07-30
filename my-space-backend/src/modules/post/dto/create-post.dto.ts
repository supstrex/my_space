import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  image: any;

  @ApiProperty()
  title: string;

  @ApiProperty()
  desc: string;
}
