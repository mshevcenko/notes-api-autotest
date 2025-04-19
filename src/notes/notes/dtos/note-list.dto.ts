import { INoteDto } from './note.dto';

export interface INoteListDto {
  items: INoteDto[];
}

export class NoteListDto implements INoteListDto {
  constructor(items: INoteDto[]) {
    this.items = items;
  }

  readonly items: INoteDto[];
}
