import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

interface OrderSearchBarProps {
  value: string;
  onChange: (val: string) => void;
  onSearch: () => void;
}

function OrderSearchBar({ value, onChange, onSearch }: OrderSearchBarProps) {
  return (
    <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 mb-6 flex items-center gap-3">
      <FontAwesomeIcon icon={faSearch} className="text-gray-400 ml-1" />
      <input
        type="text"
        placeholder="Tìm kiếm theo mã đơn hoặc tên khách hàng..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSearch()}
        className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-300"
      />
      <button
        onClick={onSearch}
        className="bg-primary text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-[#7a0001] transition-all"
      >
        Tìm
      </button>
    </div>
  );
}

export default OrderSearchBar;
