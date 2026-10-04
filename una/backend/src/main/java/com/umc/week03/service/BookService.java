package com.umc.week03.service;

import com.umc.week03.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;

    // 전체 도서 조회
    public List<Map<String, Object>> getAllBooks() {
        return bookRepository.findAll();
    }

    // 카테고리별 도서 조회
    public List<Map<String, Object>> getBooksByCategory(Long categoryId) {
        return bookRepository.findByCategoryId(categoryId);
    }

    public void createBook(Map<String, Object> body) {
        bookRepository.save(body);
    }
}