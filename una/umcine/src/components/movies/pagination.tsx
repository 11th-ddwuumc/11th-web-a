import { cn } from "../../utils/cn";

interface PaginationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  onPageChange,
}: PaginationProps) {
  return (
    <nav className="mt-12 flex justify-center gap-2" aria-label="페이지 선택">
      {[1, 2, 3, 4, 5].map((page) => (
        <button
          key={page}
          type="button"
          className={cn(
            "size-9 rounded-md text-gray-500 hover:bg-gray-200",
            currentPage === page && "bg-blue-600 text-white hover:bg-blue-700",
          )}
          aria-current={currentPage === page ? "page" : undefined}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
    </nav>
  );
}
