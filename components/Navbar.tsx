"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, AlignLeft, User } from "lucide-react";
import React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth-provider";
import AuthButton from "./AuthButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase"; // Adjust this import based on your Firebase setup

const components: { title: string; href: string; description: string }[] = [
  {
    title: "About JM-Qafri Pharma",
    href: "/about",
    description: "Our mission, our vision and what makes us the best",
  },
  {
    title: "Membership",
    href: "/membership",
    description: "Unlock premium services by becoming a member",
  },
  {
    title: "Emergency Services",
    href: "/emergencies",
    description: "Air lift or get an ambulance near you, now.",
  },
  {
    title: "Our Stories",
    href: "/",
    description: "JM-Qafri catalogue",
  },
];

export default function Navbar() {
  const { user } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const ProfileButton = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src="/avatars/01.png"
              alt={user?.email || "User avatar"}
            />
            <AvatarFallback>
              {user?.email ? user.email.charAt(0).toUpperCase() : "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuItem asChild>
          <Link href="/patient">Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="navbar flex p-4 justify-between items-center bg-slate-50 sm:px-20 border-b border-sky-800">
      <div className="">
        <a href="/" className="hidden md:block">
          <Image src="/jmlogoblack.svg" alt="img" width="84" height="54" />
        </a>
        <div className="dropdown md:hidden">
          <Sheet>
            <SheetTrigger>
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost lg:hidden"
              >
                <AlignLeft />
              </div>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px]" side="left">
              <SheetHeader>
                <SheetTitle>
                  <h2 className="font-light text-xl text-left">
                    Select Service.
                  </h2>
                </SheetTitle>
                <SheetDescription>
                  <div className="text-slate-900 sm:flex mb-10 mt-3">
                    <div className="md:border-r border-b border-white p-3 flex mx-2 items-center ">
                      Emergency services
                      <ChevronRight />
                    </div>
                    <div className="md:border-r border-b border-white p-3 flex mx-2 items-center">
                      Symptom Checker
                      <ChevronRight />
                    </div>
                    <div className="md:border-r border-b border-white p-3 flex mx-2 items-center">
                      Pharmacy services & Technology
                      <ChevronRight />
                    </div>
                    <Link href="/docapply">
                      <div className="md:border-r border-b border-white p-3 flex mx-2 items-center">
                        For Physicians
                        <ChevronRight />
                      </div>
                    </Link>
                    <div className="p-3 md:border-r  border-b border-white flex mx-2 items-center">
                      Our Locations
                      <ChevronRight />
                    </div>
                    <div className="p-3 flex mx-2 items-center">
                      Education & Research
                      <ChevronRight />
                    </div>
                  </div>
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <div className=" lg:flex">
        <a href="/" className="md:hidden">
          <Image src="/jmwhite.svg" alt="img" width="84" height="54" />
        </a>
        <NavigationMenu className="hidden md:block">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>About</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                  {components.map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      href={component.href}
                    >
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/docs" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Pharmacy
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="https://jmqafri.com/careers" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Careers
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className="navbar-end">
        {user ? <ProfileButton /> : <AuthButton />}
      </div>
    </div>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
