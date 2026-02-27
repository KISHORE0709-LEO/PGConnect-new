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
import BuildingVisualizer from "@/components/BuildingVisualizer";

const OwnerPGDashboard = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const pgId = id;
  const [pgData, setPgData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPGData = async () => {
      if (!pgId) {
        console.log('No pgId provided');
        setLoading(false);
        return;
      }
      
      try {
        console.log('Fetching PG with ID:', pgId);
        const docRef = doc(db, 'pgs', pgId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() };
          console.log('PG data found:', data);
          setPgData(data);
        } else {
          console.log('PG document not found with ID:', pgId);
          setPgData(null);
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
        {/* PG Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{pgData.name}</h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{pgData.address}</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground mb-1">Total Rooms</div>
            <div className="text-2xl font-bold">{totalRooms}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground mb-1">Occupied</div>
            <div className="text-2xl font-bold text-red-600">{occupiedRooms}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground mb-1">Available</div>
            <div className="text-2xl font-bold text-green-600">{availableRooms}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground mb-1">Monthly Revenue</div>
            <div className="text-2xl font-bold text-primary">₹{monthlyRevenue.toLocaleString()}</div>
          </Card>
        </div>

        {/* Building Layout */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6">Building Layout</h2>
          <BuildingVisualizer buildingData={pgData.buildingConfiguration} />
        </Card>
      </div>
    </div>
  );
};

export default OwnerPGDashboard;