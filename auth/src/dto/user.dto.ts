import { Type } from 'class-transformer';
import {
  MinLength,
  IsNotEmpty,
  IsEmail,
  Matches,
  IsString,
} from 'class-validator';

const passwordRegEx =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]).{8,20}$/;

export class SignupDto {
  @IsNotEmpty()
  @MinLength(3, { message: 'Firstname must have at least 3 characters.' })
  username = 'john';

  @IsNotEmpty()
  @IsEmail({}, { message: 'Please provide a valid Email.' })
  email = 'john.doe@example.com';

  @IsNotEmpty()
  @Matches(passwordRegEx, {
    message: `Password must contain a minimum of 8 and a maximum of 20 characters, 
      at least one uppercase letter, 
      one lowercase letter, 
      one number, and 
      one special character`,
  })
  password = 'P@ssw0rd';
}

export class LoginDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}

export class GetUserDto {
  @IsString()
  @IsNotEmpty()
  @Type(() => Number)
  id: number;
}
