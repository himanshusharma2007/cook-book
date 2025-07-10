import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsEmail({}, { message: 'Enter a valid email address' })
  email: string;

  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;
}
