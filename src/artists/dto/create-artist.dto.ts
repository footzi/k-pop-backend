import { IsString, IsOptional, MaxLength, IsUrl } from 'class-validator';

export class CreateArtistDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  debutDate?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  agency?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}
