import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { NotesService } from './notes.service';
import { INoteDto } from './dtos/note.dto';
import { NotesController } from './notes.controller';
import { ICreateNoteDto } from './dtos/create-note.dto';
import { IUpdateNoteDto } from './dtos/update-note.dto';

describe('NotesController', () => {
  let notesController: NotesController;
  let notesService: NotesService;

  const noteDto1: INoteDto = {
    id: '147d6fd1-9ba2-4488-b222-ab4b87eb003a',
    title: 'Test title 1',
    content: 'Test content 2',
  };

  const noteDto2: INoteDto = {
    id: '8eb043ee-7ff1-4ac8-b1c5-90364e875ad6',
    title: 'Test title 1',
    content: 'Test content 2',
  };

  const mockNotesService = {
    getNoteById: jest.fn(),
    getAllNotes: jest.fn(),
    createNote: jest.fn(),
    updateNote: jest.fn(),
    deleteNote: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotesController],
      providers: [
        {
          provide: NotesService,
          useValue: mockNotesService,
        },
      ],
    }).compile();
    notesController = module.get<NotesController>(NotesController);
    notesService = module.get<NotesService>(NotesService);
    jest.clearAllMocks();
  });

  describe('getAllNotes', () => {
    it('should return a list of all notes', async () => {
      mockNotesService.getAllNotes.mockResolvedValue({ items: [noteDto1, noteDto2] });
      const result = await notesController.getAllNotes();
      expect(notesService.getAllNotes).toHaveBeenCalled();
      expect(result.items).toHaveLength(2);
      expect(result.items).toEqual([noteDto1, noteDto2]);
    });
  });

  describe('getNoteById', () => {
    it('should return a note by id', async () => {
      mockNotesService.getNoteById.mockResolvedValue(noteDto1);
      const result = await notesController.getNoteById(noteDto1.id);
      expect(notesService.getNoteById).toHaveBeenCalledWith(noteDto1.id);
      expect(result).toEqual(noteDto1);
    });

    it('should propagate NotFoundException from notesService', async () => {
      mockNotesService.getNoteById.mockRejectedValue(new NotFoundException());
      await expect(notesController.getNoteById(noteDto1.id)).rejects.toBeInstanceOf(NotFoundException);
      expect(notesService.getNoteById).toHaveBeenCalledWith(noteDto1.id);
    });
  });

  describe('createNote', () => {
    it('should create note and return created note', async () => {
      const createNoteDto: ICreateNoteDto = { title: noteDto1.title, content: noteDto1.content };
      mockNotesService.createNote.mockResolvedValue(noteDto1);
      const result = await notesController.createNote(createNoteDto);
      expect(notesService.createNote).toHaveBeenCalledWith(createNoteDto);
      expect(result).toEqual(noteDto1);
    });
  });

  describe('updateNote', () => {
    it('should update note by id and return updated note', async () => {
      const updateDto: IUpdateNoteDto = { title: noteDto1.title };
      mockNotesService.updateNote.mockResolvedValue(noteDto1);
      const result = await notesController.updateNote(noteDto1.id, updateDto);
      expect(notesService.updateNote).toHaveBeenCalledWith(noteDto1.id, updateDto);
      expect(result).toEqual(noteDto1);
    });

    it('should propagate NotFoundException from notesService', async () => {
      const updateDto: IUpdateNoteDto = { title: noteDto1.title };
      mockNotesService.updateNote.mockRejectedValue(new NotFoundException());
      await expect(notesController.updateNote(noteDto1.id, updateDto)).rejects.toBeInstanceOf(NotFoundException);
      expect(notesService.updateNote).toHaveBeenCalledWith(noteDto1.id, updateDto);
    });
  });

  describe('deleteNote', () => {
    it('should delete note by id and return result of deletion', async () => {
      mockNotesService.deleteNote.mockResolvedValue(true);
      const result = await notesController.deleteNote(noteDto1.id);
      expect(notesService.deleteNote).toHaveBeenCalledWith(noteDto1.id);
      expect(result).toEqual({ success: true });
    });

    it('should propagate NotFoundException from notesService', async () => {
      mockNotesService.deleteNote.mockRejectedValue(new NotFoundException());
      await expect(notesController.deleteNote(noteDto1.id)).rejects.toBeInstanceOf(NotFoundException);
      expect(notesService.deleteNote).toHaveBeenCalledWith(noteDto1.id);
    });
  });
});
