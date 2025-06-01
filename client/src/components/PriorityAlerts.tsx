import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, MessageSquare, Target } from "lucide-react";

export default function PriorityAlerts() {
  const { data: notifications = [] } = useQuery({
    queryKey: ["/api/notifications?unread=true"],
    retry: false,
  });

  const { data: clients = [] } = useQuery({
    queryKey: ["/api/clients"],
    retry: false,
  });

  // Generate priority alerts based on data
  const generateAlerts = () => {
    const alerts = [];

    // Check for inactive clients
    const inactiveClients = clients.filter((client: any) => {
      if (!client.lastSessionDate) return true;
      const daysSinceLastSession = Math.floor(
        (Date.now() - new Date(client.lastSessionDate).getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysSinceLastSession >= 7;
    });

    if (inactiveClients.length > 0) {
      alerts.push({
        id: 'inactive-clients',
        type: 'warning',
        title: `${inactiveClients.length} client${inactiveClients.length > 1 ? 's' : ''} haven't practiced recently`,
        description: `${inactiveClients[0]?.user?.firstName || 'Client'} and others need engagement`,
        action: 'Send Reminder',
        icon: Clock,
      });
    }

    // Check for unreviewed feedback
    const unreadNotifications = notifications.filter((n: any) => n.type === 'feedback_received');
    if (unreadNotifications.length > 0) {
      alerts.push({
        id: 'unreviewed-feedback',
        type: 'info',
        title: 'New feedback requires review',
        description: `${unreadNotifications.length} new feedback submission${unreadNotifications.length > 1 ? 's' : ''}`,
        action: 'Review Now',
        icon: MessageSquare,
      });
    }

    // Check for clients with low engagement
    const lowEngagementClients = clients.filter((client: any) => client.engagementLevel === 'low');
    if (lowEngagementClients.length > 0) {
      alerts.push({
        id: 'low-engagement',
        type: 'error',
        title: 'Clients need attention',
        description: `${lowEngagementClients.length} client${lowEngagementClients.length > 1 ? 's' : ''} with low engagement`,
        action: 'View Details',
        icon: Target,
      });
    }

    return alerts.slice(0, 3); // Show max 3 alerts
  };

  const alerts = generateAlerts();

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'error': return 'bg-red-50 dark:bg-red-950/20';
      case 'warning': return 'bg-yellow-50 dark:bg-yellow-950/20';
      case 'info': return 'bg-blue-50 dark:bg-blue-950/20';
      default: return 'bg-muted/50';
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'error': return 'text-error';
      case 'warning': return 'text-warning';
      case 'info': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <Card className="card-shadow">
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-error" />
          Priority Alerts
          {alerts.length > 0 && (
            <Badge variant="destructive" className="ml-2">
              {alerts.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <div className="h-12 w-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Target className="h-6 w-6 text-success" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">All caught up!</p>
            <p className="text-xs text-muted-foreground">No urgent alerts at the moment</p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => {
              const Icon = alert.icon;
              return (
                <div
                  key={alert.id}
                  className={`flex items-start space-x-3 p-3 rounded-lg ${getAlertColor(alert.type)}`}
                >
                  <div className="flex-shrink-0">
                    <Icon className={`h-4 w-4 mt-0.5 ${getIconColor(alert.type)}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{alert.title}</p>
                    <p className="text-sm text-muted-foreground">{alert.description}</p>
                    <div className="mt-2">
                      <Button 
                        size="sm" 
                        className="text-xs bg-primary text-white hover:bg-primary/90 h-7 px-3"
                      >
                        {alert.action}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
