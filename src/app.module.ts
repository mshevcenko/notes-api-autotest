import { Module } from '@nestjs/common';
import { NotesModule } from './notes/notes.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import dataSource from './database/data-source';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...dataSource.options,
      autoLoadEntities: true,
    }),
    NotesModule,
  ],
})
export class AppModule {}
