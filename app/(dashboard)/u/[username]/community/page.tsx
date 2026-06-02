import React from "react";

import { getSelfByUsername } from "@/lib/auth-service";
import { getBlockedUsers } from "@/lib/block-service";

import { UnblockButton } from "./_components/unblock-button";
import { UserAvatar } from "@/components/user-avatar";

interface CommunityPageProps {
  params: {
    username: string;
  };
}

type BlockedUser = {
  id: string;
  username: string;
  imageUrl: string | null;
  bio: string | null;
};

export default async function CommunityPage({
  params: { username },
}: CommunityPageProps) {
  await getSelfByUsername(username);

  const blockedUsers: BlockedUser[] = await getBlockedUsers();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Community Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage users you have blocked.
        </p>
      </div>

      {blockedUsers.length === 0 && (
        <div className="rounded-xl border border-white/10 bg-muted/40 p-8 text-center">
          <p className="text-lg font-semibold">No blocked users</p>
          <p className="text-sm text-muted-foreground mt-2">
            Users you block will appear here.
          </p>
        </div>
      )}

      {blockedUsers.length > 0 && (
        <div className="space-y-3">
          {blockedUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between rounded-xl bg-muted p-4"
            >
              <div className="flex items-center gap-x-3">
                <UserAvatar
                  username={user.username}
                  imageUrl={user.imageUrl || ""}
                />

                <div>
                  <p className="font-semibold">{user.username}</p>
                  <p className="text-xs text-muted-foreground">
                    Blocked user
                  </p>
                </div>
              </div>

              <UnblockButton userId={user.id} username={user.username} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}