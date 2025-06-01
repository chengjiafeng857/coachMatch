import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FeedbackModal from "@/components/FeedbackModal";
import { Search, Plus, Filter, MessageSquare, Globe, Clock, User } from "lucide-react";

export default function FeedbackCenter() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");

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

  const { data: feedback = [], isLoading: feedbackLoading } = useQuery({
    queryKey: ["/api/feedback"],
    retry: false,
  });

  const { data: clients = [] } = useQuery({
    queryKey: ["/api/clients"],
    retry: false,
  });

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-success text-white';
      case 'negative': return 'bg-error text-white';
      case 'neutral': return 'bg-warning text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'date': return '💕';
      case 'friend': return '👥';
      case 'family': return '👨‍👩‍👧‍👦';
      case 'colleague': return '💼';
      default: return '💬';
    }
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const feedbackDate = new Date(date);
    const diffTime = Math.abs(now.getTime() - feedbackDate.getTime());
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.ceil(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return feedbackDate.toLocaleDateString();
  };

  const filteredFeedback = feedback.filter((item: any) => {
    const matchesSearch = item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.client?.user?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.client?.user?.lastName?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedTab === 'all') return matchesSearch;
    if (selectedTab === 'unreviewed') return matchesSearch && !item.isReviewed;
    if (selectedTab === 'positive') return matchesSearch && item.sentiment === 'positive';
    if (selectedTab === 'needs-attention') return matchesSearch && item.sentiment === 'negative';
    
    return matchesSearch;
  });

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
          <h1 className="text-2xl font-semibold text-foreground">Feedback Center</h1>
          <p className="text-muted-foreground">Collect and review anonymous feedback from your clients' interactions</p>
        </div>
        <Button onClick={() => setShowFeedbackModal(true)} className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Request Feedback
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Feedback</p>
                <p className="text-2xl font-bold">{feedback.length}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Unreviewed</p>
                <p className="text-2xl font-bold">{feedback.filter((f: any) => !f.isReviewed).length}</p>
              </div>
              <Clock className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Positive</p>
                <p className="text-2xl font-bold">{feedback.filter((f: any) => f.sentiment === 'positive').length}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-success flex items-center justify-center text-white text-lg">
                😊
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Languages</p>
                <p className="text-2xl font-bold">{new Set(feedback.map((f: any) => f.originalLanguage)).size}</p>
              </div>
              <Globe className="h-8 w-8 text-primary-light" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search feedback content or client name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select defaultValue="recent">
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="positive">Most Positive</SelectItem>
              <SelectItem value="negative">Needs Attention</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Feedback Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Feedback</TabsTrigger>
          <TabsTrigger value="unreviewed">Unreviewed</TabsTrigger>
          <TabsTrigger value="positive">Positive</TabsTrigger>
          <TabsTrigger value="needs-attention">Needs Attention</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
          {feedbackLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-4">
                      <div className="h-10 w-10 bg-muted rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                        <div className="h-3 bg-muted rounded w-1/4"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredFeedback.length === 0 ? (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="h-24 w-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {searchQuery ? 'No feedback found' : 'No feedback yet'}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery 
                    ? 'Try adjusting your search criteria'
                    : 'Request feedback from your clients to start collecting insights'
                  }
                </p>
                {!searchQuery && (
                  <Button onClick={() => setShowFeedbackModal(true)} className="bg-primary hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Request First Feedback
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFeedback.map((item: any) => (
                <Card key={item.id} className="card-shadow hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl">{getSourceIcon(item.source)}</div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge className={getSentimentColor(item.sentiment)}>
                              {item.sentiment || 'neutral'}
                            </Badge>
                            <Badge variant="outline">{item.source}</Badge>
                            {item.originalLanguage !== 'en' && (
                              <Badge variant="secondary" className="flex items-center gap-1">
                                <Globe className="h-3 w-3" />
                                {item.originalLanguage?.toUpperCase()}
                              </Badge>
                            )}
                            {!item.isReviewed && (
                              <Badge variant="destructive">New</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            For: {item.client?.user?.firstName} {item.client?.user?.lastName} • 
                            {formatTimeAgo(item.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-muted/30 rounded-lg p-4 mb-4">
                      <p className="text-sm leading-relaxed">
                        {item.translatedContent || item.content}
                      </p>
                      {item.translatedContent && item.originalLanguage !== 'en' && (
                        <div className="mt-3 pt-3 border-t border-border">
                          <p className="text-xs text-muted-foreground mb-1">Original ({item.originalLanguage}):</p>
                          <p className="text-xs text-muted-foreground italic">
                            {item.content}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        {!item.isReviewed && (
                          <Button size="sm" className="bg-primary hover:bg-primary/90">
                            Mark as Reviewed
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          Add Coach Notes
                        </Button>
                      </div>
                      {item.sentimentScore && (
                        <div className="text-xs text-muted-foreground">
                          Confidence: {Math.round(item.sentimentScore * 100)}%
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Feedback Modal */}
      <FeedbackModal 
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        clients={clients}
      />
    </div>
  );
}
