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

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className={cn("cursor-pointer", className)}>
          <Badge
            className={cn(
              "font-medium hover:shadow-md transition-shadow",
              getIntentSignalColor(data.intentSignal),
            )}
          >
            {data.intentSignal}
          </Badge>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-[480px] p-4" side="right" align="start">
        <div className="space-y-4">
          {/* Company Header */}
          <div className="border-b pb-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-valasys-orange" />
                <h3 className="text-lg font-bold text-valasys-gray-900">
                  {data.companyName}
                </h3>
              </div>
              <Badge
                className={cn(
                  "text-xs",
                  getIntentSignalColor(data.intentSignal),
                )}
              >
                {data.intentSignal}
              </Badge>
            </div>
            <div className="flex items-center space-x-4 text-sm text-valasys-gray-600">
              <div className="flex items-center space-x-1">
                <Target className="w-3 h-3 text-valasys-orange" />
                <span>
                  VAIS:{" "}
                  <span className="font-semibold text-valasys-orange">
                    {data.vais.toFixed(1)}
                  </span>
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <DollarSign className="w-3 h-3 text-green-600" />
                <span>{data.revenue}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="w-3 h-3 text-blue-600" />
                <span>{data.city}</span>
              </div>
            </div>
          </div>

          <h4 className="text-sm font-semibold">Intent Signal Breakdown</h4>

          {/* Current Metrics */}
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
              <div className="text-blue-600 font-medium">Composite Score</div>
              <div className="text-xl font-bold text-blue-800">
                {data.compositeScore}
              </div>
              <div className="text-blue-500 text-xs">Base metric</div>
            </div>
            <div className="bg-green-50 p-3 rounded-md border border-green-200">
              <div className="text-green-600 font-medium">Delta Score</div>
              <div className="text-xl font-bold text-green-800">
                {data.deltaScore.toFixed(1)}
              </div>
              <div className="text-green-500 text-xs">Change rate</div>
            </div>
            <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200">
              <div className="text-yellow-600 font-medium">Topics</div>
              <div className="text-xl font-bold text-yellow-800">
                {data.matchedTopics}
              </div>
              <div className="text-yellow-500 text-xs">Matched count</div>
            </div>
          </div>

          {/* Spline Chart */}
          <div className="h-48">
            <ChartContainer config={chartConfig}>
              <LineChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 10,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="month"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis hide />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="compositeScore"
                  stroke={chartConfig.compositeScore.color}
                  strokeWidth={3}
                  dot={{
                    fill: chartConfig.compositeScore.color,
                    strokeWidth: 2,
                    r: 4,
                  }}
                  activeDot={{
                    r: 6,
                    stroke: chartConfig.compositeScore.color,
                    strokeWidth: 2,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="deltaScore"
                  stroke={chartConfig.deltaScore.color}
                  strokeWidth={3}
                  dot={{
                    fill: chartConfig.deltaScore.color,
                    strokeWidth: 2,
                    r: 4,
                  }}
                  activeDot={{
                    r: 6,
                    stroke: chartConfig.deltaScore.color,
                    strokeWidth: 2,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="matchedTopics"
                  stroke={chartConfig.matchedTopics.color}
                  strokeWidth={3}
                  dot={{
                    fill: chartConfig.matchedTopics.color,
                    strokeWidth: 2,
                    r: 4,
                  }}
                  activeDot={{
                    r: 6,
                    stroke: chartConfig.matchedTopics.color,
                    strokeWidth: 2,
                  }}
                />
              </LineChart>
            </ChartContainer>
          </div>

          {/* Related High Intent Topics */}
          <div className="border-t pt-3">
            <h5 className="text-sm font-semibold mb-2">
              Other High Intent Topics
            </h5>
            <div className="grid grid-cols-1 gap-2">
              {data.relatedTopics.map((topic, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                >
                  <span className="text-xs text-gray-700">{topic}</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-valasys-orange rounded-full"></div>
                    <span className="text-xs text-valasys-orange font-medium">
                      High
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-xs text-gray-500 border-t pt-2">
            📈 Spline chart analysis showing composite score, delta score, and
            matched topics trends over 12 months
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
