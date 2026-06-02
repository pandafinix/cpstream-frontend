"use client";

import React, { useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { onUnblock } from "@/actions/block";
import { Button } from "@/components/ui/button";

export function UnblockButton({
  userId,
  username,
}: {
  userId: string;
  username?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const onClick = () => {
    startTransition(() => {
      onUnblock(userId, username)
        .then(() => {
          toast.success(
            username ? `${username} unblocked` : "User unblocked"
          );
          router.refresh();
        })
        .catch(() => toast.error("Something went wrong"));
    });
  };

  return (
    <Button
      disabled={isPending}
      onClick={onClick}
      variant="link"
      size="sm"
      className="text-blue-500 w-full"
    >
      Unblock
    </Button>
  );
}