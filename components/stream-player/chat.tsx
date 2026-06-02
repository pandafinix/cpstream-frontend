"use client";

import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useMediaQuery } from "usehooks-ts";
import {
  useChat,
  useConnectionState,
  useRemoteParticipant,
} from "@livekit/components-react";
import { ConnectionState } from "livekit-client";

import { ChatVariant, useChatSidebar } from "@/store/use-chat-sidebar";

import { ChatHeader, ChatHeaderSkeleton } from "./chat-header";
import { ChatForm, ChatFormSkeleton } from "./chat-form";
import { ChatList, ChatListSkeleton } from "./chat-list";
import { ChatCommunity } from "./chat-community";
import { ChatMessageData } from "./chat-message";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

type BackendChatMessage = {
  id: string;
  roomName: string;
  senderIdentity: string;
  senderName: string;
  message: string;
  createdAt: string;
};

export function Chat({
  hostName,
  hostIdentity,
  viewerName,
  viewerIdentity,
  isFollowing,
  isChatEnabled,
  isChatDelayed,
  isChatFollowersOnly,
}: {
  hostName: string;
  hostIdentity: string;
  viewerName: string;
  viewerIdentity: string;
  isFollowing: boolean;
  isChatEnabled: boolean;
  isChatDelayed: boolean;
  isChatFollowersOnly: boolean;
}) {
  const matches = useMediaQuery("(max-width: 1024px)");
  const { variant, onExpand } = useChatSidebar((state) => state);
  const connectionState = useConnectionState();
  const participant = useRemoteParticipant(hostIdentity);

  const isOnline = participant && connectionState === ConnectionState.Connected;
  const isHidden = !isChatEnabled || !isOnline;

  const [value, setValue] = useState("");
  const [oldMessages, setOldMessages] = useState<ChatMessageData[]>([]);

  const { chatMessages: messages, send } = useChat();

  useEffect(() => {
    if (matches) {
      onExpand();
    }
  }, [matches, onExpand]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/chat/messages/${hostName}`, {
          cache: "no-store",
        });

        if (!res.ok) return;

        const data: BackendChatMessage[] = await res.json();

        const mappedMessages: ChatMessageData[] = data.map((msg) => ({
          id: msg.id,
          message: msg.message,
          timestamp: new Date(msg.createdAt).getTime(),
          from: {
            name: msg.senderName,
            identity: msg.senderIdentity,
          },
        }));

        setOldMessages(mappedMessages);
      } catch (error) {
        console.log("FETCH CHAT ERROR:", error);
      }
    };

    fetchMessages();
  }, [hostName]);

  const liveMessages = useMemo(() => {
    return messages.map((msg) => ({
      id: `${msg.timestamp}-${msg.from?.identity}-${msg.message}`,
      message: msg.message,
      timestamp: msg.timestamp,
      from: {
        name: msg.from?.name,
        identity: msg.from?.identity,
      },
    }));
  }, [messages]);

  const allMessages = useMemo(() => {
    return [...oldMessages, ...liveMessages].sort(
      (a, b) => b.timestamp - a.timestamp
    );
  }, [oldMessages, liveMessages]);

  const saveMessage = async (message: string) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/chat/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomName: hostName,
          senderIdentity: viewerIdentity,
          senderName: viewerName,
          message,
        }),
      });

      if (!res.ok) {
        if (res.status === 429) {
          toast.error("Slow down — max 5 messages every 10 seconds.");
        } else {
          toast.error("Failed to send message");
        }

        return false;
      }

      return true;
    } catch (error) {
      console.log("SAVE CHAT ERROR:", error);
      toast.error("Failed to send message");
      return false;
    }
  };

  const onSubmit = async () => {
    if (!send) return;

    const message = value.trim();

    if (!message) return;

    const saved = await saveMessage(message);

    if (!saved) {
      return;
    }

    send(message);
    setValue("");
  };

  const onChange = (value: string) => {
    setValue(value);
  };

  return (
    <div className="flex flex-col bg-background border-l border-b pt-0 h-[calc(100vh-80px)]">
      <ChatHeader />

      {variant === ChatVariant.CHAT && (
        <>
          <ChatList messages={allMessages} isHidden={isHidden} />
          <ChatForm
            onSubmit={onSubmit}
            value={value}
            onChange={onChange}
            isHidden={isHidden}
            isFollowersOnly={isChatFollowersOnly}
            isDelayed={isChatDelayed}
            isFollowing={isFollowing}
          />
        </>
      )}

      {variant === ChatVariant.COMMUNITY && (
        <ChatCommunity
          hostName={hostName}
          viewerName={viewerName}
          isHidden={isHidden}
        />
      )}
    </div>
  );
}

export function ChatSkeleton() {
  return (
    <div className="flex flex-col border-l border-b pt-0 h-[calc(100vh-80px)] border-2">
      <ChatHeaderSkeleton />
      <ChatListSkeleton />
      <ChatFormSkeleton />
    </div>
  );
}