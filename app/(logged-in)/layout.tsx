import Link from "next/link";
import React from "react";
import LogoutButton from "./logout-button/LogoutButton";

export default function LoggedInLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-gray-200 flex justify-between items-center p-4">
        <ul className="flex gap-4">
          <li>
            <Link href={"/my-account"}>My Account</Link>
          </li>
          <li>
            <Link href={"/change-password"}>Change Password</Link>
          </li>
        </ul>
        <div className="">
          <LogoutButton />
        </div>
      </nav>
      <div className="flex-1 flex justify-center items-center">{children}</div>
    </div>
  );
}
