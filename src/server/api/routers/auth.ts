import { count, eq } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { links } from "~/server/db/schema";

export const authRouter = createTRPCRouter({
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, ctx.session.user.id),
    });
    const linksCount = await ctx.db
      .select({
        count: count(),
      })
      .from(links)
      .where(eq(links.createdById, ctx.session.user.id));
    return { user, link: linksCount[0] };
  }),
});
