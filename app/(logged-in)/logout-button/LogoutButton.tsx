"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { logout } from "./actions";

export default function LogoutButton() {
  const router = useRouter();
  return (
    <Button
      size={"sm"}
      onClick={async () => {
        await logout();
        router.push("/login");
      }}
    >
      Logout
    </Button>
  );
}
