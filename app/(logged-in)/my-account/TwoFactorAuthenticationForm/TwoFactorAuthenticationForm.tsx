"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function TwoFactorAuthenticationForm({
  towFactorAuthenticated,
}: {
  towFactorAuthenticated: boolean;
}) {
  const [twoFactorActivated, setTwoFactorActivated] = useState<boolean>(
    towFactorAuthenticated
  );
  const [currentStep, setCurrentStep] = useState<number>(1);

  const handleClick = () => {
    setCurrentStep(2);
  };

  return (
    <div>
      {!towFactorAuthenticated && (
        <div>
          {currentStep === 1 && (
            <Button onClick={handleClick}>
              Enable Two Factor Authentication
            </Button>
          )}
          {currentStep === 2 && <div>display qr code</div>}
        </div>
      )}
    </div>
  );
}
