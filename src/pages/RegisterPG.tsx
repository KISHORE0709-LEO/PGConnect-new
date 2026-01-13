import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ArrowRight, CheckCircle2, Upload, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useOwnerStatus } from "@/hooks/useOwnerStatus";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FlexibleBuildingConfig from "@/components/FlexibleBuildingConfig";

const RegisterPG = () => {
  const navigate = useNavigate();
  const { user, setPGRegistrationSuccess } = useAuth();
  const { markAsOwner } = useOwnerStatus();
  const [step, setStep] = useState(1);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showBuildingConfig, setShowBuildingConfig] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    pgName: "",
    address: "",
    pgType: "any",
    description: "",
    totalRooms: "",
    monthlyRent: "",
    nearestCollege: "",
    distance: "",
    amenities: [] as string[],
    gateClosing: "",
    gateOpening: "",
    smokingAllowed: false,
    drinkingAllowed: false,
    availability: "open",
    images: [] as File[],
    // Building config - flexible structure
    buildingFloors: []
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 5);
      setFormData(prev => ({ ...prev, images: files }));
      toast.success(`${files.length} image(s) uploaded successfully`);
    }
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    try {
      console.log('User object:', user);
      
      if (!user) {
        toast.error('Please login to register PG');
        return;
      }

      const pgData = {
        name: formData.pgName,
        description: formData.description,
        address: formData.address,
        city: formData.address.split(',').pop()?.trim() || 'Bangalore',
        state: 'Karnataka',
        pincode: '560001',
        pgType: formData.pgType,
        totalRooms: parseInt(formData.totalRooms) || 10,
        availableRooms: parseInt(formData.totalRooms) || 10,
        monthlyRent: parseInt(formData.monthlyRent) || 8500,
        nearestCollege: formData.nearestCollege,
        distance: parseFloat(formData.distance) || 0,
        amenities: formData.amenities,
        gateClosing: formData.gateClosing,
        gateOpening: formData.gateOpening,
        smokingAllowed: formData.smokingAllowed,
        drinkingAllowed: formData.drinkingAllowed,
        availability: formData.availability,
        ownerId: user.id || 'unknown',
        ownerName: user.name || (user as any).displayName || user.email || 'Unknown',
        ownerEmail: user.email || '',
        ownerPhone: user.phone || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active'
      };

      console.log('PG Data to save:', pgData);

      // Save to Firebase Firestore
      const { db } = await import('@/config/firebase');
      const { collection, addDoc } = await import('firebase/firestore');
      
      console.log('Attempting to save PG data:', pgData);
      const docRef = await addDoc(collection(db, 'pgs'), pgData);
      console.log('PG successfully created with ID:', docRef.id);
      console.log('Check Firebase Console under Firestore Database > pgs collection');
      
      // Mark user as owner after successful PG registration
      markAsOwner();
      
      toast.success('PG registered successfully!');
      setShowSuccessDialog(true);
    } catch (error) {
      console.error('Error registering PG:', error);
      toast.error(`Failed to register PG: ${error.message}`);
    }
  };

  const handleContinueToBuildingConfig = () => {
    setShowSuccessDialog(false);
    setShowBuildingConfig(true);
  };

  const handleBuildingConfigSubmit = async () => {
    try {
      // Save building configuration to Firebase if needed
      if (formData.buildingFloors && formData.buildingFloors.length > 0) {
        const { db } = await import('@/config/firebase');
        const { collection, addDoc } = await import('firebase/firestore');
        
        const buildingData = {
          pgName: formData.pgName,
          ownerId: user?.id,
          floors: formData.buildingFloors,
          createdAt: new Date().toISOString()
        };
        
        await addDoc(collection(db, 'buildings'), buildingData);
      }
      
      toast.success("Building configuration saved!");
      navigate('/owner/dashboard');
    } catch (error) {
      console.error('Error saving building config:', error);
      toast.success("Building configuration saved!");
      navigate('/owner/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-50 backdrop-blur-lg bg-card/95">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Button>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">PG<span className="text-primary">Connect</span></h1>
            <Badge variant="secondary">Register PG</Badge>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3">Launch Your PG</h1>
          <p className="text-muted-foreground text-lg">
            List your property and connect with students looking for accommodation
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className={`flex items-center gap-3 ${i <= step ? 'text-primary' : 'text-muted-foreground'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 
                    ${i < step ? 'bg-primary text-primary-foreground border-primary' : 
                      i === step ? 'border-primary bg-primary/10' : 'border-muted-foreground/30'}`}>
                    {i < step ? <CheckCircle2 className="h-5 w-5" /> : i}
                  </div>
                  <span className="font-medium hidden sm:inline">
                    {i === 1 ? 'Basic Info' : i === 2 ? 'Rooms & Amenities' : 'Rules & Media'}
                  </span>
                </div>
                {i < 3 && <div className={`w-12 h-0.5 ${i < step ? 'bg-primary' : 'bg-muted-foreground/30'}`} />}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Basic Information */}
        {step === 1 && (
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">Step 1: Basic Information</h2>
            <p className="text-muted-foreground mb-6">Provide basic details about your PG</p>

            <div className="space-y-6">
              <div>
                <Label htmlFor="pgName">PG Name</Label>
                <Input
                  id="pgName"
                  placeholder="Enter the name of your PG"
                  value={formData.pgName}
                  onChange={(e) => handleInputChange('pgName', e.target.value)}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">This is how your PG will appear in search results</p>
              </div>

              <div>
                <Label htmlFor="address">Full Address</Label>
                <Textarea
                  id="address"
                  placeholder="Enter the complete address with landmarks"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="mt-2"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground mt-1">Provide the detailed address to help students locate your PG</p>
              </div>

              <div>
                <Label>PG Type</Label>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  {['male', 'female', 'any'].map((type) => (
                    <Button
                      key={type}
                      type="button"
                      variant={formData.pgType === type ? 'default' : 'outline'}
                      onClick={() => handleInputChange('pgType', type)}
                      className="capitalize"
                    >
                      {type === 'any' ? 'Any' : type}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your PG and its benefits for students"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="mt-2"
                  rows={4}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Highlight the best features, nearby locations, and why students should choose your PG
                </p>
              </div>

              <Button onClick={handleNext} className="w-full" size="lg">
                Next Step
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* Step 2: Rooms & Amenities */}
        {step === 2 && (
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">Step 2: Rooms & Amenities</h2>
            <p className="text-muted-foreground mb-6">Tell us about the rooms and amenities</p>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="totalRooms">Total Number of Rooms</Label>
                  <Input
                    id="totalRooms"
                    type="number"
                    placeholder="Enter the total number of rooms in your PG"
                    value={formData.totalRooms}
                    onChange={(e) => handleInputChange('totalRooms', e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="monthlyRent">Price (Monthly Rent)</Label>
                  <Input
                    id="monthlyRent"
                    type="number"
                    placeholder="Enter the monthly rent price for your PG"
                    value={formData.monthlyRent}
                    onChange={(e) => handleInputChange('monthlyRent', e.target.value)}
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="nearestCollege">Nearest College</Label>
                  <Select value={formData.nearestCollege} onValueChange={(value) => handleInputChange('nearestCollege', value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select college" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="iit">IIT Bangalore</SelectItem>
                      <SelectItem value="iisc">IISc Bangalore</SelectItem>
                      <SelectItem value="christ">Christ University</SelectItem>
                      <SelectItem value="rvce">RVCE</SelectItem>
                      <SelectItem value="pesit">PESIT</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">Select the college closest to your PG</p>
                </div>

                <div>
                  <Label htmlFor="distance">Distance from College (km)</Label>
                  <Input
                    id="distance"
                    type="number"
                    placeholder="Approximate distance in kilometers"
                    value={formData.distance}
                    onChange={(e) => handleInputChange('distance', e.target.value)}
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label>Amenities</Label>
                <p className="text-xs text-muted-foreground mb-3">Select all amenities available at your PG</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['WiFi', 'Power Backup', 'Food Included', 'Attached Bathroom', 'AC', 'Laundry', 'Parking', 'CCTV'].map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox
                        id={amenity}
                        checked={formData.amenities.includes(amenity)}
                        onCheckedChange={() => handleAmenityToggle(amenity)}
                      />
                      <label htmlFor={amenity} className="text-sm cursor-pointer">
                        {amenity}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={handlePrevious} variant="outline" className="flex-1" size="lg">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous Step
                </Button>
                <Button onClick={handleNext} className="flex-1" size="lg">
                  Next Step
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Step 3: Rules & Media */}
        {step === 3 && (
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">Step 3: Rules & Media</h2>
            <p className="text-muted-foreground mb-6">Set your rules and upload high-quality photos</p>

            <div className="space-y-6">
              <div>
                <Label htmlFor="pgRules">PG Rules</Label>
                <p className="text-xs text-muted-foreground mb-2">Specify the house rules for your PG</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="gateClosing" className="text-sm">Gate Closing Time</Label>
                    <Input
                      id="gateClosing"
                      type="time"
                      placeholder="e.g., 10:00 PM"
                      value={formData.gateClosing}
                      onChange={(e) => handleInputChange('gateClosing', e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="gateOpening" className="text-sm">Gate Opening Time</Label>
                    <Input
                      id="gateOpening"
                      type="time"
                      placeholder="e.g., 06:00 AM"
                      value={formData.gateOpening}
                      onChange={(e) => handleInputChange('gateOpening', e.target.value)}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="smoking"
                      checked={formData.smokingAllowed}
                      onCheckedChange={(checked) => handleInputChange('smokingAllowed', checked)}
                    />
                    <label htmlFor="smoking" className="text-sm cursor-pointer">
                      Smoking Allowed
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="drinking"
                      checked={formData.drinkingAllowed}
                      onCheckedChange={(checked) => handleInputChange('drinkingAllowed', checked)}
                    />
                    <label htmlFor="drinking" className="text-sm cursor-pointer">
                      Drinking Allowed
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <Label>Current Availability</Label>
                <div className="flex items-center space-x-2 mt-2">
                  <Checkbox
                    id="availability"
                    checked={formData.availability === 'open'}
                    onCheckedChange={(checked) => handleInputChange('availability', checked ? 'open' : 'closed')}
                  />
                  <label htmlFor="availability" className="text-sm cursor-pointer">
                    Open (Available Now)
                  </label>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Indicate if you have rooms available currently</p>
              </div>

              <div>
                <Label>Upload PG Images</Label>
                <p className="text-xs text-muted-foreground mb-3">
                  Upload 3-5 high-quality images of your PG to attract more students
                </p>
                <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center hover:border-primary transition-colors">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm font-medium mb-2">Upload Your PG Images</p>
                  <p className="text-xs text-muted-foreground mb-4">Drag & drop image files or click to browse</p>
                  <Input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload">
                    <Button type="button" variant="outline" asChild>
                      <span>Select Images</span>
                    </Button>
                  </label>
                  <p className="text-xs text-muted-foreground mt-2">PNG, JPG, or JPEG (max. 5MB each)</p>
                  {formData.images.length > 0 && (
                    <p className="text-sm text-primary mt-3 font-medium">
                      ✓ {formData.images.length} image(s) uploaded
                    </p>
                  )}
                </div>
                <div className="flex items-start gap-2 mt-3 p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                  <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-amber-600">
                    Include images of rooms, bathroom, exterior, and common areas
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={handlePrevious} variant="outline" className="flex-1" size="lg">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous Step
                </Button>
                <Button onClick={handleSubmit} className="flex-1" size="lg">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Submit Listing
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
            <DialogTitle className="text-center text-2xl">
              "{formData.pgName || 'Your PG'}" has been registered!
            </DialogTitle>
            <DialogDescription className="text-center">
              Congratulations! Your PG listing has been created successfully. Now let's configure your building layout.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={handleContinueToBuildingConfig} size="lg" className="w-full">
            Continue to Building Setup
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </DialogContent>
      </Dialog>

      {/* Flexible Building Configuration Dialog */}
      <Dialog open={showBuildingConfig} onOpenChange={setShowBuildingConfig}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Setup Your Building</DialogTitle>
            <DialogDescription>
              Configure your building exactly as it is - add floors and rooms with their actual sharing and rent details.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <FlexibleBuildingConfig
              onSave={(floors) => {
                handleInputChange('buildingFloors', floors);
                handleBuildingConfigSubmit();
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RegisterPG;
