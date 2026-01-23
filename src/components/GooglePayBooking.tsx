import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  IndianRupee,
  CreditCard,
  CheckCircle2,
  Calendar,
  User,
  Phone,
  Mail,
  Shield
} from "lucide-react";

interface GooglePayBookingProps {
  isOpen: boolean;
  onClose: () => void;
  pgData: {
    name: string;
    price: number;
    location: string;
  };
}

const GooglePayBooking = ({ isOpen, onClose, pgData }: GooglePayBookingProps) => {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    name: "",
    email: "",
    phone: "",
    checkInDate: "",
    duration: "1"
  });
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  const handleGooglePay = async () => {
    setPaymentProcessing(true);
    
    // Simulate Google Pay API call
    setTimeout(() => {
      setPaymentProcessing(false);
      setPaymentSuccess(true);
      setStep(3);
    }, 3000);
  };

  const totalAmount = pgData.price + 500; // Security deposit
  const securityDeposit = 500;

  const resetAndClose = () => {
    setStep(1);
    setPaymentSuccess(false);
    setPaymentProcessing(false);
    setBookingData({
      name: "",
      email: "",
      phone: "",
      checkInDate: "",
      duration: "1"
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetAndClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {step === 1 && "📋 Booking Details"}
            {step === 2 && "💳 Payment"}
            {step === 3 && "✅ Booking Confirmed"}
          </DialogTitle>
        </DialogHeader>

        {/* Step 1: Booking Form */}
        {step === 1 && (
          <div className="space-y-4">
            <Card className="p-4 bg-muted/50">
              <h3 className="font-semibold">{pgData.name}</h3>
              <p className="text-sm text-muted-foreground">{pgData.location}</p>
              <div className="flex items-center mt-2">
                <IndianRupee className="h-4 w-4" />
                <span className="font-bold">{pgData.price.toLocaleString()}/month</span>
              </div>
            </Card>

            <div className="space-y-3">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={bookingData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={bookingData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="+91 98765 43210"
                  value={bookingData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="checkIn">Check-in Date</Label>
                <Input
                  id="checkIn"
                  type="date"
                  value={bookingData.checkInDate}
                  onChange={(e) => handleInputChange('checkInDate', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="duration">Duration (months)</Label>
                <select
                  id="duration"
                  className="w-full p-2 border rounded-md"
                  value={bookingData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                >
                  <option value="1">1 Month</option>
                  <option value="3">3 Months</option>
                  <option value="6">6 Months</option>
                  <option value="12">12 Months</option>
                </select>
              </div>
            </div>

            <Button 
              className="w-full" 
              onClick={() => setStep(2)}
              disabled={!bookingData.name || !bookingData.email || !bookingData.phone || !bookingData.checkInDate}
            >
              Continue to Payment
            </Button>
          </div>
        )}

        {/* Step 2: Payment */}
        {step === 2 && (
          <div className="space-y-4">
            <Card className="p-4 border-2 border-primary/20">
              <h3 className="font-semibold mb-3">Payment Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Monthly Rent</span>
                  <span>₹{pgData.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Security Deposit</span>
                  <span>₹{securityDeposit.toLocaleString()}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>Total Amount</span>
                  <span>₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </Card>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-amber-800">
                <Shield className="h-4 w-4" />
                <span className="text-sm font-medium">Demo Payment Mode</span>
              </div>
              <p className="text-xs text-amber-700 mt-1">
                This is a simulation for demonstration purposes. No real payment will be processed.
              </p>
            </div>

            {paymentProcessing ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="font-medium">Processing Google Pay...</p>
                <p className="text-sm text-muted-foreground">Please complete payment on your device</p>
              </div>
            ) : (
              <div className="space-y-3">
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleGooglePay}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-xs">G</span>
                    </div>
                    Pay with Google Pay - ₹{totalAmount.toLocaleString()}
                  </div>
                </Button>

                <Button variant="outline" className="w-full" onClick={() => setStep(1)}>
                  Back to Details
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Success */}
        {step === 3 && paymentSuccess && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-green-600">Booking Confirmed!</h3>
              <p className="text-muted-foreground">Your PG booking has been successfully processed</p>
            </div>

            <Card className="p-4 text-left">
              <h4 className="font-semibold mb-2">Booking Details</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Booking ID:</span>
                  <span className="font-mono">PG{Date.now().toString().slice(-6)}</span>
                </div>
                <div className="flex justify-between">
                  <span>PG Name:</span>
                  <span>{pgData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Check-in:</span>
                  <span>{new Date(bookingData.checkInDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span>{bookingData.duration} month(s)</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount Paid:</span>
                  <span>₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </Card>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                📧 Confirmation details sent to {bookingData.email}
              </p>
              <p className="text-sm text-blue-800">
                📱 Owner will contact you at {bookingData.phone}
              </p>
            </div>

            <Button className="w-full" onClick={resetAndClose}>
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GooglePayBooking;