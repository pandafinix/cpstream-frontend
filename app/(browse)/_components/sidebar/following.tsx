"use client";

import React from "react";

import { useSidebar } from "@/store/use-sidebar";

import { UserItem, UserItemSkeleton } from "./user-item";

type FollowingUser = {
  id: string;
  username: string;
  imageUrl: string | null;
  stream: {
    isLive: boolean;
  } | null;
};

export function Following({ data }: { data: FollowingUser[] }) {
  const { collapsed } = useSidebar((state) => state);

  const showLabel = !collapsed && data.length > 0;

  return (
    <div>
      {showLabel && (
        <div className="pl-6 mb-4">
          <p className="text-xs text-muted-foreground">Following</p>
        </div>
      )}

      <ul className="space-y-2 px-2">
        {data.map((user) => (
          <UserItem
            key={user.id}
            imageUrl={user.imageUrl || ""}
            username={user.username}
            isLive={user.stream?.isLive || false}
          />
        ))}
      </ul>
    </div>
  );
}

export function FollowingSkeleton() {
  return (
    <ul className="px-2">
      {[...Array(3)].map((_, i) => (
        <UserItemSkeleton key={i} />
      ))}
    </ul>
  );
}