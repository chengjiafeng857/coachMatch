import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Target, Calendar, TrendingUp } from "lucide-react";

interface ClientCardProps {
  client: {
    id: number;
    user: {
      firstName?: string;
      lastName?: string;
      email?: string;
      profileImageUrl?: string;
    };
    engagementLevel: string;
    lastSessionDate?: string;
    totalSessions?: number;
    goals?: string[];
  };
  onClick?: () => void;
}

export default function ClientCard({ client, onClick }: ClientCardProps) {
  const getEngagementColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-success text-white';
      case 'medium': return 'bg-warning text-white';
      case 'low': return 'bg-error text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getLastSessionText = (lastSession?: string) => {
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

  const getProgressIndicator = (engagementLevel: string) => {
    switch (engagementLevel) {
      case 'high': return { color: 'bg-success', text: 'Excellent Progress' };
      case 'medium': return { color: 'bg-warning', text: 'Good Progress' };
      case 'low': return { color: 'bg-error', text: 'Needs Attention' };
      default: return { color: 'bg-muted', text: 'Starting Out' };
    }
  };

  const fullName = client.user.firstName && client.user.lastName 
    ? `${client.user.firstName} ${client.user.lastName}`
    : client.user.email || 'Unnamed Client';

  const initials = client.user.firstName?.[0] || client.user.email?.[0] || 'C';
  const progress = getProgressIndicator(client.engagementLevel);

  return (
    <div 
      className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center space-x-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={client.user.profileImageUrl} alt={fullName} />
          <AvatarFallback className="bg-primary text-white">
            {initials.toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium text-foreground">{fullName}</p>
          <p className="text-sm text-muted-foreground">{getLastSessionText(client.lastSessionDate)}</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className={`h-3 w-3 ${progress.color} rounded-full`} title={progress.text}></div>
          <span className="text-sm text-muted-foreground hidden sm:inline">{progress.text}</span>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-sm font-medium text-foreground">{client.totalSessions || 0} sessions</p>
          <p className="text-sm text-muted-foreground">{client.goals?.length || 0} goals</p>
        </div>
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MessageSquare className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <TrendingUp className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
