import { number, string, z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { links } from "~/server/db/schema";
import Hashids from "hashids";
import { eq, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

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
        name: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const hashids = new Hashids(ctx.session.user.id);
      const generateName = hashids.encode(Math.floor(Date.now() / 1000));
      const name = input.name ?? generateName;
      const validateName = await ctx.db.query.links.findFirst({
        where: (links, { eq }) => eq(links.name, name),
      });
      if (validateName) {
        throw new TRPCError({ code: "CONFLICT", message: "Link sudah ada" });
      }
      const link = await ctx.db.insert(links).values({
        name: name,
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
  deleteLink: protectedProcedure
    .input(
      z.object({
        id: number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const link = await ctx.db.query.links.findFirst({
        where: (links, { eq }) => eq(links.id, input.id),
      });
      if (!link) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Link tidak ditemukan",
        });
      }
      if (link.createdById !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Tidak diizinkan untuk menghapus link ini",
        });
      }
      await ctx.db.delete(links).where(eq(links.id, input.id));
      return link;
    }),
  updateLink: protectedProcedure
    .input(
      z.object({
        id: number(),
        name: string().optional(),
        url: string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const linkToUpdate = await ctx.db.query.links.findFirst({
        where: (links, { eq }) => eq(links.id, input.id),
      });

      if (!linkToUpdate) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Link tidak ditemukan",
        });
      }

      if (linkToUpdate.createdById !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Tidak diizinkan untuk mengupdate link ini",
        });
      }
      if (input.name) {
        const findLink = await ctx.db.query.links.findFirst({
          where: (links, { eq }) => eq(links.name, input.name ?? ""),
        });
        if (findLink) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Kustom link sudah ada",
          });
        }
      }
      const link = await ctx.db
        .update(links)
        .set({ name: input.name, url: input.url })
        .where(eq(links.id, input.id))
        .returning();
      return link;
    }),
});
