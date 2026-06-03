"use client";

import React, { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { onFollow, onUnfollow } from "@/actions/follow";
import { onBlock, onUnblock } from "@/actions/block";

export function Actions({
  isFollowing,
  userId,
}: {
  isFollowing: boolean;
  userId: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handleFollow = () => {
    startTransition(() => {
      onFollow(userId)
        .then(() => toast.success("You are now following this user"))
        .catch(() => toast.error("Something went wrong, failed to follow"));
    });
  };

  const handleUnfollow = () => {
    startTransition(() => {
      onUnfollow(userId)
        .then(() => toast.success("You have unfollowed this user"))
        .catch(() => toast.error("Something went wrong, failed to unfollow"));
    });
  };

  const handleBlock = () => {
    startTransition(() => {
      onBlock(userId)
        .then(() => toast.success("You have blocked this user"))
        .catch(() => toast.error("Something went wrong, failed to block"));
    });
  };

  const handleUnblock = () => {
    startTransition(() => {
      onUnblock(userId)
        .then(() => toast.success("You have unblocked this user"))
        .catch(() => toast.error("Something went wrong, failed to unblock"));
    });
  };

  const onClick = () => {
    if (isFollowing) {
      handleUnfollow();
    } else {
      handleFollow();
    }
  };

  return (
    <>
      <Button variant="primary" disabled={isPending} onClick={onClick}>
        {isFollowing ? "Unfollow" : "Follow"}
      </Button>
      <Button onClick={handleBlock} disabled={isPending}>
        Block
      </Button>
      <Button onClick={handleUnblock} disabled={isPending}>
        Unblock
      </Button>
    </>
  );
}