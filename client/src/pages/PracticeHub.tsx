import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Brain, Target, TrendingUp, Users, Clock, Award } from "lucide-react";

export default function PracticeHub() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

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

  const { data: clients = [] } = useQuery({
    queryKey: ["/api/clients"],
    retry: false,
  });

  const practiceScenarios = [
    {
      id: 1,
      title: "First Date Conversation",
      description: "Practice engaging conversation starters and active listening skills",
      difficulty: 2,
      duration: "15-20 min",
      skills: ["Active Listening", "Question Asking", "Showing Interest"],
      icon: "💬",
      completions: 156
    },
    {
      id: 2,
      title: "Expressing Boundaries",
      description: "Learn to communicate personal boundaries clearly and respectfully",
      difficulty: 3,
      duration: "10-15 min",
      skills: ["Communication", "Assertiveness", "Respect"],
      icon: "🛡️",
      completions: 89
    },
    {
      id: 3,
      title: "Handling Rejection",
      description: "Practice graceful responses to rejection and maintaining confidence",
      difficulty: 4,
      duration: "12-18 min",
      skills: ["Emotional Intelligence", "Resilience", "Grace"],
      icon: "🤝",
      completions: 67
    },
    {
      id: 4,
      title: "Flirting & Showing Interest",
      description: "Develop natural and appropriate ways to show romantic interest",
      difficulty: 3,
      duration: "15-25 min",
      skills: ["Confidence", "Humor", "Body Language"],
      icon: "😊",
      completions: 134
    },
    {
      id: 5,
      title: "Difficult Conversations",
      description: "Navigate challenging topics and conflicts in relationships",
      difficulty: 5,
      duration: "20-30 min",
      skills: ["Conflict Resolution", "Empathy", "Problem Solving"],
      icon: "💭",
      completions: 45
    },
    {
      id: 6,
      title: "Building Emotional Connection",
      description: "Practice vulnerability and deep emotional sharing techniques",
      difficulty: 4,
      duration: "18-25 min",
      skills: ["Vulnerability", "Emotional Intelligence", "Trust Building"],
      icon: "❤️",
      completions: 78
    }
  ];

  const getDifficultyColor = (level: number) => {
    if (level <= 2) return "bg-success text-white";
    if (level <= 3) return "bg-warning text-white";
    return "bg-error text-white";
  };

  const getDifficultyText = (level: number) => {
    if (level <= 2) return "Beginner";
    if (level <= 3) return "Intermediate";
    return "Advanced";
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
          <h1 className="text-2xl font-semibold text-foreground">Practice Hub</h1>
          <p className="text-muted-foreground">AI-powered practice scenarios for your clients' skill development</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Clients</SelectItem>
              {clients.map((client: any) => (
                <SelectItem key={client.id} value={client.id.toString()}>
                  {client.user.firstName} {client.user.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Practice Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Sessions</p>
                <p className="text-2xl font-bold">569</p>
              </div>
              <Brain className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">This Week</p>
                <p className="text-2xl font-bold">47</p>
              </div>
              <Clock className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Score</p>
                <p className="text-2xl font-bold">78%</p>
              </div>
              <Award className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Clients</p>
                <p className="text-2xl font-bold">{clients.length}</p>
              </div>
              <Users className="h-8 w-8 text-primary-light" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="scenarios" className="space-y-4">
        <TabsList>
          <TabsTrigger value="scenarios">Practice Scenarios</TabsTrigger>
          <TabsTrigger value="progress">Client Progress</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="scenarios" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {practiceScenarios.map((scenario) => (
              <Card key={scenario.id} className="card-shadow hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="text-3xl mb-2">{scenario.icon}</div>
                    <Badge className={getDifficultyColor(scenario.difficulty)}>
                      {getDifficultyText(scenario.difficulty)}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{scenario.title}</CardTitle>
                  <CardDescription>{scenario.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-medium">{scenario.duration}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Completed:</span>
                      <span className="font-medium">{scenario.completions} times</span>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Skills Practiced:</p>
                      <div className="flex flex-wrap gap-1">
                        {scenario.skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button className="w-full bg-primary hover:bg-primary/90">
                      <Play className="h-4 w-4 mr-2" />
                      Assign to Client
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <div className="space-y-6">
            {clients.length === 0 ? (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <div className="h-24 w-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">No clients yet</h3>
                  <p className="text-muted-foreground">Add clients to start tracking their practice progress</p>
                </div>
              </div>
            ) : (
              clients.map((client: any) => (
                <Card key={client.id} className="card-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-primary font-semibold">
                            {(client.user.firstName?.[0] || 'C').toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <CardTitle className="text-base">
                            {client.user.firstName} {client.user.lastName}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            Last practice: 2 days ago
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-success text-white">Active</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Overall Progress</span>
                          <span>72%</span>
                        </div>
                        <Progress value={72} className="h-2" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Total Sessions:</span>
                          <span className="font-medium ml-2">18</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Avg. Score:</span>
                          <span className="font-medium ml-2">78%</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Best Skill:</span>
                          <span className="font-medium ml-2">Active Listening</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Focus Area:</span>
                          <span className="font-medium ml-2">Confidence</span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2 border-t">
                        <Button variant="outline" size="sm">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <Target className="h-4 w-4 mr-1" />
                          Set Goals
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-primary" />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Most Needed Practice Area</h4>
                    <p className="text-sm text-muted-foreground">
                      Your clients would benefit from more practice with "Expressing Boundaries" - 
                      this scenario shows the lowest average scores across your client base.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Success Pattern</h4>
                    <p className="text-sm text-muted-foreground">
                      Clients who complete 3+ practice sessions per week show 40% faster 
                      improvement in real-world dating confidence.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Engagement Alert</h4>
                    <p className="text-sm text-muted-foreground">
                      2 clients haven't practiced in over a week. Consider sending 
                      personalized encouragement or easier scenarios.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-success" />
                  Performance Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Top Performing Skills</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Active Listening</span>
                        <div className="flex items-center gap-2">
                          <Progress value={85} className="w-20 h-2" />
                          <span className="text-xs text-muted-foreground">85%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Question Asking</span>
                        <div className="flex items-center gap-2">
                          <Progress value={78} className="w-20 h-2" />
                          <span className="text-xs text-muted-foreground">78%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Empathy</span>
                        <div className="flex items-center gap-2">
                          <Progress value={72} className="w-20 h-2" />
                          <span className="text-xs text-muted-foreground">72%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h4 className="font-medium text-sm mb-2">Areas for Improvement</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Handling Rejection</span>
                        <div className="flex items-center gap-2">
                          <Progress value={45} className="w-20 h-2" />
                          <span className="text-xs text-muted-foreground">45%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Assertiveness</span>
                        <div className="flex items-center gap-2">
                          <Progress value={52} className="w-20 h-2" />
                          <span className="text-xs text-muted-foreground">52%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Confidence</span>
                        <div className="flex items-center gap-2">
                          <Progress value={58} className="w-20 h-2" />
                          <span className="text-xs text-muted-foreground">58%</span>
                        </div>
                      </div>
                    </div>
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
