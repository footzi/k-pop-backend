import { IsEmail } from 'class-validator';

export class StartLoginDto {
  @IsEmail({}, { message: 'Некорректный формат email' })
  email: string;
}
