import { IsNotEmpty, IsString } from 'class-validator';

export interface INoteDto {
  id: string;
  title: string;
  content: string;
}

export class NoteDto implements INoteDto {
  constructor(id: string, title: string, content: string) {
    this.id = id;
    this.title = title;
    this.content = content;
  }

  @IsString()
  @IsNotEmpty()
  readonly id: string;

  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsString()
  @IsNotEmpty()
  readonly content: string;
}
