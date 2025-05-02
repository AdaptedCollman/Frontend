import React from "react";
import { Card, Typography, LinearProgress } from "@mui/material";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface SubjectCardProps {
  name: string;
  icon: React.ReactNode;
  level: string;
  progress: number;
  trend?: {
    value: number;
    direction: "up" | "down";
  };
  action: {
    label: string;
    onClick: () => void;
  };
}

const SubjectCard: React.FC<SubjectCardProps> = ({
  name,
  icon,
  level,
  progress,
  trend,
  action,
}) => {
  return (
    <Card className="p-6 h-full">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50">{icon}</div>
            <div>
              <Typography variant="h6" className="font-semibold text-gray-900">
                {name}
              </Typography>
              <Typography variant="body2" className="text-gray-500">
                {level}
              </Typography>
            </div>
          </div>
          {trend && (
            <div
              className={cn(
                "flex items-center gap-1",
                trend.direction === "up" ? "text-green-600" : "text-red-600"
              )}
            >
              {trend.direction === "up" ? (
                <TrendingUp size={16} />
              ) : (
                <TrendingDown size={16} />
              )}
              <span className="text-sm font-medium">{trend.value}%</span>
            </div>
          )}
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <Typography variant="body2" className="text-gray-600">
              Progress
            </Typography>
            <Typography variant="body2" className="font-medium">
              {progress}%
            </Typography>
          </div>
          <LinearProgress
            variant="determinate"
            value={progress}
            className="h-1.5 rounded-full"
            sx={{
              backgroundColor: "#E5E7EB",
              "& .MuiLinearProgress-bar": {
                backgroundColor: "#3461FF",
              },
            }}
          />
        </div>

        {/* Action Button */}
        <div className="mt-auto">
          <Button
            onClick={action.onClick}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {action.label}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default SubjectCard;
