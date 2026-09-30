USE una_library_week02;

-- 미션 1: 문학 카테고리의 대여 가능한 도서 최대 10개 조회
-- 카테고리 이름을 가져오기 위해 book과 category 연결
-- 등록일 컬럼이 없으므로 book_id 내림차순을 최신순 기준으로 사용
SELECT
    b.title,
    b.description,
    c.name AS category_name
FROM book AS b
JOIN category AS c
    ON b.category_id = c.category_id
WHERE c.name = '문학'
    AND b.is_available = TRUE
ORDER BY b.book_id DESC
LIMIT 10;


-- 미션 2: 사용자 1이 아직 반납하지 않은 책 조회
-- 책 제목을 가져오기 위해 rental과 book 연결
-- 반납 예정일 순으로 정렬하고, 예정일이 같으면 대여 ID로 정렬
SELECT
    b.title,
    r.rented_at,
    r.due_at
FROM rental AS r
JOIN book AS b
    ON r.book_id = b.book_id
WHERE r.user_id = 1
    AND r.returned_at IS NULL
ORDER BY r.due_at ASC, r.rental_id ASC;


-- 미션 3: 책 1의 태그와 사용자 1의 좋아요 여부 조회
-- book_tag, tag로 태그를 가져오고 book_like로 좋아요를 확인
-- 태그나 좋아요가 없어도 책이 표시되도록 LEFT JOIN을 사용
SELECT
    b.title,
    t.name AS tag_name,
    CASE
        WHEN bl.user_id IS NOT NULL THEN TRUE
        ELSE FALSE
    END AS is_liked
FROM book AS b
LEFT JOIN book_tag AS bt
    ON b.book_id = bt.book_id
LEFT JOIN tag AS t
    ON bt.tag_id = t.tag_id
LEFT JOIN book_like AS bl
    ON b.book_id = bl.book_id
    AND bl.user_id = 1
WHERE b.book_id = 1
ORDER BY t.tag_id ASC;