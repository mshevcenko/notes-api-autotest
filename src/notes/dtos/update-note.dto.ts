import { IsOptional, IsString } from 'class-validator';

export interface IUpdateNoteDto {
  title?: string;
  content?: string;
}

export class UpdateNoteDto implements IUpdateNoteDto {
  constructor(title?: string, content?: string) {
    this.title = title;
    this.content = content;
  }

  @IsString()
  @IsOptional()
  readonly content?: string;

  @IsString()
  @IsOptional()
  readonly title?: string;
}
