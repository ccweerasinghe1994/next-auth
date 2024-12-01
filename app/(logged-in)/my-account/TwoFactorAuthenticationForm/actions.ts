"use server";

import { auth } from "@/auth";
import { db } from "@/db/drizzel";
import { users } from "@/db/usersSchema";
import { eq } from "drizzle-orm";
import { authenticator } from "otplib";
export const get2factorSecret = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      error: true,
      message: "You are not logged in",
    };
  }

  const [user] = await db
    .select({
      twoFactorSecret: users.twoFactorSecret,
    })
    .from(users)
    .where(eq(users.id, parseInt(session.user.id)));

  if (!user) {
    return {
      error: true,
      message: "User not found",
    };
  }

  let twoFactorSecret = user.twoFactorSecret;

  if (!twoFactorSecret) {
    twoFactorSecret = authenticator.generate(process.env.TWO_FACTOR_SECRET!);

    try {
      const isValid = authenticator.check(
        twoFactorSecret,
        process.env.TWO_FACTOR_SECRET!
      );
      console.log("isValid", isValid);
    } catch (error) {
      console.error(error);
    }

    await db
      .update(users)
      .set({ twoFactorSecret })
      .where(eq(users.id, parseInt(session.user.id)));
  }

  return {
    twoFactorSecret: authenticator.keyuri(
      session.user.email ?? "",
      "NextAuth",
      twoFactorSecret
    ),
  };
};

export const enable2factor = async (token: string) => {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      error: true,
      message: "You are not logged in",
    };
  }
  const [user] = await db
    .select({
      twoFactorSecret: users.twoFactorSecret,
    })
    .from(users)
    .where(eq(users.id, parseInt(session.user.id)));

  if (!user) {
    return {
      error: true,
      message: "User not found",
    };
  }

  if (user.twoFactorSecret) {
    const isValidToken = authenticator.check(token, user.twoFactorSecret);

    if (!isValidToken) {
      return {
        error: true,
        message: "Invalid OTP",
      };
    }

    await db
      .update(users)
      .set({ twoFactorActivated: true })
      .where(eq(users.id, parseInt(session.user.id)));
  }
};


export const disable2factor = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      error: true,
      message: "You are not logged in",
    };
  }

  await db
    .update(users)
    .set({ twoFactorActivated: false })
    .where(eq(users.id, parseInt(session.user.id)));
};