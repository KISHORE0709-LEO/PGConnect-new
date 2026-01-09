import { useState, useEffect } from "react";
import { Check, X, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  showStrength?: boolean;
}

interface PasswordStrength {
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  hasMinLength: boolean;
  score: number;
}

const PasswordInput = ({ value, onChange, placeholder = "Enter password", showStrength = false }: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [strength, setStrength] = useState<PasswordStrength>({
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false,
    hasMinLength: false,
    score: 0
  });

  useEffect(() => {
    const newStrength = {
      hasUppercase: /[A-Z]/.test(value),
      hasLowercase: /[a-z]/.test(value),
      hasNumber: /\d/.test(value),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
      hasMinLength: value.length >= 8,
      score: 0
    };

    newStrength.score = Object.values(newStrength).slice(0, 5).filter(Boolean).length;
    setStrength(newStrength);
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    setCapsLockOn(e.getModifierState('CapsLock'));
  };

  const getStrengthColor = () => {
    if (strength.score <= 2) return "text-red-500";
    if (strength.score <= 3) return "text-yellow-500";
    if (strength.score <= 4) return "text-blue-500";
    return "text-green-500";
  };

  const getStrengthText = () => {
    if (strength.score <= 2) return "Weak";
    if (strength.score <= 3) return "Fair";
    if (strength.score <= 4) return "Good";
    return "Strong";
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pr-20"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {capsLockOn && (
            <AlertTriangle className="h-4 w-4 text-yellow-500" title="Caps Lock is on" />
          )}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {showStrength && value && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm">Password strength:</span>
            <span className={`text-sm font-medium ${getStrengthColor()}`}>
              {getStrengthText()}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                strength.score <= 2 ? 'bg-red-500' :
                strength.score <= 3 ? 'bg-yellow-500' :
                strength.score <= 4 ? 'bg-blue-500' : 'bg-green-500'
              }`}
              style={{ width: `${(strength.score / 5) * 100}%` }}
            />
          </div>

          <div className="grid grid-cols-1 gap-1 text-xs">
            <div className={`flex items-center gap-1 ${strength.hasMinLength ? 'text-green-600' : 'text-gray-500'}`}>
              {strength.hasMinLength ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
              At least 8 characters
            </div>
            <div className={`flex items-center gap-1 ${strength.hasUppercase ? 'text-green-600' : 'text-gray-500'}`}>
              {strength.hasUppercase ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
              One uppercase letter
            </div>
            <div className={`flex items-center gap-1 ${strength.hasLowercase ? 'text-green-600' : 'text-gray-500'}`}>
              {strength.hasLowercase ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
              One lowercase letter
            </div>
            <div className={`flex items-center gap-1 ${strength.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
              {strength.hasNumber ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
              One number
            </div>
            <div className={`flex items-center gap-1 ${strength.hasSpecialChar ? 'text-green-600' : 'text-gray-500'}`}>
              {strength.hasSpecialChar ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
              One special character
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordInput;