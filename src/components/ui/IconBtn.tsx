import React, { ReactElement, cloneElement, isValidElement } from "react";

export function IconBtn({
  onClick,
  icon,
  title,
  isActive = false,
}: {
  onClick: () => void;
  icon: ReactElement<{ className?: string }>; // 💡 여기!
  title: string;
  isActive?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="p-1 sm:p-2 hover:bg-gray-100 hover:scale-110 dark:hover:bg-gray-700 rounded-full transition-colors"
      title={title}
    >
      {isValidElement(icon) &&
        cloneElement(icon, {
          className: `w-5 h-5 sm:w-6 sm:h-6 ${isActive ? 'text-red-500' : ''}`,
        })}
    </button>
  );
}
