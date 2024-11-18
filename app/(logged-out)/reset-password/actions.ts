"use server";

import { auth } from "@/auth";
import { db } from "@/db/drizzel";
import { users } from "@/db/usersSchema";
import { randomBytes } from "crypto";
import { eq } from "drizzle-orm";

export const passwordReset = async ({ email }: { email: string }) => {
  const session = await auth();

  if (!!session?.user?.id) {
    return {
      error: true,
      message: "You are already logged in",
    };
  }

  const [user] = await db
    .select({
      id: users.id,
    })
    .from(users)
    .where(eq(users.email, email));

  if (!user) {
    return;
  }

  const passwordResetToken = randomBytes(32).toString("hex");

  console.log("passwordResetToken", passwordResetToken);
};
