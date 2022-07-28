import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';
export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @Length(0, 50)
  firstname: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(0, 50)
  lastname: string;

  @ApiProperty({ type: 'Email' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ type: 'Password' })
  @IsNotEmpty()
  @Length(8, 16)
  @Matches(/((?=.*\W+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]))/, {
    message: 'password not valid',
  })
  password: string;

  @ApiProperty({ type: 'Password' })
  @IsNotEmpty()
  @Length(8, 16)
  @Matches(/((?=.*\W+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]))/, {
    message: 'Confirm password not valid',
  })
  passwordConfirm: string;
}
