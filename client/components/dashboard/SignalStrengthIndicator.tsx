import { cn } from "@/lib/utils";

interface SignalStrengthIndicatorProps {
  strength: string;
  className?: string;
  compact?: boolean;
}

const getSignalBars = (strength: string): number => {
  switch (strength) {
    case "Super Strong":
      return 5;
    case "Very Strong":
      return 5;
    case "Strong":
      return 3;
    case "Medium":
      return 2;
    case "Weak":
      return 1;
    default:
      return 0;
  }
};

const getSignalColor = (strength: string): string => {
  switch (strength) {
    case "Super Strong":
      return "bg-emerald-700";
    case "Very Strong":
      return "bg-green-700";
    case "Strong":
      return "bg-blue-700";
    case "Medium":
      return "bg-amber-700";
    case "Weak":
      return "bg-rose-700";
    default:
      return "bg-slate-500";
  }
};

export default function SignalStrengthIndicator({
  strength,
  className,
  compact = false,
}: SignalStrengthIndicatorProps) {
  const filledBars = getSignalBars(strength);
  const color = getSignalColor(strength);
  const totalBars = 5;

  if (compact) {
    return (
      <div className={cn("flex items-end gap-0.5", className)}>
        {Array.from({ length: totalBars }).map((_, index) => {
          const isFilled = index < filledBars;
          // Compact bar heights: 4px, 6px, 8px, 10px, 12px
          const barHeight = `${4 + (index + 1) * 2}px`;

          return (
            <div
              key={index}
              className={cn(
                "w-1 rounded-full transition-all duration-200",
                isFilled ? color : "bg-black/15",
              )}
              style={{
                height: barHeight,
              }}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn("flex items-end gap-1", className)}>
      {Array.from({ length: totalBars }).map((_, index) => {
        const isFilled = index < filledBars;
        // Bar heights: 8px, 16px, 24px, 32px, 40px
        const barHeight = `${8 + (index + 1) * 8}px`;

        return (
          <div
            key={index}
            className={cn(
              "w-2 rounded-full transition-all duration-200",
              isFilled ? color : "bg-black/10",
            )}
            style={{
              height: barHeight,
            }}
          />
        );
      })}
    </div>
  );
}
