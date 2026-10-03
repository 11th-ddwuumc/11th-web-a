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
  return (
    <nav className="mt-12 flex justify-center gap-2" aria-label="페이지 선택">
      <button type="button" className="grid size-9 place-items-center disabled:cursor-default disabled:opacity-25" aria-label="이전 페이지" disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)}>
        <img className="size-5" src="/icons/chevron-left.svg" alt="" />
      </button>
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
        <button
          key={page}
          type="button"
          className={cn(
            "size-9 rounded-md text-gray-500 hover:bg-gray-200",
            currentPage === page && "bg-[#191b1f] text-white hover:bg-gray-800",
          )}
          aria-current={currentPage === page ? "page" : undefined}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      <button type="button" className="grid size-9 place-items-center disabled:cursor-default disabled:opacity-25" aria-label="다음 페이지" disabled={currentPage >= totalPages} onClick={() => onPageChange(currentPage + 1)}>
        <img className="size-5" src="/icons/chevron-right.svg" alt="" />
      </button>
    </nav>
  );
}
