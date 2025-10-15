import React from "react";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import ConfettiCanvas from "@/components/onboarding/ConfettiCanvas";
import { cn } from "@/lib/utils";

export type SummaryValues = {
  role?: string;
  useCase?: string;
  experience?: string;
  targetIndustry?: string;
  vaisCategory?: string;
};

const variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const emojiFor = (key: keyof SummaryValues, value?: string) => {
  if (!value) return "";
  switch (key) {
    case "role":
      return "👤";
    case "useCase":
      return "🎯";
    case "experience":
      return "⚡";
    case "targetIndustry":
      return "🏭";
    case "vaisCategory":
      return "💼";
    default:
      return "";
  }
};

export default function OnboardingSummaryPanel({
  values,
  total,
  className,
}: {
  values: SummaryValues;
  total: number;
  className?: string;
}) {
  const answered = Object.values(values).filter(Boolean).length;
  const complete = answered >= total;

  const groups: { key: keyof SummaryValues; label: string }[] = [
    { key: "role", label: "Role" },
    { key: "useCase", label: "Goal" },
    { key: "experience", label: "Experience" },
    { key: "targetIndustry", label: "Industry" },
    { key: "vaisCategory", label: "Product" },
  ];

  return (
    <div
      className={cn(
        "relative h-full w-full p-8 md:p-10",
        complete ? "glow" : "",
        className,
      )}
    >
      {complete ? (
        <div className="pointer-events-none absolute inset-0">
          <ConfettiCanvas mode="blast" />
        </div>
      ) : null}

      <div className="relative mx-auto h-full w-full max-w-xl">
        <div className="rounded-2xl bg-white/90 shadow-2xl ring-1 ring-valasys-blue/30 backdrop-blur p-6 md:p-7">
          <h3 className="text-lg font-semibold text-valasys-gray-900">
            Your VAIS Profile So Far
          </h3>
          <p className="mt-1 text-sm text-valasys-gray-600">
            {answered} of {total} steps complete {answered > 0 ? "✅" : ""}
          </p>

          <div className="mt-5 space-y-4">
            {groups.map(({ key, label }) => {
              const v = values[key];
              const has = Boolean(v);
              return (
                <div key={key}>
                  <div className="text-xs font-medium text-valasys-gray-500 mb-1.5">
                    {label}
                  </div>
                  <div className="min-h-8">
                    <AnimatePresence initial={false}>
                      {has ? (
                        <motion.div
                          key={`${key}-${v}`}
                          variants={variants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={{ duration: 0.18 }}
                        >
                          <Badge className="bg-valasys-blue text-white border-transparent shadow-sm">
                            <span className="mr-1.5">
                              {emojiFor(key, v as string)}
                            </span>
                            {v}
                          </Badge>
                        </motion.div>
                      ) : (
                        <div className="text-xs text-valasys-gray-400 italic">
                          Pending selection
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>

          {!complete ? (
            <div className="mt-6 rounded-xl border border-dashed border-valasys-blue/40 bg-valasys-blue/5 p-3 animate-pulse">
              <div className="text-xs text-valasys-gray-700">
                Make a choice on the left to see it appear here.
              </div>
            </div>
          ) : (
            <motion.div
              className="mt-6 rounded-xl border border-valasys-blue/40 bg-valasys-blue/5 p-4"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-sm text-valasys-gray-800">
                Awesome! You’re a {values.role} exploring {values.useCase} in
                the {values.targetIndustry} industry — VAIS is ready to
                personalize your experience.
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
