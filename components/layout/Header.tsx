import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/server";
import Link from "next/link";
import {
  MenuIcon,
  LogOut,
  User as UserIcon,
  Search,
  PlusCircle,
  Settings,
  Home,
  LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DarkModeToggle } from "@/components/theme/DarkModeToggle";
import { ColoredLogo } from "./Logo";

export default async function Header() {
  const { getUser, isAuthenticated } = getKindeServerSession();
  const user = await getUser();
  const authenticated = await isAuthenticated();

  const navigationLinks = authenticated
    ? [
        { href: "/reviews", label: "Browse Reviews", icon: Search },
        { href: "/reviews/new", label: "Create Review", icon: PlusCircle },
      ]
    : [
        { href: "/", label: "Home", icon: Home },
        { href: "/reviews", label: "Browse Reviews", icon: Search },
        { href: "/auth/login", label: "Sign In", icon: LogIn },
      ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href={authenticated ? "/reviews" : "/"} className="flex-shrink-0">
              <ColoredLogo />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-6">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                >
                  <Button
                    size={"sm"}
                    variant={"linkHover2"}
                    className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary"
                  >
                    <link.icon className="h-4 w-4" />
                    <span>{link.label}</span>
                  </Button>
                </Link>
              ))}

              {!authenticated && <DarkModeToggle />}

              {authenticated && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.picture || undefined} alt={user?.given_name || 'User'} />
                        <AvatarFallback>
                          {user?.given_name?.[0] || <UserIcon className="h-4 w-4" />}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="flex items-center justify-between p-2">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.given_name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                      <DarkModeToggle />
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600" asChild>
                      <LogoutLink className="w-full flex items-center cursor-pointer">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </LogoutLink>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* Mobile Navigation */}
            <div className="flex md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <MenuIcon className="h-6 w-6" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col space-y-4 mt-4">
                    {navigationLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary"
                      >
                        <link.icon className="h-4 w-4" />
                        <span>{link.label}</span>
                      </Link>
                    ))}
                    {authenticated && (
                      <>
                        <Link
                          href="/profile"
                          className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary"
                        >
                          <Settings className="h-4 w-4" />
                          <span>Profile</span>
                        </Link>
                        <div className="flex items-center justify-between border-t border-border pt-4">
                          <span className="text-sm font-medium">Theme</span>
                          <DarkModeToggle />
                        </div>
                        <LogoutLink className="flex items-center space-x-2 text-sm font-medium text-red-600 hover:text-red-700">
                          <LogOut className="h-4 w-4" />
                          <span>Log out</span>
                        </LogoutLink>
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}