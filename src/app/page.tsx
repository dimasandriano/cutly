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
import { LoaderCircle, Moon, Scissors, Settings2, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import SignInModal from "~/components/modal/sign-in.modal";
import GithubIcon from "~/components/icon/github.icon";
import ProfilDropdownMenu from "~/components/dropdown-menu/profil.dropdown-menu";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";
import ShortLinkCard from "~/components/card/short-link.card";
import React from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const { setTheme } = useTheme();

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    api.link.getLink.useInfiniteQuery(
      {
        limit: 10,
      },
      {
        getNextPageParam: (lastpage) => lastpage.nextCursor,
      },
    );
  const links = React.useMemo(() => {
    return data?.pages?.flatMap((item) => item.data);
  }, [data]);

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
      <div className="mx-auto max-w-5xl space-y-10 py-5">
        <div className="space-y-3">
          <h1 className="text-center text-3xl font-semibold md:text-4xl">
            Free URL Shortener
          </h1>
          <h2 className="text-center text-xl font-medium text-muted-foreground md:text-2xl">
            Cutly is a free open source tool to generate short links
          </h2>
        </div>
        <div className="mx-auto flex max-w-md flex-col gap-5">
          <div className="flex items-center gap-2">
            <Input />
            <Button size="icon">
              <Scissors />
            </Button>
            <Button variant="secondary" size="icon">
              <Settings2 />
            </Button>
          </div>
          {session && isLoading ? (
            <span className="text-center">Loading...</span>
          ) : (
            <ShortLinkCard data={links} />
          )}
          {hasNextPage && (
            <Button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? "Loading..." : "Next Page"}
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}
