"use client";
import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { signIn } from "next-auth/react";
import GoogleIcon from "~/components/icon/google.icon";

export default function SignInModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Sign In</Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader className="space-y-5">
          <DialogTitle>Sign In</DialogTitle>
          <DialogDescription>
            Sign in to your account to continue.
          </DialogDescription>
          <Button onClick={() => signIn("google")}>
            <GoogleIcon />
            Continue with Google
          </Button>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
