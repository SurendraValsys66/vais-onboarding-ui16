import React, { useMemo, useState } from "react";
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
import OnboardingSplitLayout from "@/components/onboarding/OnboardingSplitLayout";
import OnboardingSummaryPanel from "@/components/onboarding/OnboardingSummaryPanel";
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

const GOALS = [
  { label: "Build accounts/prospects list" },
  { label: "Build and run campaigns" },
  { label: "Enrich CRM Data" },
] as const;

const EXPERIENCES = [
  { label: "Beginner" },
  { label: "Intermediate" },
  { label: "Advanced" },
] as const;

const INDUSTRIES = [
  { label: "Manufacturing" },
  { label: "Retail" },
  { label: "Software" },
  { label: "IT" },
  { label: "Hospitality" },
  { label: "Healthcare" },
  { label: "Financial Services" },
  { label: "Other" },
] as const;

const CATEGORIES = [
  { label: "Sales" },
  { label: "Marketing" },
  { label: "Software Development" },
  { label: "Customer Support" },
  { label: "HR Management" },
  { label: "Data Science" },
  { label: "Healthcare" },
  { label: "Other" },
] as const;

function PillOption({
  id,
  selected,
  children,
}: {
  id: string;
  selected: boolean;
  children: React.ReactNode;
}) {
  return (
    <Label
      htmlFor={id}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 cursor-pointer transition-colors text-sm",
        selected
          ? "border-valasys-blue bg-valasys-blue/10 text-valasys-blue"
          : "border-valasys-gray-200 hover:border-valasys-blue/60 text-valasys-gray-800",
      )}
    >
      {children}
    </Label>
  );
}

function QuestionCard({
  title,
  hint,
  children,
}: {
  title: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-valasys-gray-200 bg-white p-4 sm:p-5 shadow-sm">
      <div className="mb-2">
        <h3 className="text-sm font-semibold text-valasys-gray-900">{title}</h3>
        <p className="text-xs text-valasys-gray-600">{hint}</p>
      </div>
      {children}
    </div>
  );
}

export default function OnboardingRole() {
  const navigate = useNavigate();
  const initial = getOnboarding();

  const [role, setRole] = useState<string>(initial.role ?? "");
  const [useCase, setUseCase] = useState<string>(initial.useCase ?? "");
  const [experience, setExperience] = useState<string>(
    initial.experience ?? "",
  );
  const [targetIndustry, setTargetIndustry] = useState<string>(
    initial.targetIndustry ?? "",
  );
  const [vaisCategory, setVaisCategory] = useState<string>(
    initial.vaisCategory ?? "",
  );

  const total = 5;
  const answered = useMemo(
    () =>
      [role, useCase, experience, targetIndustry, vaisCategory].filter(Boolean)
        .length,
    [role, useCase, experience, targetIndustry, vaisCategory],
  );

  const onContinue = () => {
    if (answered < total) return;
    navigate("/");
  };

  const onSkip = () => {
    const reminder = saveOnboardingSkipReminder({
      stepRoute: "/onboarding/role",
      stepLabel: "Complete your onboarding",
      stepNumber: 1,
      totalSteps: total,
    });
    emitOnboardingSkipReminderUpdate(reminder);
    navigate("/");
  };

  return (
    <OnboardingSplitLayout
      logoSrc="https://cdn.builder.io/api/v1/image/assets%2Ff2a051d62a994479965d33c6eada9792%2F9b770886bd6142129584a6e279795c21?format=webp&width=800"
      left={
        <div className="space-y-6 mx-auto w-full">
          <div>
            <div className="text-sm font-medium text-valasys-gray-700">
              Welcome to VAIS
            </div>
            <StepProgress
              current={answered >= total ? total : Math.max(1, answered + 1)}
              total={total}
              title="Tell us about you"
              subtitle="Answer 5 quick questions — you can change these later."
            />
          </div>

          <div className="space-y-4">
            <QuestionCard
              title="Which role defines you best?"
              hint="Choose what best matches your daily role."
            >
              <RadioGroup
                value={role}
                onValueChange={(v) => {
                  setRole(v);
                  if (v) saveOnboarding({ role: v as any });
                }}
                className="flex flex-wrap gap-2"
              >
                {ROLES.map((r) => (
                  <motion.div
                    key={r.label}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <PillOption
                      id={`role-${r.label}`}
                      selected={role === r.label}
                    >
                      <RadioGroupItem
                        id={`role-${r.label}`}
                        value={r.label}
                        className="sr-only"
                      />
                      <r.icon className="h-4 w-4 text-valasys-blue" />
                      <span>{r.label}</span>
                    </PillOption>
                  </motion.div>
                ))}
              </RadioGroup>
            </QuestionCard>

            <QuestionCard
              title="What is your primary goal?"
              hint="Pick the objective you’re focusing on first."
            >
              <RadioGroup
                value={useCase}
                onValueChange={(v) => {
                  setUseCase(v);
                  if (v) saveOnboarding({ useCase: v as any });
                }}
                className="flex flex-wrap gap-2"
              >
                {GOALS.map((g) => (
                  <motion.div
                    key={g.label}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <PillOption
                      id={`goal-${g.label}`}
                      selected={useCase === g.label}
                    >
                      <RadioGroupItem
                        id={`goal-${g.label}`}
                        value={g.label}
                        className="sr-only"
                      />
                      <span className="text-valasys-blue">🎯</span>
                      <span>{g.label}</span>
                    </PillOption>
                  </motion.div>
                ))}
              </RadioGroup>
            </QuestionCard>

            <QuestionCard
              title="What’s your experience level?"
              hint="We’ll tailor guidance and defaults accordingly."
            >
              <RadioGroup
                value={experience}
                onValueChange={(v) => {
                  setExperience(v);
                  if (v) saveOnboarding({ experience: v as any });
                }}
                className="flex flex-wrap gap-2"
              >
                {EXPERIENCES.map((e) => (
                  <motion.div
                    key={e.label}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <PillOption
                      id={`exp-${e.label}`}
                      selected={experience === e.label}
                    >
                      <RadioGroupItem
                        id={`exp-${e.label}`}
                        value={e.label}
                        className="sr-only"
                      />
                      <span className="text-valasys-blue">⚡</span>
                      <span>{e.label}</span>
                    </PillOption>
                  </motion.div>
                ))}
              </RadioGroup>
            </QuestionCard>

            <QuestionCard
              title="Which industry are you targeting?"
              hint="Helps VAIS personalize insights and examples."
            >
              <RadioGroup
                value={targetIndustry}
                onValueChange={(v) => {
                  setTargetIndustry(v);
                  if (v) saveOnboarding({ targetIndustry: v as any });
                }}
                className="flex flex-wrap gap-2"
              >
                {INDUSTRIES.map((i) => (
                  <motion.div
                    key={i.label}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <PillOption
                      id={`ind-${i.label}`}
                      selected={targetIndustry === i.label}
                    >
                      <RadioGroupItem
                        id={`ind-${i.label}`}
                        value={i.label}
                        className="sr-only"
                      />
                      <span className="text-valasys-blue">🏭</span>
                      <span>{i.label}</span>
                    </PillOption>
                  </motion.div>
                ))}
              </RadioGroup>
            </QuestionCard>

            <QuestionCard
              title="What’s your product category?"
              hint="Improves search, prompts, and recommendations."
            >
              <RadioGroup
                value={vaisCategory}
                onValueChange={(v) => {
                  setVaisCategory(v);
                  if (v) saveOnboarding({ vaisCategory: v as any });
                }}
                className="flex flex-wrap gap-2"
              >
                {CATEGORIES.map((c) => (
                  <motion.div
                    key={c.label}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <PillOption
                      id={`cat-${c.label}`}
                      selected={vaisCategory === c.label}
                    >
                      <RadioGroupItem
                        id={`cat-${c.label}`}
                        value={c.label}
                        className="sr-only"
                      />
                      <span className="text-valasys-blue">💼</span>
                      <span>{c.label}</span>
                    </PillOption>
                  </motion.div>
                ))}
              </RadioGroup>
            </QuestionCard>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={onSkip}
              className="text-sm font-semibold text-valasys-gray-600 transition-colors hover:text-valasys-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-valasys-blue underline-offset-4 hover:underline"
            >
              Skip for now
            </button>
            <Button
              onClick={onContinue}
              disabled={answered < total}
              className="bg-valasys-blue hover:bg-valasys-blue/90 text-white"
            >
              Continue to Dashboard →
            </Button>
          </div>
        </div>
      }
      right={
        <OnboardingSummaryPanel
          values={{ role, useCase, experience, targetIndustry, vaisCategory }}
          total={total}
        />
      }
    />
  );
}
