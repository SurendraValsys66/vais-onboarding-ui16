import { useState } from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Building2, MapPin, DollarSign, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import IntentSignalUnlockModal from "./IntentSignalUnlockModal";
import SignalStrengthIndicator from "./SignalStrengthIndicator";

interface IntentSignalData {
  compositeScore: number;
  deltaScore: number;
  matchedTopics: number;
  intentSignal: string;
  companyName: string;
  vais: number;
  revenue: string;
  city: string;
  relatedTopics: string[];
}

interface IntentSignalChartProps {
  data: IntentSignalData;
  className?: string;
}

const chartConfig = {
  compositeScore: {
    label: "Composite Score",
    color: "hsl(220, 70%, 50%)",
  },
  deltaScore: {
    label: "Delta Score",
    color: "hsl(120, 60%, 50%)",
  },
  matchedTopics: {
    label: "Matched Topics",
    color: "hsl(280, 70%, 55%)",
  },
};

// Generate sample time series data for the area chart
const generateChartData = (intentData: IntentSignalData) => {
  const baseData = [];
  const compositeBase = intentData.compositeScore;
  const deltaBase = intentData.deltaScore;
  const topicsBase = intentData.matchedTopics;

  // Generate 12 months of data with realistic variations
  for (let i = 0; i < 12; i++) {
    const variation = (Math.random() - 0.5) * 0.15; // 15% variation
    baseData.push({
      month: `Month ${i + 1}`,
      compositeScore: Math.max(
        0,
        Math.round(compositeBase + compositeBase * variation),
      ),
      deltaScore: Math.max(
        0,
        Math.round(deltaBase + deltaBase * variation * 100) / 100,
      ),
      matchedTopics: Math.max(
        0,
        Math.round(topicsBase + topicsBase * variation),
      ),
    });
  }
  return baseData;
};

const getIntentSignalColor = (signal: string) => {
  switch (signal) {
    case "Super Strong":
      return "bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 border border-emerald-300 shadow-sm hover:shadow-md";
    case "Very Strong":
      return "bg-gradient-to-r from-green-50 to-green-100 text-green-700 border border-green-300 shadow-sm hover:shadow-md";
    case "Strong":
      return "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-300 shadow-sm hover:shadow-md";
    case "Medium":
      return "bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700 border border-amber-300 shadow-sm hover:shadow-md";
    case "Weak":
      return "bg-gradient-to-r from-rose-50 to-rose-100 text-rose-700 border border-rose-300 shadow-sm hover:shadow-md";
    default:
      return "bg-gradient-to-r from-slate-50 to-slate-100 text-slate-700 border border-slate-300 shadow-sm hover:shadow-md";
  }
};

export default function IntentSignalChart({
  data,
  className,
}: IntentSignalChartProps) {
  const chartData = generateChartData(data);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [modalPosition, setModalPosition] = useState<
    { x: number; y: number } | undefined
  >();

  const handleBadgeHover = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setModalPosition({
      x: rect.right + 10,
      y: rect.top,
    });
    setShowUnlockModal(true);
  };

  const handleViewData = () => {
    setShowUnlockModal(false);
  };

  return (
    <>
      <div
        className={cn("cursor-pointer", className)}
        onMouseEnter={handleBadgeHover}
        onMouseLeave={() => setShowUnlockModal(false)}
      >
        <Badge
          className={cn(
            "font-semibold text-sm transition-all duration-200 flex items-center gap-1 px-2 py-1 rounded-lg w-fit",
            getIntentSignalColor(data.intentSignal),
          )}
        >
          <SignalStrengthIndicator strength={data.intentSignal} compact />
          <span>{data.intentSignal}</span>
        </Badge>
      </div>

      <IntentSignalUnlockModal
        isOpen={showUnlockModal}
        onClose={() => setShowUnlockModal(false)}
        onViewData={handleViewData}
        position={modalPosition}
      />
    </>
  );
}
