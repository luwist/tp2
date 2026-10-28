import {
  IsDate,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxDate,
  MaxLength,
} from 'class-validator';
import { Role } from '../../common/enums/role.enum.js';
import { Transform, Type } from 'class-transformer';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  lastName: string;

  @IsEmail({}, { message: 'Email is not valid' })
  email: string;

  @Matches(/^[a-zA-Z0-9_.]{3,20}$/, {
    message: 'Username must be 3-20 characters: letters, numbers, "_" or "."',
  })
  username: string;

  password: string;

  @IsString()
  confirmPassword: string;

  @Transform(({ value }) => {
    if (!value) return value;

    if (typeof value === 'string' && value.includes('/')) {
      const parts = value.split('/');

      if (parts.length === 3) {
        const month = parseInt(parts[0], 10) - 1;
        const day = parseInt(parts[1], 10);
        const year = parseInt(parts[2], 10);
        return new Date(year, month, day);
      }
    }

    return new Date(value);
  })
  @IsDate({ message: 'Birth date must be a valid date' })
  @MaxDate(new Date(), { message: 'Birth date cannot be in the future' })
  birthDate: Date;

  @IsString()
  @MaxLength(200)
  bio: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
