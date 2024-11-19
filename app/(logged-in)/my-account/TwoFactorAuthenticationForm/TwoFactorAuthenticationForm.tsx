"use client";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { QRCodeSVG } from "qrcode.react";
import { FormEvent, useState } from "react";
import { get2factorSecret } from "./actions";

export default function TwoFactorAuthenticationForm({
  towFactorAuthenticated,
}: {
  towFactorAuthenticated: boolean;
}) {
  const { toast } = useToast();
  const [twoFactorActivated, setTwoFactorActivated] = useState<boolean>(
    towFactorAuthenticated
  );
  const [code, setCode] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<number>(1);
  console.log("step", currentStep);
  const handleClick = async () => {
    const response = await get2factorSecret();

    if (response.error) {
      toast({
        variant: "destructive",
        title: response.message,
      });
      return;
    }

    setCurrentStep(2);
    setCode(response.twoFactorSecret ?? "");
  };

  const handleOTPSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div>
      {!twoFactorActivated && (
        <div>
          {currentStep === 1 && (
            <Button onClick={handleClick}>
              Enable Two Factor Authentication
            </Button>
          )}
          {currentStep === 2 && (
            <div>
              <p className="text-muted-foreground text-sm py-2 ">
                Scan the QR code below with your Google authenticator app to
                activate two factor authentication
              </p>
              <QRCodeSVG value={code} />
              <Button className="my-2 w-full" onClick={() => setCurrentStep(3)}>
                I Have scanned the QR code
              </Button>
              <Button
                className="my-2 w-full"
                variant={"outline"}
                onClick={() => setCurrentStep(1)}
              >
                Cancel
              </Button>
            </div>
          )}
          {currentStep === 3 && (
            <form onSubmit={handleOTPSubmit} className="flex flex-col gap-2">
              <p className="text-xs text-muted-foreground">
                Please enter the 6 digit code from your authenticator app
              </p>
              <InputOTP maxLength={6}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <Button type="submit">Submit and Activate</Button>
              <Button onClick={() => setCurrentStep(1)} variant={"outline"}>
                Cancel
              </Button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
