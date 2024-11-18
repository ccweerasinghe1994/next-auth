import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db/drizzel";
import { passwordResetTokens } from "@/db/passwordResetTokensSchema";
import { eq } from "drizzle-orm";
import Link from "next/link";

export default async function UpdatePasswordPage({
  searchParams,
}: {
  searchParams: {
    token?: string;
  };
}) {
  let tokenIsValid = false;
  const { token } = searchParams;

  if (token) {
    const [passwordResetToken] = await db
      .select()
      .from(passwordResetTokens)
      .where(eq(passwordResetTokens.token, token));

    const now = Date.now();
    if (
      !!passwordResetToken?.tokenExpiry &&
      passwordResetToken.tokenExpiry.getTime() > now
    ) {
      tokenIsValid = true;
    }

    // Check if token is valid
  }
  return (
    <main className="min-h-screen flex justify-center items-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>
            {tokenIsValid
              ? "Update Password"
              : "Your password reset link is invalid or expired"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tokenIsValid ? (
            <div> password update form</div>
          ) : (
            <Link className="underline" href={"/reset-password"}>
              {" "}
              Request another password reset link{" "}
            </Link>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
