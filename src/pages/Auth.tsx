import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail, AlertCircle, CheckCircle } from "lucide-react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { loginUser, registerUser, signInWithGoogle, resetPassword, createUserProfile, getUserProfile } from "@/lib/firebase";
import { validatePassword, validateEmail } from "@/lib/validation";
import PasswordInput from "@/components/PasswordInput";
import Spline from '@splinetool/react-spline';

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setAuthenticatedUser } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [userType, setUserType] = useState(searchParams.get('role') || "student");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    resetEmail: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setMessage(null);
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleEmailLogin = async () => {
    setLoading(true);
    try {
      // Validate email
      const emailValidation = validateEmail(formData.email);
      if (!emailValidation.isValid) {
        showMessage('error', emailValidation.error!);
        return;
      }

      if (!formData.password) {
        showMessage('error', 'Please enter your password');
        return;
      }

      const userCredential = await loginUser(formData.email, formData.password);
      const user = userCredential.user;
      
      const userProfile = await getUserProfile(user.uid);
      
      const userData = { 
        id: parseInt(user.uid.slice(-6), 16), 
        name: userProfile?.fullName || user.displayName || formData.email.split('@')[0], 
        email: user.email, 
        role: userProfile?.role || 'student' 
      };
      
      setAuthenticatedUser(userData);
      showMessage('success', 'Login successful! Redirecting...');
      
      setTimeout(() => {
        navigate('/home');
      }, 1000);
      
    } catch (error: any) {
      let errorMessage = 'Login failed';
      
      switch (error.code) {
        case 'auth/invalid-credential':
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          errorMessage = 'Invalid email or password';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection';
          break;
        default:
          errorMessage = error.message || 'Login failed';
      }
      
      showMessage('error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      // Validate inputs
      if (!formData.fullName.trim()) {
        showMessage('error', 'Please enter your full name');
        return;
      }

      const emailValidation = validateEmail(formData.email);
      if (!emailValidation.isValid) {
        showMessage('error', emailValidation.error!);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        showMessage('error', 'Passwords do not match');
        return;
      }
      
      const passwordValidation = validatePassword(formData.password, formData.fullName, formData.email);
      if (!passwordValidation.isValid) {
        showMessage('error', passwordValidation.errors[0]);
        return;
      }
      
      const userCredential = await registerUser(formData.email, formData.password);
      const user = userCredential.user;
      
      await createUserProfile(user, {
        fullName: formData.fullName,
        role: userType
      });
      
      const userData = { 
        id: parseInt(user.uid.slice(-6), 16), 
        name: formData.fullName, 
        email: user.email, 
        role: userType 
      };
      
      setAuthenticatedUser(userData);
      showMessage('success', 'Account created successfully! Redirecting...');
      
      setTimeout(() => {
        navigate('/home');
      }, 1000);
      
    } catch (error: any) {
      let errorMessage = 'Registration failed';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'An account with this email already exists';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address';
          break;
        default:
          errorMessage = error.message || 'Registration failed';
      }
      
      showMessage('error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithGoogle();
      const user = result.user;
      
      let userProfile = await getUserProfile(user.uid);
      
      if (!userProfile) {
        await createUserProfile(user, {
          fullName: user.displayName || 'User',
          role: userType
        });
        userProfile = { fullName: user.displayName, role: userType };
      }
      
      const userData = {
        id: parseInt(user.uid.slice(-6), 16),
        name: userProfile.fullName || user.displayName || 'User',
        email: user.email,
        role: userProfile.role || userType
      };
      
      setAuthenticatedUser(userData);
      showMessage('success', 'Google sign-in successful! Redirecting...');
      
      setTimeout(() => {
        navigate('/home');
      }, 1000);
      
    } catch (error: any) {
      showMessage('error', error.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setLoading(true);
    try {
      const emailValidation = validateEmail(formData.resetEmail);
      if (!emailValidation.isValid) {
        showMessage('error', emailValidation.error!);
        return;
      }

      await resetPassword(formData.resetEmail);
      showMessage('success', 'Password reset email sent! Check your inbox.');
      setShowForgotPassword(false);
      setFormData(prev => ({ ...prev, resetEmail: '' }));
      
    } catch (error: any) {
      let errorMessage = 'Failed to send reset email';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email address';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address';
          break;
        default:
          errorMessage = error.message || 'Failed to send reset email';
      }
      
      showMessage('error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="absolute top-4 left-4">
          <Link to="/home">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-bold text-primary text-lg">PGConnect</span>
            </Button>
          </Link>
        </div>

        <Card className="w-full max-w-md p-6">
          <div className="text-center mb-6">
            <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold">Reset Password</h2>
            <p className="text-muted-foreground mt-2">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {message && (
            <div className={`flex items-center gap-2 p-3 rounded-lg mb-4 ${
              message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {message.type === 'success' ? 
                <CheckCircle className="h-4 w-4" /> : 
                <AlertCircle className="h-4 w-4" />
              }
              <span className="text-sm">{message.text}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <Label>Email Address</Label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={formData.resetEmail}
                onChange={(e) => handleInputChange('resetEmail', e.target.value)}
              />
            </div>

            <Button 
              onClick={handleForgotPassword} 
              className="w-full" 
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Email'}
            </Button>

            <Button 
              variant="ghost" 
              onClick={() => setShowForgotPassword(false)}
              className="w-full"
            >
              Back to Login
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="absolute top-4 left-4 z-10">
        <Link to="/home">
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-bold text-primary text-lg">PGConnect</span>
          </Button>
        </Link>
      </div>
      
      <div className="flex min-h-screen">
        {/* Left Side - Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <Card className="p-6">
          {/* Login/Register Toggle */}
          <div className="flex mb-6 bg-muted rounded-lg p-1">
            <Button 
              variant={isLogin ? "default" : "ghost"} 
              onClick={() => setIsLogin(true)} 
              className="flex-1"
              size="sm"
            >
              Login
            </Button>
            <Button 
              variant={!isLogin ? "default" : "ghost"} 
              onClick={() => setIsLogin(false)} 
              className="flex-1"
              size="sm"
            >
              Register
            </Button>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-muted-foreground mt-2">
              {isLogin ? 'Sign in to your account' : 'Join PGConnect today'}
            </p>
          </div>

          {message && (
            <div className={`flex items-center gap-2 p-3 rounded-lg mb-4 ${
              message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {message.type === 'success' ? 
                <CheckCircle className="h-4 w-4" /> : 
                <AlertCircle className="h-4 w-4" />
              }
              <span className="text-sm">{message.text}</span>
            </div>
          )}

          <div className="space-y-4">
            {/* Google Sign-In */}
            <Button 
              variant="outline" 
              onClick={handleGoogleSignIn}
              className="w-full"
              disabled={loading}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            {/* Email/Password Form */}
            {!isLogin && (
              <div>
                <Label>Full Name</Label>
                <Input
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                />
              </div>
            )}

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>

            <div>
              <Label>Password</Label>
              <PasswordInput
                value={formData.password}
                onChange={(value) => handleInputChange('password', value)}
                placeholder={isLogin ? "Enter your password" : "Create a password"}
                showStrength={!isLogin}
              />
            </div>

            {!isLogin && (
              <div>
                <Label>Confirm Password</Label>
                <PasswordInput
                  value={formData.confirmPassword}
                  onChange={(value) => handleInputChange('confirmPassword', value)}
                  placeholder="Confirm your password"
                />
              </div>
            )}

            <Button 
              onClick={isLogin ? handleEmailLogin : handleRegister} 
              className="w-full" 
              disabled={loading}
            >
              {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
            </Button>

            {isLogin && (
              <div className="text-center">
                <button 
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-primary hover:underline"
                >
                  Forgot your password?
                </button>
              </div>
            )}

            <div className="text-center text-sm text-muted-foreground">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={() => setIsLogin(!isLogin)} 
                className="text-primary hover:underline"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </div>
          </div>
            </Card>
          </div>
        </div>

        {/* Right Side - Spline 3D Scene */}
        <div className="flex-1 bg-gradient-to-br from-primary via-primary/90 to-purple-600">
          <Spline scene="https://prod.spline.design/rU2-Ks0SC0T5od9B/scene.splinecode" />
        </div>
      </div>
    </div>
  );
};

export default Auth;