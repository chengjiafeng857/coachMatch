import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Target, Download, Plus, MessageSquare, Users } from "lucide-react";

export default function QuickActions() {
  const actions = [
    {
      icon: Calendar,
      label: "Schedule Session",
      description: "Book a coaching session",
      onClick: () => alert("Opening session scheduler..."),
    },
    {
      icon: Target,
      label: "Assign Practice",
      description: "Set practice scenarios",
      onClick: () => alert("Opening practice assignment..."),
    },
    {
      icon: Download,
      label: "Export Reports",
      description: "Download client reports",
      onClick: () => alert("Generating reports..."),
    },
    {
      icon: Plus,
      label: "Add Client",
      description: "Onboard new client",
      onClick: () => alert("Opening client onboarding..."),
    },
    {
      icon: MessageSquare,
      label: "Send Check-in",
      description: "Automated client check-in",
      onClick: () => alert("Sending check-in..."),
    },
    {
      icon: Users,
      label: "Team Meeting",
      description: "Schedule team session",
      onClick: () => alert("Opening team scheduler..."),
    },
  ];

  return (
    <Card className="card-shadow">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Button
              key={index}
              variant="outline"
              className="w-full justify-start h-auto p-3 text-left"
              onClick={action.onClick}
            >
              <div className="flex items-center space-x-3">
                <Icon className="h-4 w-4 text-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{action.label}</p>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
              </div>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}
