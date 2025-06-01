import { Card, CardContent } from "@/components/ui/card";
import { Users, MessageSquare, Brain, TrendingUp, Target, Award, Clock } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export default function StatCard({ title, value, icon, color, subtitle, trend }: StatCardProps) {
  const getIcon = (iconName: string) => {
    const iconMap = {
      users: Users,
      feedback: MessageSquare,
      practice: Brain,
      trending: TrendingUp,
      target: Target,
      award: Award,
      clock: Clock,
    };
    
    const Icon = iconMap[iconName as keyof typeof iconMap] || Users;
    return Icon;
  };

  const getIconColor = (colorName: string) => {
    const colorMap = {
      primary: "text-primary",
      success: "text-success",
      warning: "text-warning",
      error: "text-error",
      "primary-light": "primary-light",
    };
    
    return colorMap[colorName as keyof typeof colorMap] || "text-primary";
  };

  const Icon = getIcon(icon);
  const iconColorClass = getIconColor(color);

  return (
    <Card className="card-shadow">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
            {trend && (
              <p className={`text-xs mt-1 ${trend.isPositive ? 'text-success' : 'text-error'}`}>
                {trend.isPositive ? '↗' : '↘'} {trend.value}
              </p>
            )}
          </div>
          <div className="flex-shrink-0">
            <Icon className={`h-8 w-8 ${iconColorClass}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
