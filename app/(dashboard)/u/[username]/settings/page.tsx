import React from "react";

import { getSelfByUsername } from "@/lib/auth-service";

import { UsernameForm } from "./_components/username-form";

interface SettingsPageProps {
  params: {
    username: string;
  };
}

export default async function SettingsPage({
  params: { username },
}: SettingsPageProps) {
  const user = await getSelfByUsername(username);

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Profile Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your CPStream public profile.
        </p>
      </div>

      <UsernameForm currentUsername={user.username} />
    </div>
  );
}