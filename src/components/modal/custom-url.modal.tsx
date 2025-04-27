"use client";
import { Settings2 } from "lucide-react";
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
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "~/trpc/react";
import { toast } from "sonner";

export default function CustomUrlModal() {
  const [open, setOpen] = React.useState(false);
  const form = useForm({
    mode: "all",
    resolver: zodResolver(
      z.object({
        name: z
          .string()
          .min(5, "Minimal 5 karakter")
          .regex(/^[A-Za-z0-9-]+$/, {
            message:
              "Hanya boleh huruf besar/kecil, angka dan tanda hubung, contoh: Link-Ku",
          }),
        url: z.string().url({
          message: "Masukkan url yang valid",
        }),
      }),
    ),
    defaultValues: {
      name: "",
      url: "",
    },
  });
  const utils = api.useUtils();
  const { mutate: createLink, isPending } = api.link.createLink.useMutation({
    onSuccess: async () => {
      await utils.link.getLink.invalidate();
      form.reset();
      setOpen(false);
      toast.success("Link berhasil dibuat");
    },
    onError: ({ shape }) => {
      toast.error("Link gagal dibuat", { description: shape?.message });
    },
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="icon">
          <Settings2 />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader className="space-y-5">
          <DialogTitle>Custom URL</DialogTitle>
          <DialogDescription asChild>
            <div className="flex flex-col gap-3">
              <Form {...form}>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input placeholder="Enter your custom url" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input placeholder="Enter your link here" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Form>
              <div className="flex items-center justify-end gap-2">
                <Button
                  type="submit"
                  disabled={isPending || !form.formState.isValid}
                  onClick={() => createLink(form.getValues())}
                >
                  Simpan
                </Button>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
