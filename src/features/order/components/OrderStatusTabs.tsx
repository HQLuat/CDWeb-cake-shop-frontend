import type { OrderStatus } from "../orderType";
import { STATUS_TABS } from "../orderConstants";

interface OrderStatusTabsProps {
  activeStatus: OrderStatus | "ALL";
  onChange: (val: OrderStatus | "ALL") => void;
}

function OrderStatusTabs({ activeStatus, onChange }: OrderStatusTabsProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {STATUS_TABS.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeStatus === value
              ? "bg-primary text-white shadow-sm"
              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export default OrderStatusTabs;
