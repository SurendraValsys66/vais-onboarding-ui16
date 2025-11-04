import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SummaryValues } from "./OnboardingSummaryPanel";

export default function OnboardingPersonalizationPanel({
  values,
  total,
}: {
  values: SummaryValues;
  total: number;
}) {
  const answered = Object.values(values).filter(Boolean).length;
  const percentage = Math.round((answered / total) * 100);

  const groups: { key: keyof SummaryValues; label: string }[] = [
    { key: "role", label: "Role" },
    { key: "useCase", label: "Goal" },
    { key: "experience", label: "Experience" },
    { key: "targetIndustry", label: "Industry" },
    { key: "vaisCategory", label: "Product Category" },
  ];

  return (
    <div className="rounded-xl border border-valasys-orange/20 bg-valasys-orange/5 p-5">
      <div className="flex items-start gap-3 mb-5">
        {/* Circular Progress Indicator */}
        <div className="relative flex-shrink-0 w-16 h-16">
          <svg className="w-full h-full" viewBox="0 0 80 80">
            {/* Background circle */}
            <circle
              cx="40"
              cy="40"
              r="36"
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="2"
            />
            {/* Progress circle */}
            <circle
              cx="40"
              cy="40"
              r="36"
              fill="none"
              stroke="#ff6b35"
              strokeWidth="2"
              strokeDasharray={`${(percentage / 100) * 226.2} 226.2`}
              strokeLinecap="round"
              className="transform -rotate-90 origin-center transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-xs font-semibold text-valasys-gray-900">
                {percentage}%
              </div>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="flex-1">
          <h3 className="text-base font-semibold text-valasys-gray-900">
            Personalization
          </h3>
          <p className="text-xs text-valasys-gray-600 mt-0.5">
            Answer questions to tailor your experience
          </p>
        </div>
      </div>

      {/* Data Grid */}
      <div className="space-y-2.5">
        {groups.map(({ key, label }) => {
          const v = values[key];
          return (
            <div key={key} className="flex justify-between items-center">
              <span className="text-xs text-valasys-gray-600">{label}</span>
              <AnimatePresence mode="wait">
                {v ? (
                  <motion.span
                    key={`${key}-${v}`}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.2 }}
                    className="text-xs font-semibold text-valasys-gray-900 text-right"
                  >
                    {v}
                  </motion.span>
                ) : (
                  <motion.span
                    key={`${key}-empty`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-xs text-valasys-gray-400"
                  >
                    —
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Tip */}
      <div className="mt-4 pt-4 border-t border-valasys-orange/10">
        <p className="text-xs text-valasys-gray-600">
          💡 You can change these later in Settings.
        </p>
      </div>
    </div>
  );
}
