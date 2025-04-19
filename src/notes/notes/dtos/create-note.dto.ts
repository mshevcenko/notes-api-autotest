import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { INoteDto } from './note.dto';

export interface ICreateNoteDto {
  title: string;
  content?: string;
}

export class CreateNoteDto implements ICreateNoteDto {
  constructor(title: string, content?: string) {
    this.title = title;
    this.content = content;
  }

  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsString()
  @IsOptional()
  readonly content?: string;
}
