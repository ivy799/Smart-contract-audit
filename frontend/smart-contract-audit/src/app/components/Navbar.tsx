"use client";

import React from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { useRouter } from "next/navigation";
import { ModeToggle } from "@/components/toggle";
import { UserButton } from "@clerk/nextjs";

const Navbar = () => {
  const router = useRouter();
  return (
    <header className="fixed top-0 w-full px-8 sm:px-20 z-50 flex-shrink-0 bg-background/95 backdrop-blur-lg border-b border-border">
      <nav className="flex items-center justify-between max-w-7xl mx-auto h-16">
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
            <span className="text-black font-bold text-lg">Z</span>
          </div>
          <span className="text-xl font-semibold">Zectra</span>
        </div>

        <NavigationMenu className="hidden md:block">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                onClick={() => router.push("/")}
                className="text-muted-foreground hover:text-foreground transition-colors px-4 py-2 text-sm font-medium cursor-pointer"
              >
                Home
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                onClick={() => router.push("/#about")}
                className="text-muted-foreground hover:text-foreground transition-colors px-4 py-2 text-sm font-medium cursor-pointer"
              >
                About
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                onClick={() => router.push("/analyze")}
                className="text-muted-foreground hover:text-foreground transition-colors px-4 py-2 text-sm font-medium cursor-pointer"
              >
                Service
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                onClick={() => router.push("/price")}
                className="text-muted-foreground hover:text-foreground transition-colors px-4 py-2 text-sm font-medium"
              >
                Pricing
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-4">
          <ModeToggle />
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
