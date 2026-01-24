import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Users, IndianRupee, MapPin, Wifi, Car, Utensils, Shield, Zap, Shirt, Wind, Camera } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import SimpleBuildingView from "@/components/SimpleBuildingView";
import BuildingVisualizer from "@/components/BuildingVisualizer";
import Footer from "@/components/Footer";
import { db } from "@/config/firebase";
import { doc, getDoc } from "firebase/firestore";

const PGManagement = () => {
  const navigate = useNavigate();
  const { pgId } = useParams();
  const [pgData, setPgData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPGData = async () => {
      try {
        if (!pgId) {
          setLoading(false);
          return;
        }
        
        const pgDocRef = doc(db, 'pgs', pgId);
        const pgDocSnap = await getDoc(pgDocRef);
        
        if (pgDocSnap.exists()) {
          const data = pgDocSnap.data();
          setPgData({
            id: pgDocSnap.id,
            name: data.name,
            description: data.description,
            address: data.address,
            pgType: data.pgType,
            monthlyRent: data.monthlyRent,
            nearestCollege: data.nearestCollege,
            distance: data.distance,
            amenities: data.amenities || [],
            totalRooms: data.totalRooms,
            occupiedRooms: (data.totalRooms || 0) - (data.availableRooms || 0),
            availableRooms: data.availableRooms,
            availability: data.availability,
            gateOpening: data.gateOpening,
            gateClosing: data.gateClosing,
            smokingAllowed: data.smokingAllowed,
            drinkingAllowed: data.drinkingAllowed,
            buildingLayout: data.buildingLayout
          });
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPGData();
  }, [pgId]);

  const getAmenityIcon = (amenity) => {
    const icons = {
      'WiFi': Wifi,
      'Parking': Car,
      'Food Included': Utensils,
      'CCTV': Shield,
      'Power Backup': Zap,
      'Laundry': Shirt,
      'AC': Wind,
      'Attached Bathroom': Camera
    };
    return icons[amenity] || Shield;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!pgData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Loading PG data...</h2>
          <Button onClick={() => navigate('/owner-dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  const occupancyRate = pgData.totalRooms > 0 ? Math.round((pgData.occupiedRooms / pgData.totalRooms) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-50 backdrop-blur-lg bg-card/95">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/owner-dashboard')}>
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* PG Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{pgData.name}</h1>
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <MapPin className="h-5 w-5" />
            <span>{pgData.address}</span>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <Badge variant="secondary">{pgData.pgType} PG</Badge>
            <Badge variant="outline">{pgData.nearestCollege} - {pgData.distance}km</Badge>
          </div>
          <div className="text-3xl font-bold text-primary mb-6">
            ₹{pgData.monthlyRent?.toLocaleString()}
            <span className="text-lg text-muted-foreground ml-2">per month</span>
          </div>
          <p className="text-muted-foreground leading-relaxed">{pgData.description}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Amenities */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Amenities</h3>
              <div className="flex flex-wrap gap-3">
                {pgData.amenities?.map((amenity, index) => {
                  const IconComponent = getAmenityIcon(amenity);
                  return (
                    <div key={index} className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg">
                      <IconComponent className="h-5 w-5" />
                      <span>{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Room Summary */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Room Summary</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Rooms</span>
                <span className="font-semibold text-lg">{pgData.totalRooms}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Occupied</span>
                <span className="font-semibold text-lg text-red-600">{pgData.occupiedRooms}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Available</span>
                <span className="font-semibold text-lg text-green-600">{pgData.availableRooms}</span>
              </div>
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Occupancy Rate</span>
                  <span className="font-semibold text-lg">{occupancyRate}%</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* House Rules */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">House Rules</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Gate Opens</span>
                <span className="font-medium">{pgData.gateOpening}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Gate Closes</span>
                <span className="font-medium">{pgData.gateClosing}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Smoking</span>
                <Badge variant={pgData.smokingAllowed ? "default" : "secondary"}>
                  {pgData.smokingAllowed ? 'Allowed' : 'Not Allowed'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Drinking</span>
                <Badge variant={pgData.drinkingAllowed ? "default" : "secondary"}>
                  {pgData.drinkingAllowed ? 'Allowed' : 'Not Allowed'}
                </Badge>
              </div>
            </div>
          </Card>

          {/* Current Status */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Current Status</h3>
            <div className="text-center">
              <Badge 
                variant={pgData.availability === 'open' ? "default" : "secondary"}
                className="text-lg px-6 py-3"
              >
                {pgData.availability === 'open' ? 'Open for Bookings' : 'Closed'}
              </Badge>
            </div>
          </Card>
        </div>

        {/* Building Layout */}
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">Building Layout</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Interactive view showing room availability across all floors
          </p>
          <BuildingVisualizer 
            floors={Math.ceil((pgData.totalRooms || 12) / 6)}
            roomsPerFloor={6}
          />
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <Button size="lg">
            <Calendar className="h-5 w-5 mr-2" />
            View Bookings
          </Button>
          <Button size="lg" variant="outline">
            <Users className="h-5 w-5 mr-2" />
            Manage Tenants
          </Button>
          <Button size="lg" variant="outline">
            <IndianRupee className="h-5 w-5 mr-2" />
            Payment History
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PGManagement;