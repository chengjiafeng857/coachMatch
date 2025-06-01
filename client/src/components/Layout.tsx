import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Home, Brain, MessageSquare, Users, BarChart3, Settings, Bell, Menu, X } from "lucide-react";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/", icon: Home, current: location === "/" },
    { name: "Clients", href: "/clients", icon: Users, current: location === "/clients" },
    { name: "Feedback Center", href: "/feedback", icon: MessageSquare, current: location === "/feedback" },
    { name: "Practice Hub", href: "/practice", icon: Brain, current: location === "/practice" },
    { name: "Analytics", href: "/analytics", icon: BarChart3, current: location === "/analytics" },
    { name: "Settings", href: "/settings", icon: Settings, current: location === "/settings" },
  ];

  const mobileNavigation = [
    { name: "Home", href: "/", icon: Home, current: location === "/" },
    { name: "Practice", href: "/practice", icon: Brain, current: location === "/practice" },
    { name: "Feedback", href: "/feedback", icon: MessageSquare, current: location === "/feedback" },
    { name: "Clients", href: "/clients", icon: Users, current: location === "/clients" },
    { name: "Profile", href: "/settings", icon: Settings, current: location === "/settings" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:bg-card lg:border-r lg:border-border">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 px-6 mb-8">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-semibold text-card-foreground">MirrorMatch</span>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.name} href={item.href}>
                  <a
                    className={`${
                      item.current
                        ? "bg-primary/10 border-r-2 border-primary text-primary"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    } group flex items-center px-4 py-3 text-sm font-medium rounded-l-md transition-colors`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </a>
                </Link>
              );
            })}
          </nav>
          
          {/* Coach Profile */}
          <div className="flex-shrink-0 flex border-t border-border p-4">
            <div className="flex items-center w-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.profileImageUrl} alt="Coach Profile" />
                <AvatarFallback className="bg-primary text-white">
                  {user?.firstName?.[0] || user?.email?.[0] || 'C'}
                </AvatarFallback>
              </Avatar>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-card-foreground">
                  {user?.firstName && user?.lastName 
                    ? `${user.firstName} ${user.lastName}`
                    : user?.email || 'Coach'
                  }
                </p>
                <p className="text-xs font-medium text-muted-foreground">Dating Coach</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden bg-card border-b border-border">
        <div className="px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="mr-2"
              >
                {sidebarOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <span className="ml-2 text-lg font-semibold text-card-foreground">MirrorMatch</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-error text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </Button>
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.profileImageUrl} alt="Coach Profile" />
                <AvatarFallback className="bg-primary text-white text-sm">
                  {user?.firstName?.[0] || user?.email?.[0] || 'C'}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-card">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="text-white hover:text-white hover:bg-white/20"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4 mb-8">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <span className="ml-2 text-lg font-semibold text-card-foreground">MirrorMatch</span>
              </div>
              <nav className="mt-5 px-2 space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.name} href={item.href}>
                      <a
                        onClick={() => setSidebarOpen(false)}
                        className={`${
                          item.current
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        } group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors`}
                      >
                        <Icon className="mr-4 h-6 w-6" />
                        {item.name}
                      </a>
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-border p-4">
              <div className="flex items-center">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.profileImageUrl} alt="Coach Profile" />
                  <AvatarFallback className="bg-primary text-white">
                    {user?.firstName?.[0] || user?.email?.[0] || 'C'}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <p className="text-sm font-medium text-card-foreground">
                    {user?.firstName && user?.lastName 
                      ? `${user.firstName} ${user.lastName}`
                      : user?.email || 'Coach'
                    }
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.location.href = "/api/logout"}
                    className="text-xs p-0 h-auto text-muted-foreground hover:text-foreground"
                  >
                    Sign out
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-card border-t border-border z-40">
        <div className="grid grid-cols-5 py-2">
          {mobileNavigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.name} href={item.href}>
                <a
                  className={`flex flex-col items-center justify-center p-2 transition-colors ${
                    item.current
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5 mb-1" />
                  <span className="text-xs">{item.name}</span>
                </a>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
