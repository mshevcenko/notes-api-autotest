import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { NotesService } from './notes.service';
import { Note } from './entities/note.entity';
import { ICreateNoteDto } from './dtos/create-note.dto';
import { IUpdateNoteDto } from './dtos/update-note.dto';
import { INoteDto } from './dtos/note.dto';
import { INoteListDto } from './dtos/note-list.dto';

describe('NotesService', () => {
  let notesService: NotesService;
  let notesRepository: Repository<Note>;

  const noteInvalidId: Note = {
    id: 'invalid-uuid',
    title: 'Test title invalid',
    content: 'Test content invalid',
  };

  const note1: Note = {
    id: '147d6fd1-9ba2-4488-b222-ab4b87eb003a',
    title: 'Test title 1',
    content: 'Test content 2',
  };

  const note2: Note = {
    id: '8eb043ee-7ff1-4ac8-b1c5-90364e875ad6',
    title: 'Test title 1',
    content: 'Test content 2',
  };

  const mockRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotesService,
        {
          provide: getRepositoryToken(Note),
          useValue: mockRepository,
        },
      ],
    }).compile();
    notesService = module.get<NotesService>(NotesService);
    notesRepository = module.get<Repository<Note>>(getRepositoryToken(Note));
    jest.clearAllMocks();
  });

  describe('getAllNotes', () => {
    it('should return empty list of notes', async () => {
      mockRepository.find.mockResolvedValue([]);
      const result: INoteListDto = await notesService.getAllNotes();
      expect(notesRepository.find).toHaveBeenCalled();
      expect(result.items).toHaveLength(0);
      expect(result.items).toMatchObject([]);
    });

    it('should return list of two notes', async () => {
      mockRepository.find.mockResolvedValue([note1, note2]);
      const result: INoteListDto = await notesService.getAllNotes();
      expect(notesRepository.find).toHaveBeenCalled();
      expect(result.items).toHaveLength(2);
      expect(result.items).toMatchObject([note1, note2]);
    });
  });

  describe('getNoteById', () => {
    it('should return a note by id', async () => {
      mockRepository.findOneBy.mockResolvedValue(note1);
      const result: INoteDto = await notesService.getNoteById(note1.id);
      expect(notesRepository.findOneBy).toHaveBeenCalledWith({ id: note1.id });
      expect(result).toMatchObject(note1);
    });

    it('should throw NotFoundException for invalid uuid id', async () => {
      mockRepository.findOneBy.mockResolvedValue(noteInvalidId);
      await expect(notesService.getNoteById(noteInvalidId.id)).rejects.toBeInstanceOf(NotFoundException);
      expect(notesRepository.findOneBy).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException for non-existent id', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);
      await expect(notesService.getNoteById(note1.id)).rejects.toBeInstanceOf(NotFoundException);
      expect(notesRepository.findOneBy).toHaveBeenCalledWith({ id: note1.id });
    });
  });

  describe('createNote', () => {
    it('should create note', async () => {
      const createNoteDto: ICreateNoteDto = { title: note1.title, content: note1.content };
      mockRepository.create.mockReturnValue(note1);
      mockRepository.save.mockResolvedValue(note1);
      const result = await notesService.createNote(createNoteDto);
      expect(notesRepository.create).toHaveBeenCalledWith(createNoteDto);
      expect(notesRepository.save).toHaveBeenCalledWith(note1);
      expect(result).toMatchObject(note1);
    });
  });

  describe('updateNote', () => {
    it('should update and return updated note', async () => {
      const updateNoteDto: IUpdateNoteDto = { title: note1.title };
      mockRepository.update.mockResolvedValue({ affected: 1 } as UpdateResult);
      mockRepository.findOneBy.mockResolvedValue(note1);
      const result = await notesService.updateNote(note1.id, updateNoteDto);
      expect(notesRepository.update).toHaveBeenCalledWith(note1.id, updateNoteDto);
      expect(notesRepository.findOneBy).toHaveBeenCalledWith({ id: note1.id });
      expect(result).toMatchObject(note1);
    });

    it('should throw NotFoundException for invalid uuid id', async () => {
      await expect(notesService.updateNote(noteInvalidId.id, { title: noteInvalidId.title })).rejects.toBeInstanceOf(NotFoundException);
      expect(notesRepository.update).not.toHaveBeenCalled();
      expect(notesRepository.findOneBy).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when nothing was updated', async () => {
      const updateNoteDto: IUpdateNoteDto = { title: note1.title };
      mockRepository.update.mockResolvedValue({ affected: 0 } as UpdateResult);
      await expect(notesService.updateNote(note1.id, updateNoteDto)).rejects.toBeInstanceOf(NotFoundException);
      expect(notesRepository.update).toHaveBeenCalledWith(note1.id, updateNoteDto);
      expect(notesRepository.findOneBy).not.toHaveBeenCalled();
    });
  });

  describe('deleteNote', () => {
    it('should delete note and return true', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 } as DeleteResult);
      const result = await notesService.deleteNote(note1.id);
      expect(notesRepository.delete).toHaveBeenCalledWith(note1.id);
      expect(result).toBe(true);
    });

    it('should throw NotFoundException for invalid uuid id', async () => {
      await expect(notesService.deleteNote(noteInvalidId.id)).rejects.toBeInstanceOf(NotFoundException);
      expect(notesRepository.delete).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when nothing was deleted', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 0 } as DeleteResult);
      await expect(notesService.deleteNote(note1.id)).rejects.toBeInstanceOf(NotFoundException);
      expect(notesRepository.delete).toHaveBeenCalledWith(note1.id);
    });
  });
});
