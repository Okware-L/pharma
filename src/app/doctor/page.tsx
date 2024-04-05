import React from "react";
import { redirect } from "next/navigation";
import { checkRole } from "../../../utils/roles";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";

export default function page() {
  if (!checkRole("doctor")) {
    redirect("/");
  }

  return (
    <div className="w-screen min-h-screen absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-gray-100 to-gray-300 sm:px-40 px-5">
      <div className="">
        <h1>Doc ai</h1>
        <UserButton afterSignOutUrl="/" />
        <Button>Chat</Button>
      </div>
    </div>
  );
}
