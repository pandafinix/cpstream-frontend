"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { onUpdateUsername } from "@/actions/user";

export function UsernameForm({
  currentUsername,
}: {
  currentUsername: string;
}) {
  const router = useRouter();
  const [username, setUsername] = useState(currentUsername);
  const [isPending, startTransition] = useTransition();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(() => {
      onUpdateUsername(username)
        .then((user) => {
          toast.success("Username updated");
          router.push(`/u/${user.username}/settings`);
          router.refresh();
        })
        .catch(() => {
          toast.error("Could not update username. It may be taken or invalid.");
        });
    });
  };

  return (
    <form onSubmit={onSubmit} className="rounded-xl bg-muted p-6 space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Username</h2>
        <p className="text-sm text-muted-foreground">
          This is your public CPStream handle and profile URL.
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Public username</label>

        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isPending}
          className="w-full rounded-md border border-white/10 bg-background px-3 py-2 text-sm outline-none"
          placeholder="Enter username"
        />

        <p className="text-xs text-muted-foreground">
          Only letters, numbers, and underscores. Minimum 3 characters.
        </p>
      </div>

      <Button disabled={isPending} type="submit" variant="primary">
        Save username
      </Button>
    </form>
  );
}