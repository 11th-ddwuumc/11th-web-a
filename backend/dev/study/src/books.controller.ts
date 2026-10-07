import { Body, Controller, Get, Post } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './book.dto';

@Controller('orm/books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  async findAll() {
    return this.booksService.findAll();
  }

  @Post()
  async create(@Body() dto: CreateBookDto) {
    return this.booksService.create(dto);
  }
}
