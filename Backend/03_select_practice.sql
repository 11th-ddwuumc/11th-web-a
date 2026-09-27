USE library_practice;

SELECT
    book_id,
    title,
    description
 FROM book
 WHERE is_available=TRUE
 ORDER BY book_id DESC;

SELECT
    b.book_id,
    b.title,
    c.name AS category_name
FROM book AS b
JOIN category AS c
    ON b.category_id = c.category_id
WHERE c.name = '문학'
  AND b.is_available = TRUE
ORDER BY b.book_id DESC
LIMIT 10;


SELECT
    b.book_id,
    b.title,
    t.name AS tag_name
FROM book AS b
JOIN book_tag AS bt
    ON b.book_id = bt.book_id
JOIN tag AS t
    ON bt.tag_id = t.tag_id
WHERE b.book_id = 1
ORDER BY t.tag_id;

SELECT
    b.book_id,
    b.title,
    CASE
        WHEN bl.user_id IS NOT NULL THEN TRUE
        ELSE FALSE
    END AS is_liked
FROM book AS b
LEFT JOIN book_like AS bl
    ON b.book_id = bl.book_id
   AND bl.user_id = 1
WHERE b.book_id = 1;

SELECT
    book_id,
    title,
    description,
    is_available
FROM book
ORDER BY book_id DESC
LIMIT 10 OFFSET 0;

SELECT
    book_id,
    title,
    description,
    is_available
FROM book
ORDER BY book_id DESC
LIMIT 10 OFFSET 10;