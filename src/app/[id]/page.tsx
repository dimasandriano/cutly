import { type Metadata } from "next";
import { redirect } from "next/navigation";
import { api } from "~/trpc/server";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = (await params).id;
  const data = await api.link.getLinkByName({ name: id });
  console.log(data);
  return {
    title: data?.metaTitle,
    description: data?.metaDescription,
    openGraph: {
      images: data?.metaOgImage ? [data.metaOgImage] : [],
    },
    authors: data?.user?.name ? [{ name: data.user.name }] : [],
  };
}

export default async function Page({ params }: Props) {
  const id = (await params).id;
  const data = await api.link.getLinkByName({ name: id });

  if (!data) {
    return redirect("/");
  } else {
    return redirect(data.url);
  }
}
