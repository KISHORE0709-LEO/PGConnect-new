import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  MapPin,
  IndianRupee,
  Users,
  Wifi,
  Car,
  Utensils,
  Shield,
  Zap,
  Shirt,
  Wind,
  Camera,
  Building2
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "@/config/firebase";
import { doc, getDoc } from "firebase/firestore";
import InteractiveBuildingLayout from "@/components/InteractiveBuildingLayout";

const OwnerPGDashboard = () => {
  const navigate = useNavigate();
  const { pgId } = useParams();
  const [pgData, setPgData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPGData = async () => {
      if (!pgId) {
        setLoading(false);
        return;
      }
      
      try {
        // First try to get by document ID
        const docRef = doc(db, 'pgs', pgId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setPgData({ id: docSnap.id, ...docSnap.data() });
        } else {
          // If not found by ID, try to find by owner email (for newly created PGs)
          const { auth } = await import('@/config/firebase');
          const { collection, query, where, getDocs } = await import('firebase/firestore');
          const currentUser = auth.currentUser;
          
          if (currentUser) {
            const pgsQuery = query(
              collection(db, 'pgs'),
              where('ownerEmail', '==', currentUser.email)
            );
            const pgsSnapshot = await getDocs(pgsQuery);
            
            if (!pgsSnapshot.empty) {
              // Get the first PG (or the one matching the ID)
              const pgDoc = pgsSnapshot.docs.find(doc => doc.id === pgId) || pgsSnapshot.docs[0];
              setPgData({ id: pgDoc.id, ...pgDoc.data() });
            } else {
              console.log('No PG found for this owner');
              setPgData(null);
            }
          } else {
            console.log('No authenticated user');
            setPgData(null);
          }
        }
      } catch (error) {
        console.error('Error fetching PG:', error);
        setPgData(null);
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
          <h2 className="text-xl font-bold mb-4">No PG data available</h2>
          <p className="text-muted-foreground mb-4">Please register a PG first or check your connection.</p>
          <Button onClick={() => navigate('/owner/dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  const totalRooms = pgData.totalRooms || 0;
  const availableRooms = pgData.availableRooms || 0;
  const occupiedRooms = totalRooms - availableRooms;
  const monthlyRevenue = occupiedRooms * (pgData.monthlyRent || 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-50 backdrop-blur-lg bg-card/95">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/owner/dashboard')}>
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold">PG<span className="text-primary">Connect</span></h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* PG Details */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">{pgData.name}</h1>
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4" />
                  <span>{pgData.address}</span>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <Badge variant="secondary">{pgData.pgType} PG</Badge>
                  <Badge variant="outline">{pgData.nearestCollege} - {pgData.distance}km</Badge>
                </div>
                <div className="text-2xl font-bold text-primary mb-4">
                  ₹{pgData.monthlyRent?.toLocaleString()}
                  <span className="text-sm text-muted-foreground ml-2">per month</span>
                </div>
                <p className="text-muted-foreground">{pgData.description}</p>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {pgData.amenities?.map((amenity, index) => {
                    const IconComponent = getAmenityIcon(amenity);
                    return (
                      <div key={index} className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
                        <IconComponent className="h-4 w-4" />
                        <span className="text-sm">{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          </div>

          {/* Stats */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Room Summary</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Rooms</span>
                  <span className="font-semibold">{totalRooms}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Occupied</span>
                  <span className="font-semibold text-red-600">{occupiedRooms}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Available</span>
                  <span className="font-semibold text-green-600">{availableRooms}</span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Occupancy Rate</span>
                    <span className="font-semibold">{totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0}%</span>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Monthly Revenue</span>
                    <span className="font-semibold text-primary">₹{monthlyRevenue.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">House Rules</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Gate Opens</span>
                  <span className="font-medium">{pgData.gateOpening || 'Not set'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Gate Closes</span>
                  <span className="font-medium">{pgData.gateClosing || 'Not set'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Smoking</span>
                  <Badge variant={pgData.smokingAllowed ? "default" : "secondary"}>
                    {pgData.smokingAllowed ? 'Allowed' : 'Not Allowed'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Drinking</span>
                  <Badge variant={pgData.drinkingAllowed ? "default" : "secondary"}>
                    {pgData.drinkingAllowed ? 'Allowed' : 'Not Allowed'}
                  </Badge>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Status</h3>
              <div className="text-center">
                <Badge 
                  variant={pgData.availability === 'open' ? "default" : "secondary"}
                  className="text-lg px-4 py-2"
                >
                  {pgData.availability === 'open' ? 'Open for Bookings' : 'Closed'}
                </Badge>
              </div>
            </Card>
          </div>
        </div>

        {/* Interactive Building Layout */}
        <InteractiveBuildingLayout 
          buildingConfig={pgData.buildingConfiguration}
          pgName={pgData.name}
        />
      </div>
    </div>
  );
};

export default OwnerPGDashboard;