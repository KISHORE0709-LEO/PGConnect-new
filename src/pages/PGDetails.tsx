import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MapPin, 
  IndianRupee, 
  Users, 
  Wifi, 
  Utensils,
  Star,
  Phone,
  Mail,
  Home,
  ArrowLeft,
  Building,
  CheckCircle2
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import BuildingVisualizer from "@/components/BuildingVisualizer";
import PGLocationMap from "@/components/PGLocationMap";
import GooglePayBooking from "@/components/GooglePayBooking";

// Mock detailed PG data
const pgDetails = {
  id: 1,
  name: "Green Valley PG",
  location: "Jayanagar, Bangalore",
  price: 8500,
  sharing: "2-3 Sharing",
  gender: "Boys",
  rating: 4.5,
  reviews: 28,
  amenities: ["WiFi", "Food", "Laundry", "Power Backup", "Security"],
  availability: 3,
  description: "Well-maintained PG with all modern amenities. Close to metro station and major IT parks. Includes daily housekeeping and WiFi.",
  floors: 3,
  roomsPerFloor: 4,
  latitude: 12.9279,
  longitude: 77.5619,
  owner: {
    name: "Rajesh Kumar",
    phone: "+91 98765 43210",
    email: "rajesh@example.com"
  },
  images: [
    "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"
  ]
};

const PGDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [pgData, setPgData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    const fetchPGDetails = async () => {
      try {
        const { db } = await import('@/config/firebase');
        const { collection, doc, getDoc } = await import('firebase/firestore');

        const docRef = doc(db, 'pgs', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setPgData({
            id: docSnap.id,
            ...data
          });
        } else {
          console.error('PG not found');
        }
      } catch (error) {
        console.error('Error fetching PG details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPGDetails();
    }
  }, [id]);

  // Use real data or fallback to mock data
  const displayData = pgData ? {
    ...pgDetails,
    id: pgData.id,
    name: pgData.name,
    location: `${pgData.address}, ${pgData.city}`,
    price: pgData.monthlyRent || pgDetails.price,
    sharing: pgData.sharing || pgDetails.sharing,
    gender: pgData.pgType || pgDetails.gender,
    rating: pgData.rating || pgDetails.rating,
    amenities: pgData.amenities || pgDetails.amenities,
    availability: pgData.availableRooms || pgDetails.availability,
    description: pgData.description || pgDetails.description,
    images: pgData.images && pgData.images.length > 0 ? pgData.images : pgDetails.images,
    latitude: pgData.latitude || pgDetails.latitude,
    longitude: pgData.longitude || pgDetails.longitude,
    owner: {
      name: pgData.ownerName || pgDetails.owner.name,
      phone: pgData.ownerPhone || pgDetails.owner.phone,
      email: pgData.ownerEmail || pgDetails.owner.email
    }
  } : pgDetails;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading PG details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-50 backdrop-blur-lg bg-card/95">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/student')}>
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Search
          </Button>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">PG<span className="text-primary">Connect</span></h1>
            <Badge variant="secondary">Student</Badge>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card className="overflow-hidden">
              <div className="h-96 relative">
                <img 
                  src={displayData.images[selectedImage]}
                  alt={displayData.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 flex gap-2">
                  {displayData.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        selectedImage === idx ? 'bg-primary w-8' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </Card>

            {/* Basic Info */}
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{displayData.name}</h1>
                  <div className="flex items-center text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    {displayData.location}
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-primary/10 px-3 py-2 rounded-lg">
                  <Star className="h-5 w-5 fill-primary text-primary" />
                  <span className="font-bold text-lg">{displayData.rating}</span>
                  <span className="text-sm text-muted-foreground">({displayData.reviews})</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mb-4">
                <Badge variant="outline" className="text-sm py-1">
                  <Users className="h-4 w-4 mr-1" />
                  {displayData.sharing}
                </Badge>
                <Badge variant="outline" className="text-sm py-1">
                  {displayData.gender}
                </Badge>
                <Badge className="bg-success text-sm py-1">
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  {displayData.availability} rooms available
                </Badge>
              </div>

              <p className="text-muted-foreground">{displayData.description}</p>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="amenities" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="amenities">Amenities</TabsTrigger>
                <TabsTrigger value="building">Building Layout</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
              </TabsList>

              <TabsContent value="amenities">
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-4">Available Amenities</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {displayData.amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          {amenity === "WiFi" && <Wifi className="h-5 w-5 text-primary" />}
                          {amenity === "Food" && <Utensils className="h-5 w-5 text-primary" />}
                          {amenity === "Security" && <Home className="h-5 w-5 text-primary" />}
                          {amenity === "Laundry" && <CheckCircle2 className="h-5 w-5 text-primary" />}
                          {amenity === "Power Backup" && <Building className="h-5 w-5 text-primary" />}
                        </div>
                        <span className="font-medium">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="building">
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-4">3D Building Visualization</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Interactive 3D view showing room availability across all floors
                  </p>
                  <BuildingVisualizer 
                    floors={pgData?.buildingLayout?.floors || displayData.floors} 
                    roomsPerFloor={pgData?.buildingLayout?.roomsPerFloor || displayData.roomsPerFloor}
                    pgId={id}
                  />
                </Card>
              </TabsContent>

              <TabsContent value="location">
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-4">PG Location</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    View exact location and nearby landmarks
                  </p>
                  <PGLocationMap 
                    location={displayData.location}
                    pgName={displayData.name}
                    latitude={displayData.latitude}
                    longitude={displayData.longitude}
                  />
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <Card className="p-6 sticky top-24">
              <div className="flex items-center text-3xl font-bold text-primary mb-6">
                <IndianRupee className="h-7 w-7" />
                {displayData.price.toLocaleString()}
                <span className="text-sm text-muted-foreground font-normal ml-2">/month</span>
              </div>

              <Button size="lg" className="w-full mb-3" onClick={() => setShowBookingModal(true)}>
                Book Now
              </Button>
              <Button size="lg" variant="outline" className="w-full">
                Schedule Visit
              </Button>

              <div className="mt-6 pt-6 border-t space-y-4">
                <h4 className="font-semibold mb-3">Contact Owner</h4>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{displayData.owner.name}</p>
                    <p className="text-muted-foreground">{displayData.owner.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-muted-foreground">{displayData.owner.email}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Google Pay Booking Modal */}
      <GooglePayBooking 
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        pgData={{
          name: displayData.name,
          price: displayData.price,
          location: displayData.location
        }}
      />
    </div>
  );
};

export default PGDetails;
