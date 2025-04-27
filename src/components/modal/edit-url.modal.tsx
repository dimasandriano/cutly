"use client";
import { EllipsisVertical } from "lucide-react";
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

export default function EditUrlModal({ name }: { name: string }) {
  const [open, setOpen] = React.useState(false);
  const { data } = api.link.getLinkByName.useQuery(
    { name: name },
    {
      enabled: open,
    },
  );
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
      name: data?.name ?? "",
      url: data?.url ?? "",
    },
  });
  React.useEffect(() => {
    form.setValue("name", data?.name ?? "");
    form.setValue("url", data?.url ?? "");
  }, [data, form]);

  const utils = api.useUtils();
  const { mutate: updateLink, isPending } = api.link.updateLink.useMutation({
    onSuccess: async () => {
      await utils.link.getLink.invalidate();
      setOpen(false);
      toast.success("Link berhasil diupdate");
    },
    onError: ({ shape }) => {
      toast.error("Link gagal diupdate", { description: shape?.message });
    },
  });

  const { mutate: deleteLink, isPending: isPendingDelete } =
    api.link.deleteLink.useMutation({
      onSuccess: async () => {
        await utils.link.getLink.invalidate();
        setOpen(false);
        toast.success("Link berhasil dihapus");
      },
      onError: ({ shape }) => {
        toast.error("Link gagal dihapus", { description: shape?.message });
      },
    });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <EllipsisVertical size={14} strokeWidth={1} />
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader className="space-y-5">
          <DialogTitle>Edit URL</DialogTitle>
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
              <div className="flex items-center justify-between gap-2">
                <Button
                  type="submit"
                  disabled={isPendingDelete || isPending || !data}
                  variant="destructive"
                  onClick={() =>
                    deleteLink({
                      id: data?.id ?? 0,
                    })
                  }
                >
                  Delete
                </Button>
                <Button
                  type="submit"
                  disabled={
                    isPending ||
                    !form.formState.isValid ||
                    isPendingDelete ||
                    !data
                  }
                  onClick={() =>
                    updateLink({
                      id: data?.id ?? 0,
                      name:
                        form.getValues("name") == data?.name
                          ? undefined
                          : form.getValues("name"),
                      url: form.getValues("url"),
                    })
                  }
                >
                  Save
                </Button>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
