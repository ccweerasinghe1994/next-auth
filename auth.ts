import { compare } from "bcryptjs";
import { eq } from "drizzle-orm";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "./db/drizzel";
import { users } from "./db/usersSchema";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email as string));

        if (!user) {
          throw new Error("Invalid credentials");
        } else {
          const passwordCorrect = await compare(
            credentials.password as string,
            user.password!
          );
          if (!passwordCorrect) {
            throw new Error("Invalid credentials");
          }
        }

        return {
          id: user.id.toString(),
          email: user.email,
        };
      },
    }),
  ],
});
