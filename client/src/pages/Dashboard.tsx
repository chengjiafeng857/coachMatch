import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useAuth } from "@/hooks/useAuth";
import StatCard from "@/components/StatCard";
import PriorityAlerts from "@/components/PriorityAlerts";
import RecentFeedback from "@/components/RecentFeedback";
import QuickActions from "@/components/QuickActions";
import ClientCard from "@/components/ClientCard";
import FeedbackModal from "@/components/FeedbackModal";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Bell } from "lucide-react";
import { useState } from "react";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    retry: false,
  });

  const { data: clients = [], isLoading: clientsLoading } = useQuery({
    queryKey: ["/api/clients"],
    retry: false,
  });

  const { data: recentFeedback = [], isLoading: feedbackLoading } = useQuery({
    queryKey: ["/api/feedback?limit=5"],
    retry: false,
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ["/api/notifications?unread=true"],
    retry: false,
  });

  if (isLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleError = (error: Error) => {
    if (isUnauthorizedError(error)) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
    toast({
      title: "Error",
      description: "Something went wrong. Please try again.",
      variant: "destructive",
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-foreground">Coach Dashboard</h1>
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="p-2 text-muted-foreground hover:text-foreground relative">
            <Bell className="h-5 w-5" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-error text-white text-xs rounded-full flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </button>
          
          {/* Quick Actions */}
          <Button onClick={() => setShowFeedbackModal(true)} className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Request Feedback
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Active Clients"
          value={stats?.activeClients || 0}
          icon="users"
          color="primary"
        />
        <StatCard
          title="Feedback This Week"
          value={stats?.weeklyFeedback || 0}
          icon="feedback"
          color="success"
        />
        <StatCard
          title="Practice Sessions"
          value={stats?.practiceSessions || 0}
          icon="practice"
          color="warning"
        />
        <StatCard
          title="Avg. Progress"
          value={`${stats?.avgProgress || 0}%`}
          icon="trending"
          color="primary-light"
        />
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Client Progress Matrix */}
        <div className="lg:col-span-2">
          <div className="bg-card shadow rounded-lg card-shadow">
            <div className="px-6 py-4 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-card-foreground">Client Progress Overview</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Filter:</span>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Clients</SelectItem>
                      <SelectItem value="high">High Engagement</SelectItem>
                      <SelectItem value="medium">Medium Engagement</SelectItem>
                      <SelectItem value="low">Needs Attention</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="p-6">
              {clientsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="flex items-center space-x-4 p-4 bg-muted rounded-lg">
                        <div className="h-10 w-10 bg-muted-foreground/20 rounded-full"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-muted-foreground/20 rounded w-1/4"></div>
                          <div className="h-3 bg-muted-foreground/20 rounded w-1/3"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : clients.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No clients yet</p>
                  <Button variant="outline">Add Your First Client</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {clients.slice(0, 5).map((client: any) => (
                    <ClientCard key={client.id} client={client} />
                  ))}
                  {clients.length > 5 && (
                    <div className="text-center mt-6">
                      <Button variant="ghost" className="text-primary hover:text-primary/80">
                        View All Clients →
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <PriorityAlerts />
          <RecentFeedback 
            feedback={recentFeedback} 
            isLoading={feedbackLoading}
            onError={handleError}
          />
          <QuickActions />
        </div>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal 
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        clients={clients}
      />
    </div>
  );
}
