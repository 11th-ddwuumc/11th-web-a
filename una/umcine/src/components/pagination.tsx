interface PaginationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  onPageChange,
}: PaginationProps) {
  return (
    <nav className="pagination" aria-label="페이지 선택">
      {[1, 2, 3, 4, 5].map((page) => (
        <button
          key={page}
          type="button"
          className={currentPage === page ? "page-button active" : "page-button"}
          aria-current={currentPage === page ? "page" : undefined}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
    </nav>
  );
}