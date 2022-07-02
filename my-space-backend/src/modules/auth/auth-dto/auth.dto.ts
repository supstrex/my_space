import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty({ type: 'Email', required: true })
  email: string;

  @ApiProperty({ type: 'Password', required: true })
  password: string;
}
