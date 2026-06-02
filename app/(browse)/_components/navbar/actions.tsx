import Link from "next/link";
import { Clapperboard, Shield, Settings } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { getSelf } from "@/lib/auth-service";

export async function Actions() {
  let user = null;

  try {
    user = await getSelf();
  } catch (error) {
    console.log("GET SELF ERROR:", error);
  }

  return (
    <div className="flex items-center justify-end gap-x-2 ml-4 lg:ml-0">
      {!user && (
        <Button size="sm" variant="primary" asChild>
          <Link href="/sign-in">Login</Link>
        </Button>
      )}

      {!!user && (
        <div className="flex items-center gap-x-2 lg:gap-x-4">
          <Button
            size="sm"
            variant="ghost"
            className="text-muted-foreground hover:text-primary"
            asChild
          >
            <Link href={`/u/${user.username}/keys`}>
              <Clapperboard className="h-5 w-5 lg:mr-2" />
              <span className="hidden lg:block">Dashboard</span>
            </Link>
          </Button>

          <Button
            size="sm"
            variant="ghost"
            className="text-muted-foreground hover:text-primary"
            asChild
          >
            <Link href={`/u/${user.username}/community`}>
              <Shield className="h-5 w-5 lg:mr-2" />
              <span className="hidden lg:block">Community</span>
            </Link>
          </Button>

          <Button
            size="sm"
            variant="ghost"
            className="text-muted-foreground hover:text-primary"
            asChild
          >
            <Link href={`/u/${user.username}/settings`}>
              <Settings className="h-5 w-5 lg:mr-2" />
              <span className="hidden lg:block">Settings</span>
            </Link>
          </Button>

          <UserButton afterSignOutUrl="/" />
        </div>
      )}
    </div>
  );
}