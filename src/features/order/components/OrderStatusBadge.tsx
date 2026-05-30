import type { OrderStatus } from "../orderType";
import { STATUS_LABEL, getStatusStyle } from "../orderConstants";

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusStyle(status)}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

export default OrderStatusBadge;
