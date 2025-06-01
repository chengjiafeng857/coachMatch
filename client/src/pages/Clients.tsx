import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, MessageSquare, Target, Calendar } from "lucide-react";
import { useState } from "react";

export default function Clients() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

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

  const { data: clients = [], isLoading: clientsLoading } = useQuery({
    queryKey: ["/api/clients"],
    retry: false,
  });

  const filteredClients = clients.filter((client: any) => {
    const searchTerm = searchQuery.toLowerCase();
    const fullName = `${client.user.firstName || ''} ${client.user.lastName || ''}`.toLowerCase();
    return fullName.includes(searchTerm) || client.user.email?.toLowerCase().includes(searchTerm);
  });

  const getEngagementColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-success text-white';
      case 'medium': return 'bg-warning text-white';
      case 'low': return 'bg-error text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getLastSessionText = (lastSession: string | null) => {
    if (!lastSession) return 'No sessions yet';
    const date = new Date(lastSession);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Client Management</h1>
          <p className="text-muted-foreground">Manage your coaching clients and track their progress</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Add New Client
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search clients by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">All</Button>
          <Button variant="outline" size="sm">High Engagement</Button>
          <Button variant="outline" size="sm">Needs Attention</Button>
        </div>
      </div>

      {/* Client Grid */}
      {clientsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-muted rounded-full"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-3 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded w-5/6"></div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-muted rounded w-16"></div>
                    <div className="h-6 bg-muted rounded w-20"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="h-24 w-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {searchQuery ? 'No clients found' : 'No clients yet'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery 
                ? 'Try adjusting your search criteria'
                : 'Add your first client to start tracking their progress and collecting feedback'
              }
            </p>
            {!searchQuery && (
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Client
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client: any) => (
            <Card key={client.id} className="card-shadow hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-semibold">
                        {(client.user.firstName?.[0] || client.user.email?.[0] || 'C').toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <CardTitle className="text-base">
                        {client.user.firstName && client.user.lastName 
                          ? `${client.user.firstName} ${client.user.lastName}`
                          : client.user.email || 'Unnamed Client'
                        }
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {getLastSessionText(client.lastSessionDate)}
                      </p>
                    </div>
                  </div>
                  <Badge className={getEngagementColor(client.engagementLevel)}>
                    {client.engagementLevel}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Sessions:</span>
                    <span className="font-medium">{client.totalSessions || 0}</span>
                  </div>
                  
                  <div className="flex gap-2 flex-wrap">
                    {(() => {
                      // Convert goals to array if it's a string
                      const goalsArray = typeof client.goals === 'string' 
                        ? client.goals.split(',').map((g: string) => g.trim()).filter((g: string) => g.length > 0)
                        : Array.isArray(client.goals) 
                          ? client.goals 
                          : [];
                      
                      return (
                        <>
                          {goalsArray.slice(0, 2).map((goal: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {goal}
                            </Badge>
                          ))}
                          {goalsArray.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{goalsArray.length - 2} more
                            </Badge>
                          )}
                        </>
                      );
                    })()}
                  </div>

                  <div className="flex justify-between pt-3 border-t">
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Feedback
                    </Button>
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                      <Target className="h-4 w-4 mr-1" />
                      Progress
                    </Button>
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                      <Calendar className="h-4 w-4 mr-1" />
                      Schedule
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination would go here if needed */}
      {filteredClients.length > 12 && (
        <div className="flex justify-center mt-8">
          <Button variant="outline">Load More Clients</Button>
        </div>
      )}
    </div>
  );
}
