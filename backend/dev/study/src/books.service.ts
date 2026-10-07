import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './book.entity';
import { Category } from './category.entity';
import { CreateBookDto, BookResponseDto } from './book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<BookResponseDto[]> {
    const books = await this.bookRepository.find({
      relations: { category: true },
      order: { bookId: 'DESC' },
    });
    return books.map((book) => BookResponseDto.from(book));
  }

  async create(dto: CreateBookDto): Promise<BookResponseDto> {
    const category = await this.categoryRepository.findOneBy({
      categoryId: dto.categoryId,
    });
    if (!category) {
      throw new NotFoundException(
        `카테고리(${dto.categoryId})를 찾을 수 없습니다.`,
      );
    }

    const book = this.bookRepository.create({
      title: dto.title,
      description: dto.description ?? null,
      category,
    });
    const saved = await this.bookRepository.save(book);

    return BookResponseDto.from(saved);
  }
}
