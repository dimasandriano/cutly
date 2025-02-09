"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { signOut, useSession } from "next-auth/react";
import { LogOut, User } from "lucide-react";

export default function ProfilDropdownMenu() {
  const { data: session } = useSession();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarImage src={session?.user?.image ?? ""} />
          <AvatarFallback>{session?.user?.name}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={session?.user?.image ?? ""} />
            <AvatarFallback>{session?.user?.name}</AvatarFallback>
          </Avatar>
          <div>
            <p className="truncate font-semibold leading-none">
              {session?.user?.name}
            </p>
            <p className="text-muted-foreground truncate text-sm">
              {session?.user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User /> Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
