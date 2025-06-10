"use client";

import IconBell from "@public/svgs/auth/icon_bell.svg";

/** 알림 Button Interface */
interface INotificationBtn {
  /** 클릭 시 알림 페이지로 이동 */
  onClick?: () => void;

  /** 클래스명 */
  className?: string;

  /** 알림 개수 */
  count?: number;
}

/** 알림 Button */
export default function NotificationBtn({
  onClick,
  className,
  count = 0,
}: INotificationBtn) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`noOutlineBtn ${className}`}
      style={{ position: "relative", width: 32, height: 32 }}
    >
      <IconBell width={20} height={20} fill={"var(--black-700a)"} />

      {count > 0 && (
        <div
          style={{
            width: 12,
            height: 12,
            position: "absolute",
            top: 3,
            right: 3,
            backgroundColor: "var(--err-color)",
            color: "white",
            borderRadius: "50%",
            fontSize: 8,
            padding: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {count}
        </div>
      )}
    </button>
  );
}
