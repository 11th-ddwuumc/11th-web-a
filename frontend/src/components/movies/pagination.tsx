
import { cn } from "../../utils/cn";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  // 화면에 표시할 페이지 버튼 수
  const visiblePageCount = 5;

  // 현재 페이지를 가운데에 배치하도록 시작 번호 계산
  const startPage = Math.max(
    1,
    Math.min(
      currentPage - Math.floor(visiblePageCount / 2),
      totalPages - visiblePageCount + 1,
    ),
  );

  // 실제 표시할 페이지 개수
  const pageCount = Math.min(visiblePageCount, totalPages);

  // 현재 화면에 표시할 페이지 번호 배열
  const visiblePages = Array.from(
    { length: pageCount },
    (_, index) => startPage + index,
  );

  return (
    <nav
      className="mt-12 flex justify-center gap-2"
      aria-label="페이지 선택"
    >
      <button
        type="button"
        className="grid size-9 place-items-center disabled:cursor-default disabled:opacity-25"
        aria-label="이전 페이지"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <img
          className="size-5"
          src="/icons/chevron-left.svg"
          alt=""
        />
      </button>

      {visiblePages.map((page) => (
        <button
          key={page}
          type="button"
          className={cn(
            "size-9 rounded-md text-gray-500 hover:bg-gray-200",
            currentPage === page &&
              "bg-[#191b1f] text-white hover:bg-gray-800",
          )}
          aria-current={currentPage === page ? "page" : undefined}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        className="grid size-9 place-items-center disabled:cursor-default disabled:opacity-25"
        aria-label="다음 페이지"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <img
          className="size-5"
          src="/icons/chevron-right.svg"
          alt=""
        />
      </button>
    </nav>
  );
}
