import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faFilter, faTimes, faChevronDown } from "@fortawesome/free-solid-svg-icons";
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
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-3 mb-6">
      {/* Search input */}
      <div className="flex-1 flex items-center bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-200 gap-3">
        <FontAwesomeIcon icon={faSearch} className="text-gray-400 shrink-0" />
        <input
          type="text"
          placeholder="Tìm tên khách hàng..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
          className="w-full bg-transparent outline-none text-sm text-gray-700"
        />
        {searchValue && (
          <button onClick={() => onSearchChange("")} className="text-gray-400 hover:text-gray-700">
            <FontAwesomeIcon icon={faTimes} size="xs" />
          </button>
        )}
      </div>
      <button
        onClick={onSearch}
        className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#7a0001] transition-all"
      >
        Tìm
      </button>

      {/* Status filter dropdown */}
      <div className="flex items-center bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-200 min-w-[200px] gap-2 relative">
        <FontAwesomeIcon icon={faFilter} className="text-gray-400 text-xs shrink-0" />
        <select
          value={filterStatus}
          onChange={(e) => onFilterChange(e.target.value as OrderStatus | "ALL")}
          className="w-full bg-transparent outline-none text-sm text-gray-700 cursor-pointer appearance-none"
        >
          {STATUS_TABS.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <FontAwesomeIcon icon={faChevronDown} className="text-gray-400 text-xs pointer-events-none shrink-0" />
      </div>
    </div>
  );
}

export default OrderFilterBar;
