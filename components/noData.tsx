import { FC } from "react";

interface NoDataMessageProps {
  message?: string;
  className?: string;
}

/**
 * 無數據顯示組件
 * 當沒有數據可顯示時使用此組件
 */
const NoDataMessage: FC<NoDataMessageProps> = ({
  message = "暫無數據",
  className = "",
}) => (
  <div
    className={`h-full w-full flex flex-col items-center justify-center text-white ${className}`}
  >
    <div className="text-2xl font-bold mb-1">{message}</div>
    <div className="text-sm text-gray-400">
      Please try again or change the filter
    </div>
  </div>
);

export default NoDataMessage;
