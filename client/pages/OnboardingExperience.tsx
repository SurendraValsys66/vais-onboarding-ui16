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
import { Baby, Gauge, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import OnboardingVideoLayout from "@/components/onboarding/OnboardingVideoLayout";

const LEVELS = [
  { label: "Beginner", icon: Baby },
  { label: "Intermediate", icon: Gauge },
  { label: "Advanced", icon: GraduationCap },
] as const;

export default function OnboardingExperience() {
  const navigate = useNavigate();
  const initial = getOnboarding();
  const [value, setValue] = useState<string>(initial.experience ?? "");

  const onNext = () => {
    if (!value) return;
    saveOnboarding({ experience: value as any });
    navigate("/onboarding/industry");
  };

  const onSkip = () => {
    const reminder = saveOnboardingSkipReminder({
      stepRoute: "/onboarding/experience",
      stepLabel: "Complete your experience details",
      stepNumber: 3,
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
      currentStep={3}
      content={
        <div className="space-y-8">
          <div>
            <div className="text-sm font-medium text-valasys-gray-700">
              A few more details
            </div>
            <StepProgress
              current={3}
              total={6}
              title="What is your level of experience in using sales tech?"
            />
          </div>
          <RadioGroup
            value={value}
            onValueChange={(v) => {
              setValue(v);
              if (v) saveOnboarding({ experience: v as any });
            }}
            className="space-y-3"
          >
            {LEVELS.map((lvl) => (
              <motion.div
                key={lvl.label}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.99 }}
              >
                <Label
                  htmlFor={`lvl-${lvl.label}`}
                  className={`flex items-center gap-3 rounded-lg border-2 p-4 cursor-pointer transition-all ${
                    value === lvl.label
                      ? "border-valasys-orange bg-valasys-orange/10 text-valasys-orange"
                      : "border-valasys-gray-200 hover:border-valasys-orange/40"
                  }`}
                >
                  <RadioGroupItem
                    id={`lvl-${lvl.label}`}
                    value={lvl.label}
                    className="h-5 w-5"
                  />
                  <lvl.icon className="h-5 w-5 text-valasys-orange flex-shrink-0" />
                  <span className="text-sm font-medium text-valasys-gray-900">
                    {lvl.label}
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
