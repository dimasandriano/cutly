"use client";
import Link from "next/link";

import { useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { LoaderCircle, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import SignInModal from "~/components/modal/sign-in.modal";
import GithubIcon from "~/components/icon/github.icon";
import ProfilDropdownMenu from "~/components/dropdown-menu/profil.dropdown-menu";

export default function Home() {
  const { data: session, status } = useSession();
  const { setTheme } = useTheme();

  return (
    <main className="container min-h-screen max-w-5xl">
      <div className="flex items-center justify-between py-5">
        <h1 className="text-3xl font-bold">Cutly</h1>
        <div className="flex items-center space-x-2">
          <Button size="icon" variant="outline" asChild>
            <Link href="https://github.com/dimasandriano/cutly" target="_blank">
              <GithubIcon />
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {status === "loading" ? (
            <Button variant="outline" size="icon">
              <LoaderCircle className="animate-spin" />
            </Button>
          ) : session ? (
            <ProfilDropdownMenu />
          ) : (
            <SignInModal />
          )}
        </div>
      </div>
    </main>
  );
}
