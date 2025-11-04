import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StepProgress from "@/components/onboarding/StepProgress";
import {
  clearOnboarding,
  clearOnboardingSkipReminder,
  emitOnboardingSkipReminderUpdate,
  getOnboarding,
} from "@/lib/onboardingStorage";
import { useNavigate } from "react-router-dom";
import OnboardingVideoLayout from "@/components/onboarding/OnboardingVideoLayout";
import ConfettiCanvas from "@/components/onboarding/ConfettiCanvas";
import { CheckCircle2 } from "lucide-react";
import { markStepCompleted } from "@/lib/masteryStorage";

export default function OnboardingThankYou() {
  const navigate = useNavigate();
  const data = getOnboarding();

  const continueToApp = () => {
    markStepCompleted("onboardingCompleted");
    clearOnboarding();
    clearOnboardingSkipReminder();
    emitOnboardingSkipReminderUpdate(null);
    navigate("/");
  };

  return (
    <OnboardingVideoLayout
      logoSrc="https://cdn.builder.io/api/v1/image/assets%2Ff2a051d62a994479965d33c6eada9792%2F9b770886bd6142129584a6e279795c21?format=webp&width=800"
      summaryValues={data}
      summaryTotal={6}
      content={
        <div className="space-y-8">
          <div className="relative">
            <div className="absolute inset-0 pointer-events-none">
              <ConfettiCanvas mode="blast" />
            </div>
            <div>
              <div className="text-sm font-medium text-valasys-gray-700">
                You did it!
              </div>
              <StepProgress
                current={6}
                total={6}
                title="You're all set!"
                subtitle="We personalized your experience based on your answers."
              />
            </div>
          </div>

          <Card className="border-valasys-gray-200 bg-valasys-blue/5">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-valasys-gray-900">
                <CheckCircle2 className="h-5 w-5 text-valasys-green" /> Your
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-valasys-gray-800">
                {data.role ? (
                  <p>
                    <span className="text-valasys-gray-600">Role:</span>{" "}
                    {data.role}
                  </p>
                ) : null}
                {data.useCase ? (
                  <p>
                    <span className="text-valasys-gray-600">Primary goal:</span>{" "}
                    {data.useCase}
                  </p>
                ) : null}
                {data.experience ? (
                  <p>
                    <span className="text-valasys-gray-600">Experience:</span>{" "}
                    {data.experience}
                  </p>
                ) : null}
                {data.targetIndustry ? (
                  <p>
                    <span className="text-valasys-gray-600">
                      Target industry:
                    </span>{" "}
                    {data.targetIndustry}
                  </p>
                ) : null}
                {data.vaisCategory ? (
                  <p>
                    <span className="text-valasys-gray-600">
                      Product category:
                    </span>{" "}
                    {data.vaisCategory}
                  </p>
                ) : null}
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 pt-2">
            <Button
              onClick={continueToApp}
              className="bg-valasys-orange hover:bg-valasys-orange-light text-white"
            >
              Continue to Dashboard →
            </Button>
          </div>
        </div>
      }
    />
  );
}
