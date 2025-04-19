import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('notes')
export class Note {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'title', default: '' })
  title: string;

  @Column({ name: 'content', default: '' })
  content: string;
}
