import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, Users, MessageSquare, Target, Download, Calendar, Filter } from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  BarChart,
  Bar 
} from 'recharts';

interface Client {
  id: string;
  user: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  totalSessions: number;
  engagementLevel: string;
  lastSessionDate?: string;
  progress: number;
}

interface Feedback {
  id: string;
  clientId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface DashboardStats {
  activeClients: number;
  weeklyFeedback: number;
  practiceSessions: number;
  avgProgress: number;
}

export default function Analytics() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState("30d");

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

  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
    retry: false,
  });

  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
    retry: false,
  });

  const { data: feedback = [] } = useQuery<Feedback[]>({
    queryKey: ["/api/feedback"],
    retry: false,
  });

  const generateProgressData = () => {
    const data = [];
    const today = new Date();
    const skills = ['Dating Confidence', 'Communication Skills', 'Emotional Intelligence'];
    
    // Generate data for the last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today);
      date.setMonth(date.getMonth() - i);
      
      const monthData = {
        month: date.toLocaleString('default', { month: 'short' }),
        'Dating Confidence': Math.round(60 + Math.random() * 20),
        'Communication Skills': Math.round(55 + Math.random() * 25),
        'Emotional Intelligence': Math.round(50 + Math.random() * 30),
      };
      
      data.push(monthData);
    }
    
    return data;
  };

  const generateFeedbackVolumeData = () => {
    const data = [];
    const today = new Date();
    
    // Generate data for the last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today);
      date.setMonth(date.getMonth() - i);
      
      const monthData = {
        month: date.toLocaleString('default', { month: 'short' }),
        'Dating Partners': Math.floor(Math.random() * 15) + 5,
        'Friends': Math.floor(Math.random() * 10) + 3,
        'Family': Math.floor(Math.random() * 8) + 2,
        'Colleagues': Math.floor(Math.random() * 5) + 1,
      };
      
      data.push(monthData);
    }
    
    return data;
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
          <h1 className="text-2xl font-semibold text-foreground">Analytics & Reports</h1>
          <p className="text-muted-foreground">Track client progress, feedback trends, and coaching effectiveness</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Client Retention</p>
                <p className="text-2xl font-bold">94%</p>
                <p className="text-xs text-success">+2.1% from last month</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Session Score</p>
                <p className="text-2xl font-bold">78%</p>
                <p className="text-xs text-success">+5.3% improvement</p>
              </div>
              <Target className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Feedback Response Rate</p>
                <p className="text-2xl font-bold">67%</p>
                <p className="text-xs text-warning">-1.2% from target</p>
              </div>
              <MessageSquare className="h-8 w-8 text-primary-light" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Goal Achievement</p>
                <p className="text-2xl font-bold">85%</p>
                <p className="text-xs text-success">+12% this quarter</p>
              </div>
              <TrendingUp className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="clients">Client Performance</TabsTrigger>
          <TabsTrigger value="feedback">Feedback Analysis</TabsTrigger>
          <TabsTrigger value="practice">Practice Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                  Client Progress Trends
                </CardTitle>
                <CardDescription>Overall improvement across all clients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={generateProgressData()}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        dataKey="month" 
                        className="text-xs text-muted-foreground"
                        tick={{ fill: 'currentColor' }}
                      />
                      <YAxis 
                        className="text-xs text-muted-foreground"
                        tick={{ fill: 'currentColor' }}
                        domain={[0, 100]}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '6px',
                        }}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="Dating Confidence"
                        stroke="hsl(var(--success))"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="Communication Skills"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="Emotional Intelligence"
                        stroke="hsl(var(--warning))"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-primary-light" />
                  Feedback Sentiment Analysis
                </CardTitle>
                <CardDescription>Distribution of feedback sentiment over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Positive Feedback</span>
                      <div className="flex items-center gap-2">
                        <Progress value={72} className="w-24 h-2" />
                        <span className="text-sm text-muted-foreground">72%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Neutral Feedback</span>
                      <div className="flex items-center gap-2">
                        <Progress value={23} className="w-24 h-2" />
                        <span className="text-sm text-muted-foreground">23%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Constructive Feedback</span>
                      <div className="flex items-center gap-2">
                        <Progress value={5} className="w-24 h-2" />
                        <span className="text-sm text-muted-foreground">5%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h4 className="font-medium text-sm mb-2">Top Feedback Themes</h4>
                    <div className="space-y-2">
                      <div className="text-sm flex justify-between">
                        <span>Great listener</span>
                        <span className="text-muted-foreground">28 mentions</span>
                      </div>
                      <div className="text-sm flex justify-between">
                        <span>Good conversation</span>
                        <span className="text-muted-foreground">24 mentions</span>
                      </div>
                      <div className="text-sm flex justify-between">
                        <span>Respectful</span>
                        <span className="text-muted-foreground">19 mentions</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="card-shadow">
            <CardHeader>
              <CardTitle>Coaching Effectiveness Metrics</CardTitle>
              <CardDescription>How your coaching impacts client outcomes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">89%</div>
                  <p className="text-sm text-muted-foreground">Clients report improved dating confidence</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-success mb-2">76%</div>
                  <p className="text-sm text-muted-foreground">Achieved their primary dating goals</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-warning mb-2">4.8</div>
                  <p className="text-sm text-muted-foreground">Average coaching satisfaction rating</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients" className="space-y-4">
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle>Individual Client Performance</CardTitle>
              <CardDescription>Detailed progress tracking for each client</CardDescription>
            </CardHeader>
            <CardContent>
              {clients.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No client data available</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {clients.map((client: any) => (
                    <div key={client.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-primary font-semibold">
                              {(client.user.firstName?.[0] || 'C').toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">
                              {client.user.firstName} {client.user.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {client.totalSessions || 0} sessions completed
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">View Details</Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Progress Score</p>
                          <div className="flex items-center gap-2">
                            <Progress value={Math.floor(Math.random() * 40) + 60} className="flex-1" />
                            <span className="text-sm font-medium">{Math.floor(Math.random() * 40) + 60}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Engagement Level</p>
                          <p className="text-sm font-medium capitalize">{client.engagementLevel}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Last Activity</p>
                          <p className="text-sm font-medium">
                            {client.lastSessionDate 
                              ? new Date(client.lastSessionDate).toLocaleDateString()
                              : 'No sessions yet'
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle>Feedback Volume Trends</CardTitle>
                <CardDescription>Feedback collection over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={generateFeedbackVolumeData()}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        dataKey="month" 
                        className="text-xs text-muted-foreground"
                        tick={{ fill: 'currentColor' }}
                      />
                      <YAxis 
                        className="text-xs text-muted-foreground"
                        tick={{ fill: 'currentColor' }}
                        allowDecimals={false}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '6px',
                        }}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                      />
                      <Legend />
                      <Bar 
                        dataKey="Dating Partners" 
                        fill="hsl(var(--success))" 
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar 
                        dataKey="Friends" 
                        fill="hsl(var(--primary))" 
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar 
                        dataKey="Family" 
                        fill="hsl(var(--warning))" 
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar 
                        dataKey="Colleagues" 
                        fill="hsl(var(--primary-light))" 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="card-shadow">
              <CardHeader>
                <CardTitle>Feedback Sources</CardTitle>
                <CardDescription>Where feedback is coming from</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Dating Partners</span>
                    <div className="flex items-center gap-2">
                      <Progress value={45} className="w-20 h-2" />
                      <span className="text-sm text-muted-foreground">45%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Friends</span>
                    <div className="flex items-center gap-2">
                      <Progress value={30} className="w-20 h-2" />
                      <span className="text-sm text-muted-foreground">30%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Family</span>
                    <div className="flex items-center gap-2">
                      <Progress value={15} className="w-20 h-2" />
                      <span className="text-sm text-muted-foreground">15%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Colleagues</span>
                    <div className="flex items-center gap-2">
                      <Progress value={10} className="w-20 h-2" />
                      <span className="text-sm text-muted-foreground">10%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="practice" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle>Most Popular Practice Scenarios</CardTitle>
                <CardDescription>Which scenarios clients practice most</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">First Date Conversation</span>
                    <span className="text-sm font-medium">156 sessions</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Flirting & Showing Interest</span>
                    <span className="text-sm font-medium">134 sessions</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Expressing Boundaries</span>
                    <span className="text-sm font-medium">89 sessions</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Building Emotional Connection</span>
                    <span className="text-sm font-medium">78 sessions</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Handling Rejection</span>
                    <span className="text-sm font-medium">67 sessions</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-shadow">
              <CardHeader>
                <CardTitle>Skill Improvement Rates</CardTitle>
                <CardDescription>Average improvement by skill category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Active Listening</span>
                      <span>+23%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Communication</span>
                      <span>+18%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Confidence</span>
                      <span>+15%</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Emotional Intelligence</span>
                      <span>+12%</span>
                    </div>
                    <Progress value={72} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
