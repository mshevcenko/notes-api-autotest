import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { INoteDto } from './dtos/note.dto';
import { INoteListDto } from './dtos/note-list.dto';
import { ICreateNoteDto } from './dtos/create-note.dto';
import { IUpdateNoteDto } from './dtos/update-note.dto';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  async getAllNotes(): Promise<INoteListDto> {
    return this.notesService.getAllNotes();
  }

  @Get(':id')
  async getNoteById(@Param('id') id: string): Promise<INoteDto> {
    return this.notesService.getNoteById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createNote(@Body() createNoteDto: ICreateNoteDto): Promise<INoteDto> {
    return this.notesService.createNote(createNoteDto);
  }

  @Put(':id')
  async updateNote(
    @Param('id') id: string,
    @Body() updateNoteDto: IUpdateNoteDto,
  ): Promise<INoteDto> {
    return this.notesService.updateNote(id, updateNoteDto);
  }

  @Delete(':id')
  async deleteNote(@Param('id') id: string): Promise<{ success: boolean }> {
    const success = await this.notesService.deleteNote(id);
    return { success: success };
  }
}
