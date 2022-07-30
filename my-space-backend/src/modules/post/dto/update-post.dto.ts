import { ApiProperty } from '@nestjs/swagger';

export class UpdatePostDto {
  @ApiProperty({ required: false })
  title: string;

  @ApiProperty({ required: false })
  desc: string;
}
