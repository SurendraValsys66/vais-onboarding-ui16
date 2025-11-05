import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import StepProgress from "@/components/onboarding/StepProgress";
import {
  saveOnboarding,
  getOnboarding,
  saveOnboardingSkipReminder,
  emitOnboardingSkipReminderUpdate,
} from "@/lib/onboardingStorage";
import { useNavigate } from "react-router-dom";
import { ListChecks, Rocket, Database } from "lucide-react";
import { motion } from "framer-motion";
import OnboardingVideoLayout from "@/components/onboarding/OnboardingVideoLayout";

const OPTIONS = [
  { label: "Build accounts/prospects list", icon: ListChecks },
  { label: "Build and run campaigns", icon: Rocket },
  { label: "Enrich CRM Data", icon: Database },
] as const;

export default function OnboardingUseCase() {
  const navigate = useNavigate();
  const initial = getOnboarding();
  const [value, setValue] = useState<string>(initial.useCase ?? "");

  const onNext = () => {
    if (!value) return;
    saveOnboarding({ useCase: value as any });
    navigate("/onboarding/experience");
  };

  const onSkip = () => {
    const reminder = saveOnboardingSkipReminder({
      stepRoute: "/onboarding/use-case",
      stepLabel: "Tell us your primary goal",
      stepNumber: 2,
      totalSteps: 6,
    });
    emitOnboardingSkipReminderUpdate(reminder);
    navigate("/");
  };

  return (
    <OnboardingVideoLayout
      logoSrc="https://cdn.builder.io/api/v1/image/assets%2Ff2a051d62a994479965d33c6eada9792%2F9b770886bd6142129584a6e279795c21?format=webp&width=800"
      summaryValues={initial}
      summaryTotal={6}
      currentStep={2}
      content={
        <div className="space-y-8">
          <div>
            <div className="text-sm font-medium text-valasys-gray-700">
              Getting to know you
            </div>
            <StepProgress
              current={2}
              total={6}
              title="What would you like to use VAIS for?"
            />
          </div>
          <RadioGroup
            value={value}
            onValueChange={(v) => {
              setValue(v);
              if (v) saveOnboarding({ useCase: v as any });
            }}
            className="space-y-3"
          >
            {OPTIONS.map((opt) => (
              <motion.div
                key={opt.label}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.99 }}
              >
                <Label
                  htmlFor={`usecase-${opt.label}`}
                  className={`flex items-center gap-3 rounded-lg border-2 p-4 cursor-pointer transition-all ${
                    value === opt.label
                      ? "border-valasys-orange bg-valasys-orange/10 text-valasys-orange"
                      : "border-valasys-gray-200 hover:border-valasys-orange/40"
                  }`}
                >
                  <RadioGroupItem
                    id={`usecase-${opt.label}`}
                    value={opt.label}
                    className="h-5 w-5"
                  />
                  <opt.icon className="h-5 w-5 text-valasys-orange flex-shrink-0" />
                  <span className="text-sm font-medium text-valasys-gray-900">
                    {opt.label}
                  </span>
                </Label>
              </motion.div>
            ))}
          </RadioGroup>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4">
            <button
              type="button"
              onClick={onSkip}
              className="text-sm font-semibold text-valasys-gray-600 transition-colors hover:text-valasys-orange focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-valasys-orange underline-offset-4 hover:underline"
            >
              Skip for now
            </button>
            <Button
              onClick={onNext}
              disabled={!value}
              className="bg-valasys-orange hover:bg-valasys-orange-light text-white"
            >
              Continue →
            </Button>
          </div>
        </div>
      }
    />
  );
}
