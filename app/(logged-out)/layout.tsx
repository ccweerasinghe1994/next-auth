import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function LoggedOutLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  if (!!session?.user?.id) {
    redirect("/my-account");
  }

  return children;
}