import { auth } from "@/auth";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { db } from "@/db/drizzel";
import { users } from "@/db/usersSchema";
import { eq } from "drizzle-orm";
import TwoFactorAuthenticationForm from "./TwoFactorAuthenticationForm/TwoFactorAuthenticationForm";

export default async function MyAccount() {
  const session = await auth();

  const [user] = await db
    .select({
      twoFactorActivated: users.twoFactorActivated,
    })
    .from(users)
    .where(eq(users.id, session?.user?.id ? parseInt(session.user.id) : 0));

  return (
    <Card className="w-[350px]">
      <CardHeader>My Account</CardHeader>
      <CardContent>
        <Label>Email Address</Label>
        <div className="text-muted-foreground">{session?.user?.email}</div>
        <TwoFactorAuthenticationForm
          towFactorAuthenticated={user.twoFactorActivated ?? false}
        />
      </CardContent>
    </Card>
  );
}
