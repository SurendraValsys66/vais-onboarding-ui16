import { cn } from "@/lib/utils";

interface SignalStrengthIndicatorProps {
  strength: string;
  className?: string;
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
    case "Very Strong":
      return "bg-green-600";
    case "Strong":
      return "bg-blue-600";
    case "Medium":
      return "bg-orange-600";
    case "Weak":
      return "bg-red-600";
    default:
      return "bg-gray-400";
  }
};

export default function SignalStrengthIndicator({
  strength,
  className,
}: SignalStrengthIndicatorProps) {
  const filledBars = getSignalBars(strength);
  const color = getSignalColor(strength);
  const totalBars = 5;

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: totalBars }).map((_, index) => {
        const barHeight = `${16 + (index + 1) * 4}px`;
        const isFilled = index < filledBars;

        return (
          <div
            key={index}
            className={cn(
              "w-1.5 rounded-sm transition-all duration-200",
              isFilled ? color : "bg-gray-300",
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
