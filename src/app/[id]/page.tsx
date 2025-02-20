import { redirect } from "next/navigation";
import { api } from "~/trpc/server";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const id = (await params).id;
  const [data, link] = await Promise.all([
    await api.link.getLinkByName({ name: id }),
    await api.link.increaseClicks({ name: id }),
  ]);

  if (!data || !link) {
    return redirect("/");
  }
  redirect(data?.url);
}
