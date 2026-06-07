import { ChevronLeft, ChevronRight } from "lucide-react";

interface OrderPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function getPaginationRange(
  currentPage: number,
  totalPages: number,
): (number | "...")[] {
  const delta = 2;
  const range: (number | "...")[] = [];
  const left = Math.max(1, currentPage - delta);
  const right = Math.min(totalPages, currentPage + delta);

  if (left > 1) {
    range.push(1);
    if (left > 2) range.push("...");
  }
  for (let i = left; i <= right; i++) range.push(i);
  if (right < totalPages) {
    if (right < totalPages - 1) range.push("...");
    range.push(totalPages);
  }
  return range;
}

function OrderPagination({
  currentPage,
  totalPages,
  onPageChange,
}: OrderPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-full text-[13px] border border-gray-200 bg-white disabled:opacity-30 hover:border-primary hover:text-primary transition-all shadow-sm cursor-pointer"
      >
        <ChevronLeft size={17} />
      </button>

      {getPaginationRange(currentPage, totalPages).map((item, idx) =>
        item === "..." ? (
          <span key={`e-${idx}`} className="px-2 text-gray-400">
            …
          </span>
        ) : (
          <button
            key={item}
            onClick={() => onPageChange(item as number)}
            className={`w-9 h-9 rounded-full text-[13px] font-medium transition-all shadow-sm cursor-pointer ${currentPage === item
              ? "bg-primary text-white shadow-primary/20"
              : "bg-white border border-gray-200 hover:border-primary hover:text-primary"
              }`}
          >
            {item as number}
          </button>
        ),
      )}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-full text-[13px] border border-gray-200 bg-white disabled:opacity-30 hover:border-primary hover:text-primary transition-all shadow-sm cursor-pointer"
      >
        <ChevronRight size={17} />
      </button>
    </div>
  );
}

export default OrderPagination;
