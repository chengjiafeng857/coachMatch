import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  Plus, 
  Search,
  Filter,
  Star,
  Calendar,
  TrendingUp,
  UserCheck,
  Bell,
  FileText,
  Target,
  Send,
  Eye,
  Edit,
  Trash2
} from "lucide-react";

export default function CoachDemo() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedClient, setSelectedClient] = useState(null);

  // Sample data
  const clients = [
    {
      id: 1,
      name: "Alex Johnson",
      email: "alex@example.com",
      engagementLevel: "Active",
      totalSessions: 8,
      lastSession: "2024-05-30",
      progress: 75,
      goals: ["Improve confidence", "Better conversation skills"],
      recentFeedback: [
        { id: 1, rating: 4, content: "Much more confident in conversations", date: "2024-05-28", source: "date" },
        { id: 2, rating: 5, content: "Great listening skills improvement", date: "2024-05-25", source: "friend" }
      ]
    },
    {
      id: 2,
      name: "Sarah Chen",
      email: "sarah@example.com", 
      engagementLevel: "Very Active",
      totalSessions: 12,
      lastSession: "2024-05-29",
      progress: 85,
      goals: ["Master first date conversations", "Reduce social anxiety"],
      recentFeedback: [
        { id: 3, rating: 5, content: "So much more natural and relaxed", date: "2024-05-27", source: "date" },
        { id: 4, rating: 4, content: "Noticeable improvement in social situations", date: "2024-05-24", source: "family" }
      ]
    },
    {
      id: 3,
      name: "Mike Rodriguez",
      email: "mike@example.com",
      engagementLevel: "Moderate",
      totalSessions: 5,
      lastSession: "2024-05-28",
      progress: 60,
      goals: ["Build authentic connections", "Improve body language"],
      recentFeedback: [
        { id: 5, rating: 3, content: "Still working on eye contact", date: "2024-05-26", source: "date" }
      ]
    }
  ];

  const allFeedback = clients.flatMap(client => 
    client.recentFeedback.map(feedback => ({
      ...feedback,
      clientName: client.name,
      clientId: client.id
    }))
  );

  const dashboardStats = {
    totalClients: clients.length,
    activeClients: clients.filter(c => c.engagementLevel === "Active" || c.engagementLevel === "Very Active").length,
    avgProgress: Math.round(clients.reduce((sum, c) => sum + c.progress, 0) / clients.length),
    recentFeedback: allFeedback.length
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold">Coach Dashboard</h1>
          </div>
          
          <div className="ml-auto flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 border-r bg-card h-[calc(100vh-4rem)]">
          <div className="p-4 space-y-2">
            <Button 
              variant={activeTab === "dashboard" ? "default" : "ghost"} 
              className="w-full justify-start"
              onClick={() => setActiveTab("dashboard")}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <Button 
              variant={activeTab === "clients" ? "default" : "ghost"} 
              className="w-full justify-start"
              onClick={() => setActiveTab("clients")}
            >
              <Users className="w-4 h-4 mr-2" />
              Clients
            </Button>
            <Button 
              variant={activeTab === "feedback" ? "default" : "ghost"} 
              className="w-full justify-start"
              onClick={() => setActiveTab("feedback")}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Feedback Center
            </Button>
            <Button 
              variant={activeTab === "analytics" ? "default" : "ghost"} 
              className="w-full justify-start"
              onClick={() => setActiveTab("analytics")}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics
            </Button>
            <Button 
              variant={activeTab === "practice" ? "default" : "ghost"} 
              className="w-full justify-start"
              onClick={() => setActiveTab("practice")}
            >
              <Target className="w-4 h-4 mr-2" />
              Practice Hub
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Dashboard Overview</h2>
                <p className="text-muted-foreground">Monitor your clients' progress and coaching effectiveness</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardStats.totalClients}</div>
                    <p className="text-xs text-muted-foreground">Across all programs</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardStats.activeClients}</div>
                    <p className="text-xs text-muted-foreground">Currently engaged</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardStats.avgProgress}%</div>
                    <p className="text-xs text-muted-foreground">Across all clients</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Recent Feedback</CardTitle>
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardStats.recentFeedback}</div>
                    <p className="text-xs text-muted-foreground">This week</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Client Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {clients.slice(0, 3).map(client => (
                      <div key={client.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">{client.name}</p>
                          <p className="text-sm text-muted-foreground">Last session: {client.lastSession}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={client.engagementLevel === "Very Active" ? "default" : "secondary"}>
                            {client.engagementLevel}
                          </Badge>
                          <p className="text-sm mt-1">{client.progress}% progress</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Latest Feedback</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {allFeedback.slice(0, 3).map(feedback => (
                      <div key={feedback.id} className="p-3 border rounded">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-medium">{feedback.clientName}</p>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-3 h-3 ${i < feedback.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{feedback.content}</p>
                        <p className="text-xs text-muted-foreground mt-2">From {feedback.source} • {feedback.date}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Clients Tab */}
          {activeTab === "clients" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Client Management</h2>
                  <p className="text-muted-foreground">Manage and track your coaching clients</p>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Client
                </Button>
              </div>

              {/* Search and Filter */}
              <div className="flex space-x-4">
                <div className="flex-1">
                  <Input placeholder="Search clients..." className="max-w-sm" />
                </div>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>

              {/* Clients List */}
              <div className="grid gap-6">
                {clients.map(client => (
                  <Card key={client.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {client.name}
                            <Badge variant={client.engagementLevel === "Very Active" ? "default" : "secondary"}>
                              {client.engagementLevel}
                            </Badge>
                          </CardTitle>
                          <CardDescription>{client.email}</CardDescription>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            <Send className="w-4 h-4 mr-2" />
                            Message
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm font-medium mb-2">Progress</p>
                          <Progress value={client.progress} className="mb-2" />
                          <p className="text-sm text-muted-foreground">{client.progress}% complete</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-2">Sessions</p>
                          <p className="text-2xl font-bold">{client.totalSessions}</p>
                          <p className="text-sm text-muted-foreground">Last: {client.lastSession}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-2">Goals</p>
                          <div className="space-y-1">
                            {client.goals.map((goal, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {goal}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Feedback Center Tab */}
          {activeTab === "feedback" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Feedback Center</h2>
                <p className="text-muted-foreground">Review and analyze client feedback from dates and contacts</p>
              </div>

              <Tabs defaultValue="all" className="w-full">
                <TabsList>
                  <TabsTrigger value="all">All Feedback</TabsTrigger>
                  <TabsTrigger value="unread">Unread</TabsTrigger>
                  <TabsTrigger value="high-rated">High Rated</TabsTrigger>
                  <TabsTrigger value="needs-attention">Needs Attention</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                  {allFeedback.map(feedback => (
                    <Card key={feedback.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{feedback.clientName}</CardTitle>
                            <CardDescription>Feedback from {feedback.source} • {feedback.date}</CardDescription>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-4 h-4 ${i < feedback.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                              ))}
                            </div>
                            <Badge variant={feedback.rating >= 4 ? "default" : feedback.rating >= 3 ? "secondary" : "destructive"}>
                              {feedback.rating}/5
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">{feedback.content}</p>
                        <div className="flex justify-between items-center">
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Respond
                            </Button>
                            <Button variant="outline" size="sm">
                              <FileText className="w-4 h-4 mr-2" />
                              Add to Notes
                            </Button>
                          </div>
                          <Button variant="ghost" size="sm">
                            Mark as Read
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Analytics & Insights</h2>
                <p className="text-muted-foreground">Track progress and coaching effectiveness</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Client Progress Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {clients.map(client => (
                      <div key={client.id} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{client.name}</span>
                          <span>{client.progress}%</span>
                        </div>
                        <Progress value={client.progress} />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Feedback Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Average Rating</span>
                        <span className="text-2xl font-bold">4.2/5</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Total Feedback</span>
                        <span className="text-2xl font-bold">{allFeedback.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Improvement Rate</span>
                        <span className="text-2xl font-bold text-green-600">+12%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Practice Hub Tab */}
          {activeTab === "practice" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Practice Hub</h2>
                <p className="text-muted-foreground">AI-powered practice sessions for your clients</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Practice Sessions</CardTitle>
                    <CardDescription>Create and manage AI practice scenarios</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Create New Practice Session
                    </Button>
                    
                    <div className="space-y-3">
                      {["First Date Conversation", "Handling Rejection", "Building Rapport"].map((session, index) => (
                        <div key={index} className="flex justify-between items-center p-3 border rounded">
                          <span>{session}</span>
                          <Button variant="outline" size="sm">Configure</Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Practice Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {clients.map(client => (
                        <div key={client.id} className="p-3 border rounded">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{client.name}</span>
                            <Badge>Score: 8/10</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">Conversation Flow • Yesterday</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}