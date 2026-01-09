export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email) {
    return { isValid: false, error: "Email is required" };
  }
  
  if (!emailRegex.test(email)) {
    return { isValid: false, error: "Please enter a valid email address" };
  }
  
  return { isValid: true };
};

export const validatePassword = (password: string, fullName?: string, email?: string, username?: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Minimum length
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  // Must include uppercase
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must include at least one uppercase letter");
  }

  // Must include lowercase
  if (!/[a-z]/.test(password)) {
    errors.push("Password must include at least one lowercase letter");
  }

  // Must include number
  if (!/[0-9]/.test(password)) {
    errors.push("Password must include at least one number");
  }

  // Must include special character
  if (!/[@#$%&*!?]/.test(password)) {
    errors.push("Password must include at least one special character (@#$%&*!?)");
  }

  // Should not include personal info
  if (fullName && password.toLowerCase().includes(fullName.toLowerCase())) {
    errors.push("Password should not contain your name");
  }

  if (email && password.toLowerCase().includes(email.split('@')[0].toLowerCase())) {
    errors.push("Password should not contain your email username");
  }

  if (username && password.toLowerCase().includes(username.toLowerCase())) {
    errors.push("Password should not contain your username");
  }

  // Common weak patterns
  const weakPatterns = ['123456', 'password', 'abcdef', '111111', '000000'];
  if (weakPatterns.some(pattern => password.toLowerCase().includes(pattern))) {
    errors.push("Password contains common weak patterns");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};