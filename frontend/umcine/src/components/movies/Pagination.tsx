export default function Pagination() {
  return (
    <nav className="flex justify-center gap-1.5 mt-6">
      <button
        type="button"
        className="
          w-7 h-7
          border-none rounded-md
          bg-white text-[#6b7280]
          text-xs font-semibold
          cursor-pointer
          hover:bg-[#f3f4f6]
        "
      >
        {"<"}
      </button>

      <button
        type="button"
        className="
          w-7 h-7
          border-none rounded-md
          bg-[#5b5ce9] text-white
          text-xs font-semibold
          cursor-pointer
        "
      >
        1
      </button>

      <button
        type="button"
        className="
          w-7 h-7
          border-none rounded-md
          bg-white text-[#6b7280]
          text-xs font-semibold
          cursor-pointer
          hover:bg-[#f3f4f6]
        "
      >
        2
      </button>

      <button
        type="button"
        className="
          w-7 h-7
          border-none rounded-md
          bg-white text-[#6b7280]
          text-xs font-semibold
          cursor-pointer
          hover:bg-[#f3f4f6]
        "
      >
        3
      </button>

      <button
        type="button"
        className="
          w-7 h-7
          border-none rounded-md
          bg-white text-[#6b7280]
          text-xs font-semibold
          cursor-pointer
          hover:bg-[#f3f4f6]
        "
      >
        4
      </button>

      <button
        type="button"
        className="
          w-7 h-7
          border-none rounded-md
          bg-white text-[#6b7280]
          text-xs font-semibold
          cursor-pointer
          hover:bg-[#f3f4f6]
        "
      >
        5
      </button>

      <button
        type="button"
        className="
          w-7 h-7
          border-none rounded-md
          bg-white text-[#6b7280]
          text-xs font-semibold
          cursor-pointer
          hover:bg-[#f3f4f6]
        "
      >
        {">"}
      </button>
    </nav>
  );
}