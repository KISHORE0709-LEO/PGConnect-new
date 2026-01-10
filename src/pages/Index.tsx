import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Building2, Users, Shield, Sparkles, X, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import heroBg from "@/assets/hero-bg-realistic.jpg";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, showSuccessMessage, showPGSuccessMessage, dismissSuccessMessage, dismissPGSuccessMessage } = useAuth();

  const handleOwnerClick = () => {
    if (isAuthenticated) {
      navigate('/owner/register-pg');
    } else {
      navigate('/auth?role=owner');
    }
  };

  const handleStudentClick = () => {
    if (isAuthenticated) {
      navigate('/city-selection');
    } else {
      navigate('/auth?role=student');
    }
  };

  const handleDismissSuccess = () => {
    dismissSuccessMessage();
  };

  const handleDismissPGSuccess = () => {
    dismissPGSuccessMessage();
  };

  return (
    <div className="min-h-screen">
      {/* Login Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-green-500 to-teal-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-top duration-300">
          <CheckCircle className="h-5 w-5" />
          <span className="font-medium">Successfully logged in! Welcome to PGConnect.</span>
          <button onClick={handleDismissSuccess} className="ml-2 hover:bg-white/20 rounded-full p-1 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      
      {/* PG Registration Success Message */}
      {showPGSuccessMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-top duration-300">
          <CheckCircle className="h-5 w-5" />
          <span className="font-medium">You have successfully registered your PG!</span>
          <button onClick={handleDismissPGSuccess} className="ml-2 hover:bg-white/20 rounded-full p-1 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      
      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.6)), url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent" />
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-16">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 text-white tracking-tight">
            PG<span className="text-yellow-400">Connect</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-12 text-gray-200 max-w-3xl mx-auto">
            The unified digital platform connecting students with verified PG accommodations
          </p>

          {/* Role Selection Cards */}
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Owner Card - Left */}
            <Card 
              className="p-8 bg-card/95 backdrop-blur-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 hover:border-primary group"
              onClick={handleOwnerClick}
            >
              <div className="mb-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-2">I'm an Owner</h3>
                <p className="text-muted-foreground mb-6">
                  Launch your PG, monitor occupancy, track payments, and manage tenants effortlessly
                </p>
              </div>
              <Button className="w-full" size="lg">
                {isAuthenticated ? "Go to Dashboard" : "Launch PG"}
              </Button>
            </Card>

            {/* Student Card - Right */}
            <Card 
              className="p-8 bg-card/95 backdrop-blur-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 hover:border-primary group"
              onClick={handleStudentClick}
            >
              <div className="mb-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-2">I'm a Student</h3>
                <p className="text-muted-foreground mb-6">
                  Find verified PGs, check availability, and book securely with AI roommate matching
                </p>
              </div>
              <Button className="w-full" size="lg">
                {isAuthenticated ? "Browse PGs" : "Join as Student"}
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose PGConnect?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Transparency, efficiency, and trust for both tenants and owners
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Verified & Trusted</h3>
              <p className="text-muted-foreground">
                All PG listings are verified with RentRep rating system for complete transparency and safety
              </p>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
                <Building2 className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Smart Management</h3>
              <p className="text-muted-foreground">
                Real-time dashboard with 3D visualization, occupancy tracking, and automated rent reminders
              </p>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-3">AI-Powered Matching</h3>
              <p className="text-muted-foreground">
                Find compatible roommates with our AI-driven matching system based on habits and preferences
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
