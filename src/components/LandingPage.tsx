import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Sparkles, Zap, Calendar } from "lucide-react";

export function LandingPage() {
  const navigate = useNavigate();
  

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast",
      description: "Drag and drop tasks with instant updates across all your devices in real-time."
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Smart Organization",
      description: "Organize tasks by status with customizable columns and priority levels."
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Timeline View",
      description: "Visualize your tasks on a timeline and schedule with video integration."
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Task History",
      description: "Track every change with automatic history logging and real-time updates."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-muted/30">
      {/* Header with Theme Toggle */}
      <header className="absolute top-0 right-0 z-50 p-4">
        <ThemeToggle />
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 z-10">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-7xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
                  Cronos
                </h1>
                <p className="text-xl lg:text-2xl text-muted-foreground">
                  Enterprise Task Management Reimagined
                </p>
              </div>
              
              <p className="text-lg text-foreground/80 max-w-xl">
                Transform the way your team works with our powerful, intuitive task management platform. 
                Organize, prioritize, and collaborate seamlessly.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-6"
                  onClick={() => navigate("/auth")}
                >
                  Get Started Free
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="text-lg px-8 py-6"
                  onClick={() => navigate("/auth")}
                >
                  Sign In
                </Button>
              </div>
            </div>

            <div className="relative">
             <video src="/pro114.mov" autoPlay loop muted></video>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl lg:text-5xl font-bold">
              Everything You Need
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to help teams stay organized and productive
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <Card className="border-2 bg-gradient-to-br from-primary/5 via-background to-accent/5">
            <CardHeader className="text-center space-y-4 py-12">
              <CardTitle className="text-4xl lg:text-5xl font-bold">
                Ready to Transform Your Workflow?
              </CardTitle>
              <CardDescription className="text-xl max-w-2xl mx-auto">
                Join thousands of teams already using Cronos to streamline their work
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pb-12">
              <Button 
                size="lg" 
                className="text-lg px-12 py-6"
                onClick={() => navigate("/auth")}
              >
                Start Your Journey
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 CRONOS. TECHwizard.</p>
        </div>
      </footer>
    </div>
  );
}