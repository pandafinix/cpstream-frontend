"use client";

import React from "react";

import { Skeleton } from "@/components/ui/skeleton";

import { ChatMessage, ChatMessageData } from "./chat-message";

export function ChatList({
  isHidden,
  messages,
}: {
  messages: ChatMessageData[];
  isHidden: boolean;
}) {
  if (isHidden || !messages || messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-muted-foreground">
          {isHidden ? "Chat is disabled" : "Welcome to the chat!"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col-reverse overflow-y-auto p-3 h-full">
      {messages.map((message) => (
        <ChatMessage
          key={
            message.id ||
            `${message.timestamp}-${message.from?.identity}-${message.message}`
          }
          data={message}
        />
      ))}
    </div>
  );
}

export function ChatListSkeleton() {
  return (
    <div className="flex h-full items-center justify-center">
      <Skeleton className="w-1/2 h-6" />
    </div>
  );
}