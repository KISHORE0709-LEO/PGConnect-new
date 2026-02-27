import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Building2, Users, Shield, Sparkles, X, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import heroBg from "@/assets/hero-bg-realistic.jpg";

// Helper function to check owner PGs and redirect
const checkOwnerPGsAndRedirect = async (navigate: any) => {
  try {
    const { auth } = await import('@/config/firebase');
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      navigate('/auth?role=owner');
      return;
    }

    const { collection, query, where, getDocs } = await import('firebase/firestore');
    const { db } = await import('@/config/firebase');
    
    const pgsQuery = query(
      collection(db, 'pgs'),
      where('ownerId', '==', currentUser.uid)
    );
    const pgsSnapshot = await getDocs(pgsQuery);
    
    if (pgsSnapshot.empty) {
      navigate('/owner/register-pg');
    } else {
      navigate('/owner/dashboard');
    }
  } catch (error) {
    console.error('Error checking owner PGs:', error);
    navigate('/owner-dashboard');
  }
};

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, showSuccessMessage, showPGSuccessMessage, dismissSuccessMessage, dismissPGSuccessMessage } = useAuth();

  const handleOwnerClick = async () => {
    if (isAuthenticated) {
      navigate('/owner/dashboard');
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
          <h1 className="text-6xl md:text-7xl font-bold mb-6 tracking-tight">
            <span className="relative inline-block">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-300 to-blue-400 animate-gradient-flow">PG</span>
              <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-blue-400 to-blue-300 animate-gradient-flow-reverse blur-sm">PG</span>
            </span>
            <span className="relative inline-block">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 animate-gradient-flow">Connect</span>
              <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300 animate-gradient-flow-reverse blur-sm">Connect</span>
            </span>
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
            <Card className="group p-8 transition-all duration-500 bg-gradient-to-br from-card to-primary/5 border-2 hover:border-primary/50 hover:shadow-[0_0_40px_rgba(var(--primary),0.3)] animate-card-breathe">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mb-6 group-hover:animate-bounce-slow transition-all duration-300 shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">Verified & Trusted</h3>
              <p className="text-muted-foreground leading-relaxed">
                All PG listings are verified with RentRep rating system for complete transparency and safety
              </p>
            </Card>

            <Card className="group p-8 transition-all duration-500 bg-gradient-to-br from-card to-blue-500/5 border-2 hover:border-blue-500/50 hover:shadow-[0_0_40px_rgba(59,130,246,0.3)] animate-card-breathe" style={{ animationDelay: '0.2s' }}>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6 group-hover:animate-bounce-slow transition-all duration-300 shadow-lg">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 group-hover:text-blue-600 transition-colors">Smart Management</h3>
              <p className="text-muted-foreground leading-relaxed">
                Real-time dashboard with 3D visualization, occupancy tracking, and automated rent reminders
              </p>
            </Card>

            <Card className="group p-8 transition-all duration-500 bg-gradient-to-br from-card to-purple-500/5 border-2 hover:border-purple-500/50 hover:shadow-[0_0_40px_rgba(168,85,247,0.3)] animate-card-breathe" style={{ animationDelay: '0.4s' }}>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-6 group-hover:animate-bounce-slow transition-all duration-300 shadow-lg">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 group-hover:text-purple-600 transition-colors">AI-Powered Matching</h3>
              <p className="text-muted-foreground leading-relaxed">
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
