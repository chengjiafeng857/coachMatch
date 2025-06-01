import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Globe, Clock } from "lucide-react";

interface RecentFeedbackProps {
  feedback: any[];
  isLoading: boolean;
  onError: (error: Error) => void;
}

export default function RecentFeedback({ feedback, isLoading, onError }: RecentFeedbackProps) {
  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-success';
      case 'negative': return 'bg-error';
      case 'neutral': return 'bg-warning';
      default: return 'bg-muted-foreground';
    }
  };

  const getSentimentEmoji = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'negative': return '😔';
      case 'neutral': return '😐';
      default: return '💬';
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

  const truncateText = (text: string, maxLength: number = 80) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Card className="card-shadow">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageSquare className="h-5 w-5 mr-2 primary-light" />
          Recent Feedback
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="border border-border rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-muted rounded-full mt-2"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : feedback.length === 0 ? (
          <div className="text-center py-8">
            <div className="h-12 w-12 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">No feedback yet</p>
            <p className="text-xs text-muted-foreground">Request feedback to start collecting insights</p>
          </div>
        ) : (
          <div className="space-y-4">
            {feedback.slice(0, 5).map((item: any) => (
              <div key={item.id} className="feedback-card border border-border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className={`w-2 h-2 ${getSentimentColor(item.sentiment)} rounded-full mt-2`}></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground">
                        "{truncateText(item.translatedContent || item.content)}"
                      </p>
                      <div className="mt-2 flex items-center space-x-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          {getSourceIcon(item.source)} {item.source}
                        </span>
                        <span>•</span>
                        <span>
                          {item.client?.user?.firstName} {item.client?.user?.lastName?.[0]}.
                        </span>
                        <span>•</span>
                        <span>{formatTimeAgo(item.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {item.originalLanguage !== 'en' && (
                      <>
                        <Globe className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {item.originalLanguage?.toUpperCase()}
                        </span>
                      </>
                    )}
                    {!item.isReviewed && (
                      <Badge variant="destructive" className="text-xs ml-2">
                        New
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            <div className="text-center mt-4">
              <Button variant="ghost" className="text-primary hover:text-primary/80 text-sm font-medium">
                View All Feedback →
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
