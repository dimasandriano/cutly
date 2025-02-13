import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

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
      });
      return {
        data: link,
        nextCursor: link.length < limit ? null : offset + limit,
      };
    }),
});
