import { cn } from "../../utils/cn";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const windowSize = 5;
  let start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, start + windowSize - 1);
  start = Math.max(1, end - windowSize + 1);

  const pages = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <nav className="flex justify-center gap-1.5">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="이전 페이지"
        className="h-7 w-7 cursor-pointer rounded-md border-none bg-white text-xs font-semibold text-[#6b7280] hover:bg-[#f3f4f6] disabled:cursor-default disabled:opacity-40"
      >
        {"<"}
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          className={cn(
            "h-7 min-w-7 cursor-pointer rounded-md border-none px-1 text-xs font-semibold",
            page === currentPage
              ? "bg-[#5b5ce9] text-white"
              : "bg-white text-[#6b7280] hover:bg-[#f3f4f6]",
          )}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="다음 페이지"
        className="h-7 w-7 cursor-pointer rounded-md border-none bg-white text-xs font-semibold text-[#6b7280] hover:bg-[#f3f4f6] disabled:cursor-default disabled:opacity-40"
      >
        {">"}
      </button>
    </nav>
  );
}
