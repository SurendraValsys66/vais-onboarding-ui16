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
      return "bg-emerald-100 text-emerald-800 border border-emerald-200";
    case "Very Strong":
      return "bg-green-100 text-green-800 border border-green-200";
    case "Strong":
      return "bg-blue-100 text-blue-800 border border-blue-200";
    case "Medium":
      return "bg-orange-100 text-orange-800 border border-orange-200";
    case "Weak":
      return "bg-red-100 text-red-800 border border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border border-gray-200";
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
        className={cn("cursor-pointer flex items-center gap-2", className)}
        onMouseEnter={handleBadgeHover}
        onMouseLeave={() => setShowUnlockModal(false)}
      >
        <Badge
          className={cn(
            "font-medium hover:shadow-md transition-shadow",
            getIntentSignalColor(data.intentSignal),
          )}
        >
          {data.intentSignal}
        </Badge>
        <SignalStrengthIndicator strength={data.intentSignal} />
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
