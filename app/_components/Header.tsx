import Link from "next/link";
import { LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

import { DarkModeToggle } from "./DarkModeToggle";
import { LogOutIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function Header() {
  const { isAuthenticated } = getKindeServerSession();
  const authenticated = await isAuthenticated();

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href={authenticated ? "/reviews" : "/"} className="font-bold text-xl text-foreground">
            StayScore
          </Link>
          <div className="flex items-center gap-2">
                {authenticated ? (
                    <>
                        <Link href="/reviews/new" className="text-foreground hover:underline hover:text-primary">
                        Create a Review
                        </Link>
                        <Link href="/profile" className="text-foreground hover:underline hover:text-primary">
                        Profile
                        </Link>
                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Log Out"
                        >
                            <LogoutLink className="rotate-0 scale-100 transition-all">
                                <LogOutIcon/>
                            </LogoutLink>
                        </Button>
                    </>
                ) : (
                    <LoginLink className="text-foreground hover:underline hover:text-primary">Log in</LoginLink>
                )}
                <DarkModeToggle />
          </div>
        </div>
      </nav>
    </header>
  );
}