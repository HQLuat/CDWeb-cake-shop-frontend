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
  const left = Math.max(0, currentPage - delta);
  const right = Math.min(totalPages - 1, currentPage + delta);

  if (left > 0) {
    range.push(0);
    if (left > 1) range.push("...");
  }
  for (let i = left; i <= right; i++) range.push(i);
  if (right < totalPages - 1) {
    if (right < totalPages - 2) range.push("...");
    range.push(totalPages - 1);
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
        onClick={() => onPageChange(Math.max(0, currentPage - 1))}
        disabled={currentPage === 0}
        className="px-4 py-2 rounded-full text-[13px] border border-gray-200 bg-white disabled:opacity-30 hover:border-primary hover:text-primary transition-all shadow-sm"
      >
        ← Trước
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
            className={`w-9 h-9 rounded-full text-[13px] font-medium transition-all shadow-sm ${
              currentPage === item
                ? "bg-primary text-white shadow-primary/20"
                : "bg-white border border-gray-200 hover:border-primary hover:text-primary"
            }`}
          >
            {(item as number) + 1}
          </button>
        ),
      )}

      <button
        onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
        disabled={currentPage === totalPages - 1}
        className="px-4 py-2 rounded-full text-[13px] border border-gray-200 bg-white disabled:opacity-30 hover:border-primary hover:text-primary transition-all shadow-sm"
      >
        Sau →
      </button>
    </div>
  );
}

export default OrderPagination;
