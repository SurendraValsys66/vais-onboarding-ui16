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
import { motion } from "framer-motion";
import OnboardingVideoLayout from "@/components/onboarding/OnboardingVideoLayout";
import {
  Factory,
  ShoppingBag,
  Laptop,
  Server,
  UtensilsCrossed,
  Stethoscope,
  Banknote,
  Sparkles,
} from "lucide-react";

type IndustryOption = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const INDUSTRY_OPTIONS: readonly IndustryOption[] = [
  { label: "Manufacturing", icon: Factory },
  { label: "Retail", icon: ShoppingBag },
  { label: "Software", icon: Laptop },
  { label: "IT", icon: Server },
  { label: "Hospitality", icon: UtensilsCrossed },
  { label: "Healthcare", icon: Stethoscope },
  { label: "Financial Services", icon: Banknote },
  { label: "Other", icon: Sparkles },
];

type IndustryValue = (typeof INDUSTRY_OPTIONS)[number]["label"];

export default function OnboardingIndustry() {
  const navigate = useNavigate();
  const initial = getOnboarding();
  const [value, setValue] = useState<IndustryValue | "">(
    (initial.targetIndustry as IndustryValue | "") ?? "",
  );

  const onNext = () => {
    if (!value) return;
    saveOnboarding({ targetIndustry: value });
    navigate("/onboarding/category");
  };

  const onSkip = () => {
    const reminder = saveOnboardingSkipReminder({
      stepRoute: "/onboarding/industry",
      stepLabel: "Select your target industry",
      stepNumber: 4,
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
      content={
        <div className="space-y-8">
          <div>
            <div className="text-sm font-medium text-valasys-gray-700">
              Almost there
            </div>
            <StepProgress
              current={4}
              total={6}
              title="What is your preferred target industry?"
            />
          </div>
          <RadioGroup
            value={value}
            onValueChange={(v) => {
              setValue(v as IndustryValue);
              if (v) {
                saveOnboarding({ targetIndustry: v as IndustryValue });
              }
            }}
            className="grid grid-cols-2 gap-3"
          >
            {INDUSTRY_OPTIONS.map((option) => (
              <motion.div
                key={option.label}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.99 }}
              >
                <Label
                  htmlFor={`industry-${option.label}`}
                  className={`flex items-center gap-2 rounded-lg border-2 p-3 cursor-pointer transition-all ${
                    value === option.label
                      ? "border-valasys-orange bg-valasys-orange/10 text-valasys-orange"
                      : "border-valasys-gray-200 hover:border-valasys-orange/40"
                  }`}
                >
                  <RadioGroupItem
                    id={`industry-${option.label}`}
                    value={option.label}
                    className="h-5 w-5"
                  />
                  <option.icon className="h-5 w-5 text-valasys-orange flex-shrink-0" />
                  <span className="text-sm font-medium text-valasys-gray-900">
                    {option.label}
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
