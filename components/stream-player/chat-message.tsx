"use client";

import React from "react";
import { format } from "date-fns";

import { stringToColor } from "@/lib/utils";

export type ChatMessageData = {
  id?: string;
  message: string;
  timestamp: number;
  from?: {
    name?: string | null;
    identity?: string | null;
  } | null;
};

export function ChatMessage({ data }: { data: ChatMessageData }) {
  const color = stringToColor(data.from?.name || "");

  return (
    <div className="flex gap-2 p-2 rounded-md hover:bg-white/5">
      <p className="text-sm text-white/40">{format(data.timestamp, "HH:mm")}</p>
      <div className="flex flex-wrap items-baseline gap-1 grow">
        <p className="text-sm font-semibold whitespace-nowrap">
          <span className="truncate" style={{ color }}>
            {data.from?.name || "Guest"}
          </span>
          :
        </p>
        <p className="text-sm break-all">{data.message}</p>
      </div>
    </div>
  );
}