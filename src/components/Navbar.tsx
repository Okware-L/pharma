"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
//import { Icons } from "@/components/icons";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";

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
  return (
    <div className="navbar bg-gray-100 sm:px-20">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-gradient-to-r from-gray-100 to-gray-300 rounded-box w-52"
          >
            <li>
              <a>Consult</a>
            </li>
            <li>
              <a>Parent</a>
              <ul className="p-2">
                <li>
                  <a>Video</a>
                </li>
                <li>
                  <a>Chat</a>
                </li>
              </ul>
            </li>
            <li>
              <a>Pharmacy</a>
            </li>
          </ul>
        </div>
        <a href="/">
          <Image src="/jmlogoblack.svg" alt="img" width="84" height="54" />
        </a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Consult A Doctor</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <ListItem href="/" title="Video Consultation">
                    Live video calls with expoert physicians
                  </ListItem>
                  <ListItem href="/" title="Chat with a doctor">
                    Message with a doctor
                  </ListItem>
                  <ListItem href="/" title="Book Appointment">
                    Scedule a meeting with one of our highly esteemed doctors
                  </ListItem>
                  <ListItem href="/" title="Location specific">
                    Get connected to a doctor in your area.
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
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
        <a className="btn btn-ghost">Sign Up/ Sign In</a>
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
