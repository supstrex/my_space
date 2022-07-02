import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @Length(2, 50)
  firstname: string;

  @IsNotEmpty()
  @Length(2, 50)
  lastname: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(8, 16)
  @Matches(/((?=.*\W+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]))/, {
    message: 'password not valid',
  })
  password: string;

  // @IsNotEmpty()
  // @Length(8,16)
  // @Matches(/((?=.*\W+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]))/, {message: 'Confirm password not valid'})
  // passwordConfirm: string;
}
