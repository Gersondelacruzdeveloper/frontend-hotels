import React from "react";

type Props = {
  mine?: boolean;
  text: string;
  time: string;
  showAvatar?: boolean;
  initials?: string;
  firstInGroup?: boolean;
  lastInGroup?: boolean;
};

export default function MessageBubble({
  mine,
  text,
  time,
  showAvatar,
  initials = "",
  firstInGroup = false,
  lastInGroup = true,
}: Props) {
  return (
    <div className={`flex items-end ${mine ? "justify-end" : "justify-start"} gap-2`}>
      {!mine && showAvatar && (
        <div className="h-7 w-7 rounded-full bg-emerald-500 grid place-items-center text-white text-[11px]">
          {initials || "G"}
        </div>
      )}

      <div
        className={[
          "max-w-[80%] sm:max-w-[68%] px-3 py-2 shadow-sm",
          mine ? "bg-indigo-600 text-white" : "bg-white border border-slate-100",
          "rounded-2xl",
          mine
            ? lastInGroup
              ? "rounded-br-md"
              : "rounded-br-2xl"
            : lastInGroup
            ? "rounded-bl-md"
            : "rounded-bl-2xl",
          firstInGroup ? "mt-3" : "mt-1.5",
        ].join(" ")}
      >
        <div className="whitespace-pre-wrap break-words">{text}</div>
        <div className={`mt-1 text-[10px] ${mine ? "text-indigo-100/80" : "text-slate-400"}`}>{time}</div>
      </div>

      {mine && showAvatar && (
        <div className="h-7 w-7 rounded-full bg-indigo-500 grid place-items-center text-white text-[11px]">S</div>
      )}
    </div>
  );
}
