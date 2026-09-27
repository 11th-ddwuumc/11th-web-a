SELECT b.title, b.description, c.name AS category_name
FROM book b
JOIN category c ON b.category_id = c.category_id
WHERE c.name = '문학' AND b.is_available = TRUE
ORDER BY b.book_id DESC
LIMIT 10;

SELECT b.title, r.rented_at, r.due_at
FROM rental r
JOIN book b ON r.book_id = b.book_id
WHERE r.user_id = 1 AND r.returned_at IS NULL
ORDER BY r.due_at ASC;

SELECT t.name AS tag_name, 
       (SELECT COUNT(*) FROM book_like bl WHERE bl.book_id = b.book_id AND bl.user_id = 1) AS is_liked
FROM book b
LEFT JOIN book_tag bt ON b.book_id = bt.book_id
LEFT JOIN tag t ON bt.tag_id = t.tag_id
WHERE b.book_id = 1;