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
import {
  Brain,
  Users,
  Building2,
  Target,
  UserCog,
  Headphones,
  Smile,
  UserRound,
} from "lucide-react";
import { motion } from "framer-motion";
import OnboardingVideoLayout from "@/components/onboarding/OnboardingVideoLayout";
import { cn } from "@/lib/utils";

const ROLES = [
  { label: "Founder", icon: Brain },
  { label: "Marketer", icon: Target },
  { label: "Business Development", icon: Building2 },
  { label: "Sales Leader", icon: Users },
  { label: "Talent Acquisition", icon: UserCog },
  { label: "Ops & Support", icon: Headphones },
  { label: "Customer Success", icon: Smile },
  { label: "Sales Representative", icon: UserRound },
] as const;

export default function OnboardingRole() {
  const navigate = useNavigate();
  const initial = getOnboarding();
  const [role, setRole] = useState<string>(initial.role ?? "");

  const onNext = () => {
    if (!role) return;
    saveOnboarding({ role });
    navigate("/onboarding/use-case");
  };

  const onSkip = () => {
    const reminder = saveOnboardingSkipReminder({
      stepRoute: "/onboarding/role",
      stepLabel: "Select your role",
      stepNumber: 1,
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
      currentStep={1}
      content={
        <div className="space-y-8">
          <div>
            <div className="text-sm font-medium text-valasys-gray-700">
              Welcome to VAIS
            </div>
            <StepProgress
              current={1}
              total={6}
              title="Which role defines you best?"
              subtitle="Choose what best matches your daily role."
            />
          </div>

          <RadioGroup
            value={role}
            onValueChange={(v) => {
              setRole(v);
              if (v) saveOnboarding({ role: v });
            }}
            className="grid grid-cols-2 gap-3"
          >
            {ROLES.map((r) => (
              <motion.div
                key={r.label}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.99 }}
              >
                <Label
                  htmlFor={`role-${r.label}`}
                  className={`flex items-center gap-2 rounded-lg border-2 p-3 cursor-pointer transition-all ${
                    role === r.label
                      ? "border-valasys-orange bg-valasys-orange/10 text-valasys-orange"
                      : "border-valasys-gray-200 hover:border-valasys-orange/40"
                  }`}
                >
                  <RadioGroupItem
                    id={`role-${r.label}`}
                    value={r.label}
                    className="h-5 w-5"
                  />
                  <r.icon className="h-5 w-5 text-valasys-orange flex-shrink-0" />
                  <span className="text-sm font-medium text-valasys-gray-900">
                    {r.label}
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
              disabled={!role}
              className="bg-valasys-blue hover:bg-valasys-blue/90 text-white"
            >
              Continue →
            </Button>
          </div>
        </div>
      }
    />
  );
}
