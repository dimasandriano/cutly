"use client";
import { Calendar, Link, User } from "lucide-react";
import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog";
import { api } from "~/trpc/react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { format } from "date-fns";

export default function ProfileModal() {
  const { data } = api.auth.getProfile.useQuery();

  return (
    <Dialog>
      <DialogTrigger className="flex w-full items-center gap-2">
        <User size={16} /> Profile
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-10">
              <div className="flex flex-col items-center gap-3">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={data?.user?.image ?? ""} />
                  <AvatarFallback>{data?.user?.name}</AvatarFallback>
                </Avatar>
                <div className="text-center *:leading-tight">
                  <h3 className="text-base font-semibold text-foreground">
                    {data?.user?.name}
                  </h3>
                  <p>{data?.user?.email}</p>
                </div>
              </div>
              <div className="space-y-3 px-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Link size={14} /> Total created links
                  </div>
                  <span className="text-foreground">{data?.link?.count}</span>
                </div>
                <hr />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} /> Joined
                  </div>
                  {data?.user?.createdAt && (
                    <span className="text-foreground">
                      {format(
                        new Date(data?.user?.createdAt),
                        "EEEE, MMMM d, yyyy",
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
