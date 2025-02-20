import { string, z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { links } from "~/server/db/schema";
import Hashids from "hashids";
import { eq, sql } from "drizzle-orm";

export const linkRouter = createTRPCRouter({
  getLink: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.number().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 10;
      const { cursor } = input;
      const offset = cursor ?? 0;
      const link = await ctx.db.query.links.findMany({
        where: (links, { eq }) => eq(links.createdById, ctx.session.user.id),
        limit: limit,
        offset: offset,
        orderBy: (links, { desc }) => desc(links.createdAt),
      });
      return {
        data: link,
        nextCursor: link.length < limit ? null : offset + limit,
      };
    }),
  createLink: protectedProcedure
    .input(
      z.object({
        url: z.string().url({
          message: "Masukkan url yang valid",
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const hashids = new Hashids(ctx.session.user.id);
      const link = await ctx.db.insert(links).values({
        name: hashids.encode(Math.floor(Date.now() / 1000)),
        url: input.url,
        createdById: ctx.session.user.id,
      });
      return link;
    }),
  getLinkByName: publicProcedure
    .input(
      z.object({
        name: string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const link = await ctx.db.query.links.findFirst({
        where: (links, { eq }) => eq(links.name, input.name),
        with: {
          user: true,
        },
      });
      return link;
    }),
  increaseClicks: publicProcedure
    .input(
      z.object({
        name: string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const link = await ctx.db
        .update(links)
        .set({ clicks: sql`${links.clicks} + 1` })
        .where(eq(links.name, input.name))
        .returning();
      return link;
    }),
});
