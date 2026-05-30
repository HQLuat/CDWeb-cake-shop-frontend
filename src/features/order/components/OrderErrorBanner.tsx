import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

interface OrderErrorBannerProps {
  error?: string | null;
  updateError?: string | null;
  onRetry?: () => void;
  onDismiss: () => void;
}

function OrderErrorBanner({
  error,
  updateError,
  onRetry,
  onDismiss,
}: OrderErrorBannerProps) {
  if (!error && !updateError) return null;

  return (
    <>
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl flex items-center justify-between">
          <span>{error}</span>
          <div className="flex gap-3">
            {onRetry && (
              <button onClick={onRetry} className="font-semibold underline">
                Thử lại
              </button>
            )}
            <button
              onClick={onDismiss}
              className="text-red-400 hover:text-red-600"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        </div>
      )}
      {updateError && (
        <div className="mb-4 px-4 py-3 bg-orange-50 border border-orange-100 text-orange-600 text-sm rounded-2xl flex items-center justify-between">
          <span>Cập nhật thất bại: {updateError}</span>
          <button
            onClick={onDismiss}
            className="text-orange-400 hover:text-orange-600"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      )}
    </>
  );
}

export default OrderErrorBanner;
