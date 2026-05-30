import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faFilter } from "@fortawesome/free-solid-svg-icons";
import type { OrderStatus } from "../orderType";
import { STATUS_TABS } from "../orderConstants";

interface OrderFilterBarProps {
  searchValue: string;
  onSearchChange: (val: string) => void;
  onSearch: () => void;
  filterStatus: OrderStatus | "ALL";
  onFilterChange: (val: OrderStatus | "ALL") => void;
}

/**
 * Combined search + status-filter bar styled identically to AdminProduct's filter row.
 */
function OrderFilterBar({
  searchValue,
  onSearchChange,
  onSearch,
  filterStatus,
  onFilterChange,
}: OrderFilterBarProps) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 mb-6">
      {/* Search input */}
      <div className="flex-1 flex items-center bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-200">
        <FontAwesomeIcon icon={faSearch} className="text-gray-400 mr-3" />
        <input
          type="text"
          placeholder="Tìm kiếm theo mã đơn hoặc tên khách hàng..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
          className="w-full bg-transparent outline-none text-sm text-gray-700"
        />
        <button
          onClick={onSearch}
          className="ml-3 bg-primary text-white px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-opacity-90 transition-all shrink-0"
        >
          Tìm
        </button>
      </div>

      {/* Status filter dropdown */}
      <div className="flex items-center bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-200 min-w-[200px]">
        <FontAwesomeIcon icon={faFilter} className="text-gray-400 mr-2.5 text-xs" />
        <select
          value={filterStatus}
          onChange={(e) => onFilterChange(e.target.value as OrderStatus | "ALL")}
          className="w-full bg-transparent outline-none text-sm text-gray-700 cursor-pointer"
        >
          {STATUS_TABS.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default OrderFilterBar;
