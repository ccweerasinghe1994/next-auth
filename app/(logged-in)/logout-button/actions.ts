"use server";

import { signOut } from "@/auth";

export const logout = async () => {
  try {
    await signOut({ redirect: false });
  } catch (error) {
    console.error(error);
  }
};
