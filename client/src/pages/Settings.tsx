import { useQuery, useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { User, Bell, Shield, Globe, Palette, Zap, Save, AlertTriangle, CreditCard, Lock, HelpCircle } from "lucide-react";

interface UserData {
  firstName?: string;
  lastName?: string;
  email?: string;
}

interface Client {
  id: string;
  user: UserData;
  totalSessions: number;
  engagementLevel: string;
  lastSessionDate?: string;
}

export default function Settings() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth() as { user: UserData; isAuthenticated: boolean; isLoading: boolean };
  const [activeTab, setActiveTab] = useState("profile");

  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
    retry: false,
  });

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

  const profileForm = useForm({
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      businessName: "",
      specializations: "",
      yearsExperience: "",
      timezone: "UTC",
      bio: ""
    }
  });

  const handleProfileUpdate = async (data: any) => {
    try {
      await apiRequest("PUT", "/api/profile", data);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    } catch (error) {
      if (isUnauthorizedError(error as Error)) {
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
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
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
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account, preferences, and coaching platform settings</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2 text-primary" />
                Personal Information
              </CardTitle>
              <CardDescription>Update your personal details and coaching profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={profileForm.handleSubmit(handleProfileUpdate)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      {...profileForm.register("firstName")}
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      {...profileForm.register("lastName")}
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    {...profileForm.register("email")}
                    placeholder="Enter your email"
                    disabled
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Email cannot be changed. Contact support if you need to update this.
                  </p>
                </div>

                <div>
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    {...profileForm.register("businessName")}
                    placeholder="Your coaching business name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="yearsExperience">Years of Experience</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-1">0-1 years</SelectItem>
                        <SelectItem value="2-5">2-5 years</SelectItem>
                        <SelectItem value="6-10">6-10 years</SelectItem>
                        <SelectItem value="10+">10+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="EST">Eastern Time</SelectItem>
                        <SelectItem value="PST">Pacific Time</SelectItem>
                        <SelectItem value="CST">Central Time</SelectItem>
                        <SelectItem value="MST">Mountain Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="specializations">Specializations</Label>
                  <Input
                    id="specializations"
                    {...profileForm.register("specializations")}
                    placeholder="e.g., Dating Confidence, Communication Skills, Relationship Building"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Separate multiple specializations with commas
                  </p>
                </div>

                <div>
                  <Label htmlFor="bio">Professional Bio</Label>
                  <Textarea
                    id="bio"
                    {...profileForm.register("bio")}
                    rows={4}
                    placeholder="Tell clients about your background and coaching approach..."
                  />
                </div>

                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2 text-primary" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Choose when and how you want to be notified</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>New Feedback Received</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when clients receive new feedback
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Client Inactivity Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Alert when clients haven't practiced in 7+ days
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Goal Achievement Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Celebrate when clients reach their goals
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Weekly Progress Reports</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive summary of client progress every Monday
                    </p>
                  </div>
                  <Switch />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Platform Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Stay informed about new features and improvements
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="pt-4 border-t">
                <Label className="text-sm font-medium">Delivery Methods</Label>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="email-notifications" defaultChecked />
                    <Label htmlFor="email-notifications" className="text-sm">Email Notifications</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="browser-notifications" />
                    <Label htmlFor="browser-notifications" className="text-sm">Browser Push Notifications</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="sms-notifications" />
                    <Label htmlFor="sms-notifications" className="text-sm">SMS Notifications (Premium)</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-primary" />
                Privacy & Security
              </CardTitle>
              <CardDescription>Manage your data privacy and security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Data Encryption</Label>
                    <p className="text-sm text-muted-foreground">
                      All sensitive data is encrypted end-to-end
                    </p>
                  </div>
                  <Badge variant="secondary">Enabled</Badge>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Anonymous Feedback Protection</Label>
                    <p className="text-sm text-muted-foreground">
                      Voice modulation and text anonymization active
                    </p>
                  </div>
                  <Badge variant="secondary">Active</Badge>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>GDPR Compliance</Label>
                    <p className="text-sm text-muted-foreground">
                      Full data sovereignty and user consent management
                    </p>
                  </div>
                  <Badge variant="secondary">Compliant</Badge>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-4">Data Management</h4>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    Download All Data
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    View Data Usage Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-error border-error">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Delete Account & All Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2 text-primary" />
                Platform Integrations
              </CardTitle>
              <CardDescription>Connect with your existing coaching tools and workflows</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">V</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Voxer</h4>
                        <p className="text-sm text-muted-foreground">Voice messaging</p>
                      </div>
                    </div>
                    <Badge variant="secondary">Not Connected</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Integrate voice messaging for seamless coach-client communication
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Connect Voxer
                  </Button>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-green-600 font-semibold">G</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Google Calendar</h4>
                        <p className="text-sm text-muted-foreground">Scheduling</p>
                      </div>
                    </div>
                    <Badge variant="secondary">Connected</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Sync your coaching sessions and appointments
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Manage Connection
                  </Button>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <span className="text-orange-600 font-semibold">Z</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Zapier</h4>
                        <p className="text-sm text-muted-foreground">Automation</p>
                      </div>
                    </div>
                    <Badge variant="secondary">Not Connected</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Automate workflows with your existing coaching tools
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Connect Zapier
                  </Button>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <span className="text-purple-600 font-semibold">W</span>
                      </div>
                      <div>
                        <h4 className="font-medium">WhatsApp Business</h4>
                        <p className="text-sm text-muted-foreground">Messaging</p>
                      </div>
                    </div>
                    <Badge variant="secondary">Not Connected</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Send automated check-ins and reminders via WhatsApp
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Connect WhatsApp
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle>Subscription & Billing</CardTitle>
              <CardDescription>Manage your MirrorMatch subscription and payment details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border rounded-lg p-4 bg-primary/5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-medium">Professional Plan</h4>
                    <p className="text-sm text-muted-foreground">Up to 50 active clients</p>
                  </div>
                  <Badge className="bg-primary text-white">Active</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Monthly Cost:</span>
                    <span className="font-medium ml-2">$89/month</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Next Billing:</span>
                    <span className="font-medium ml-2">Jan 15, 2024</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Active Clients:</span>
                    <span className="font-medium ml-2">{clients.length}/50</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <span className="font-medium ml-2 text-success">Active</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Payment Method</h4>
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                        <span className="text-blue-600 text-xs font-bold">VISA</span>
                      </div>
                      <div>
                        <p className="font-medium">•••• •••• •••• 4242</p>
                        <p className="text-sm text-muted-foreground">Expires 12/25</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Update</Button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1">
                  View Billing History
                </Button>
                <Button variant="outline" className="flex-1">
                  Download Invoices
                </Button>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3 text-error">Danger Zone</h4>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full text-error border-error">
                    Downgrade to Free Plan
                  </Button>
                  <Button variant="outline" className="w-full text-error border-error">
                    Cancel Subscription
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
