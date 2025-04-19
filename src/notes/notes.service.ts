import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './entities/note.entity';
import { plainToInstance } from 'class-transformer';
import { INoteDto, NoteDto } from './dtos/note.dto';
import { ICreateNoteDto } from './dtos/create-note.dto';
import { IUpdateNoteDto } from './dtos/update-note.dto';
import { INoteListDto, NoteListDto } from './dtos/note-list.dto';
import { validate as isUuid } from 'uuid';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private notesRepository: Repository<Note>,
  ) {}

  async getAllNotes(): Promise<INoteListDto> {
    const notes = await this.notesRepository.find();
    const notesDtos: INoteDto[] = plainToInstance(NoteDto, notes);
    return new NoteListDto(notesDtos);
  }

  async getNoteById(id: string): Promise<INoteDto> {
    this.ensureValidUuid(id);
    const noteEntity = await this.notesRepository.findOneBy({ id });
    if (!noteEntity) {
      throw new NotFoundException(`Note with id: '${id}' was not found`);
    }
    return plainToInstance(NoteDto, noteEntity);
  }

  async createNote(createNoteDto: ICreateNoteDto): Promise<INoteDto> {
    const noteEntityCreated = this.notesRepository.create({ ...createNoteDto });
    const noteEntitySaved = await this.notesRepository.save(noteEntityCreated);
    return plainToInstance(NoteDto, noteEntitySaved);
  }

  async updateNote(
    id: string,
    updateNoteDto: IUpdateNoteDto,
  ): Promise<INoteDto> {
    this.ensureValidUuid(id);
    const updateResult = await this.notesRepository.update(id, {
      ...updateNoteDto,
    });
    if (updateResult.affected === 0) {
      throw new NotFoundException(`Note with id: '${id}' was not found`);
    }
    const noteEntity = await this.notesRepository.findOneBy({ id });
    return plainToInstance(NoteDto, noteEntity);
  }

  async deleteNote(id: string): Promise<boolean> {
    this.ensureValidUuid(id);
    const deleteResult = await this.notesRepository.delete(id);
    if (deleteResult.affected === 0) {
      throw new NotFoundException(`Note with id: '${id}' was not found`);
    }
    return true;
  }

  private ensureValidUuid(id: string): void {
    if (!isUuid(id)) {
      throw new NotFoundException(`Id must be uuid, but got: '${id}'`);
    }
  }
}
