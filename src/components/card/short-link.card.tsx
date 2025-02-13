import React from "react";
import { Card, CardContent } from "~/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { generateFaviconFromUrl, timeAgo } from "~/lib/utils";
import Link from "next/link";
import { Copy, EllipsisVertical, Eye } from "lucide-react";
import { type LinkType } from "~/server/db/schema";
import { env } from "~/env";

type Props = {
  data?: LinkType[];
};

export default function ShortLinkCard({ data }: Props) {
  return (
    <>
      {data?.map((link, i) => (
        <Card key={i}>
          <CardContent className="flex items-stretch justify-between">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={generateFaviconFromUrl(link?.url ?? "")} />
                <AvatarFallback>SL</AvatarFallback>
              </Avatar>
              <div className="flex flex-col justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Link
                    href={env.NEXT_PUBLIC_BASE_URL + "/" + link?.name}
                    className="w-[168px] truncate text-sm font-medium"
                    target="_blank"
                  >
                    {env.NEXT_PUBLIC_BASE_URL + "/" + link?.name}
                  </Link>
                  <Copy size={14} strokeWidth={1} />
                  <div className="flex items-center gap-1">
                    <Eye size={14} strokeWidth={1} />
                    <p className="text-xs text-muted-foreground">
                      {link?.clicks ?? 0}
                    </p>
                  </div>
                </div>
                <Link
                  href={link?.url ?? ""}
                  className="w-[168px] truncate text-xs font-medium text-muted-foreground"
                  target="_blank"
                >
                  {link?.url}
                </Link>
              </div>
            </div>
            <div className="flex flex-col items-end justify-between">
              <EllipsisVertical size={14} strokeWidth={1} />
              <p className="text-xxs font-medium text-muted-foreground">
                {timeAgo(link.createdAt)}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
