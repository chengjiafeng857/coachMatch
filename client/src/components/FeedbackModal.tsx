import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { X, Shield, Send, Calendar } from "lucide-react";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: any[];
}

interface FeedbackFormData {
  clientId: string;
  source: string;
  customMessage: string;
  scheduledFor?: string;
}

export default function FeedbackModal({ isOpen, onClose, clients }: FeedbackModalProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  
  const form = useForm<FeedbackFormData>({
    defaultValues: {
      clientId: "",
      source: "",
      customMessage: "",
      scheduledFor: "",
    }
  });

  const sendFeedbackRequestMutation = useMutation({
    mutationFn: async (data: FeedbackFormData) => {
      return await apiRequest("POST", "/api/feedback-requests", data);
    },
    onSuccess: () => {
      toast({
        title: "Feedback Request Sent",
        description: "Anonymous feedback request has been sent successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/feedback"] });
      handleClose();
    },
    onError: (error) => {
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
        title: "Request Failed",
        description: "Failed to send feedback request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleClose = () => {
    form.reset();
    setStep(1);
    onClose();
  };

  const handleNext = () => {
    const currentData = form.getValues();
    if (step === 1 && !currentData.clientId) {
      toast({
        title: "Selection Required",
        description: "Please select a client before continuing.",
        variant: "destructive",
      });
      return;
    }
    if (step === 2 && !currentData.source) {
      toast({
        title: "Selection Required",
        description: "Please select a feedback source before continuing.",
        variant: "destructive",
      });
      return;
    }
    setStep(step + 1);
  };

  const handleSubmit = (data: FeedbackFormData) => {
    sendFeedbackRequestMutation.mutate(data);
  };

  const selectedClient = clients.find(c => c.id.toString() === form.watch("clientId"));

  const feedbackSources = [
    {
      value: "date",
      title: "Recent Date",
      description: "Dating interaction feedback",
      icon: "💕"
    },
    {
      value: "friend",
      title: "Friend/Family",
      description: "Social skills feedback",
      icon: "👥"
    },
    {
      value: "colleague",
      title: "Colleague",
      description: "Professional interaction feedback",
      icon: "💼"
    },
    {
      value: "general",
      title: "General Social",
      description: "Any social interaction feedback",
      icon: "💬"
    }
  ];

  const getStepTitle = () => {
    switch (step) {
      case 1: return "Select Client";
      case 2: return "Feedback Source";
      case 3: return "Customize Request";
      default: return "Request Feedback";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Request Anonymous Feedback</DialogTitle>
              <DialogDescription>
                Step {step} of 3: {getStepTitle()}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Step 1: Select Client */}
          {step === 1 && (
            <div className="space-y-4">
              <Label>Select Client</Label>
              <Select onValueChange={(value) => form.setValue("clientId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a client..." />
                </SelectTrigger>
                <SelectContent>
                  {clients.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      No clients available. Add clients first.
                    </div>
                  ) : (
                    clients.map((client) => (
                      <SelectItem key={client.id} value={client.id.toString()}>
                        {client.user.firstName && client.user.lastName 
                          ? `${client.user.firstName} ${client.user.lastName}`
                          : client.user.email || 'Unnamed Client'
                        }
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              
              {selectedClient && (
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-semibold text-sm">
                        {(selectedClient.user.firstName?.[0] || 'C').toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {selectedClient.user.firstName} {selectedClient.user.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {selectedClient.totalSessions || 0} sessions completed
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {(() => {
                      if (!selectedClient.goals) return null;
                      
                      // Convert goals to array if it's a string
                      const goalsArray = typeof selectedClient.goals === 'string' 
                        ? selectedClient.goals.split(',').map((g: string) => g.trim()).filter((g: string) => g.length > 0)
                        : Array.isArray(selectedClient.goals) 
                          ? selectedClient.goals 
                          : [];
                      
                      return goalsArray.slice(0, 3).map((goal: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {goal}
                        </Badge>
                      ));
                    })()}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Feedback Source */}
          {step === 2 && (
            <div className="space-y-4">
              <Label>Feedback Source</Label>
              <RadioGroup
                value={form.watch("source")}
                onValueChange={(value) => form.setValue("source", value)}
                className="grid grid-cols-1 gap-3"
              >
                {feedbackSources.map((source) => (
                  <div key={source.value} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={source.value}
                      id={source.value}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={source.value}
                      className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors w-full
                        ${form.watch("source") === source.value 
                          ? 'border-primary bg-primary/10' 
                          : 'border-border hover:bg-accent'
                        }`}
                    >
                      <span className="text-2xl">{source.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{source.title}</p>
                        <p className="text-xs text-muted-foreground">{source.description}</p>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {/* Step 3: Customize Message */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="customMessage">Custom Message (Optional)</Label>
                <Textarea
                  id="customMessage"
                  {...form.register("customMessage")}
                  rows={4}
                  placeholder="Add any specific questions or context for the feedback request..."
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="scheduledFor">Schedule for Later (Optional)</Label>
                <Input
                  id="scheduledFor"
                  type="datetime-local"
                  {...form.register("scheduledFor")}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Leave empty to send immediately
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Shield className="h-4 w-4 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-primary">Privacy Protection</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      All feedback is completely anonymous and encrypted. Feedback providers' 
                      identities are protected through voice modulation and text anonymization.
                    </p>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-3">
                <Separator />
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Client:</span>
                    <span className="font-medium">
                      {selectedClient?.user.firstName} {selectedClient?.user.lastName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Source:</span>
                    <span className="font-medium capitalize">
                      {feedbackSources.find(s => s.value === form.watch("source"))?.title}
                    </span>
                  </div>
                  {form.watch("scheduledFor") && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Scheduled:</span>
                      <span className="font-medium">
                        {form.watch("scheduledFor") ? new Date(form.watch("scheduledFor")!).toLocaleString() : ''}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between pt-4 border-t">
            <div>
              {step > 1 && (
                <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
                  Back
                </Button>
              )}
            </div>
            <div>
              {step < 3 ? (
                <Button type="button" onClick={handleNext}>
                  Next
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  disabled={sendFeedbackRequestMutation.isPending}
                  className="bg-primary hover:bg-primary/90"
                >
                  {sendFeedbackRequestMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Request
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
