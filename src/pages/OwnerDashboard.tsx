import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Plus,
  Users,
  IndianRupee,
  TrendingUp,
  Home,
  Phone,
  AlertCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { auth, db } from "@/config/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [pgs, setPgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPGs: 0,
    totalRooms: 0,
    occupiedRooms: 0,
    totalRevenue: 0,
    pendingPayments: 0
  });

  useEffect(() => {
    const fetchOwnerPGs = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          console.log('No authenticated user');
          setLoading(false);
          return;
        }

        console.log('Fetching PGs for user:', currentUser.uid);
        
        // Query PGs owned by current user
        const pgsQuery = query(
          collection(db, 'pgs'),
          where('ownerId', '==', currentUser.uid)
        );
        
        const querySnapshot = await getDocs(pgsQuery);
        console.log('Found PGs:', querySnapshot.size);
        
        const ownerPGs = [];
        let totalRooms = 0;
        let occupiedRooms = 0;
        let totalRevenue = 0;
        
        querySnapshot.forEach((doc) => {
          const pgData = doc.data();
          console.log('PG Data:', pgData);
          
          // Calculate real occupancy from building layout if available
          let actualOccupiedRooms = 0;
          let actualTotalRooms = pgData.totalRooms || 0;
          
          if (pgData.buildingLayout && pgData.buildingLayout.rooms) {
            actualTotalRooms = pgData.buildingLayout.rooms.length;
            actualOccupiedRooms = pgData.buildingLayout.rooms.filter(room => 
              room.status === 'occupied' || room.occupied > 0
            ).length;
          } else if (pgData.totalRooms && pgData.availableRooms !== undefined) {
            // Use available data from PG registration
            actualTotalRooms = pgData.totalRooms;
            actualOccupiedRooms = pgData.totalRooms - pgData.availableRooms;
          } else {
            // Default values if no data available
            actualTotalRooms = pgData.totalRooms || 12;
            actualOccupiedRooms = Math.floor(actualTotalRooms * 0.6); // 60% occupancy default
          }
          
          const pg = {
            id: doc.id,
            name: pgData.name || 'Unnamed PG',
            location: pgData.address || 'Location not specified',
            floors: Math.ceil(actualTotalRooms / 6) || 2,
            totalRooms: actualTotalRooms,
            occupiedRooms: actualOccupiedRooms,
            revenue: actualOccupiedRooms * (pgData.monthlyRent || 8500),
            pendingPayments: Math.floor(Math.random() * 3) // Mock for now
          };
          
          ownerPGs.push(pg);
          totalRooms += pg.totalRooms;
          occupiedRooms += pg.occupiedRooms;
          totalRevenue += pg.revenue;
        });
        
        setPgs(ownerPGs);
        setStats({
          totalPGs: ownerPGs.length,
          totalRooms,
          occupiedRooms,
          totalRevenue,
          pendingPayments: Math.floor(Math.random() * 5) // Mock for now
        });
        
      } catch (error) {
        console.error('Error fetching PGs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOwnerPGs();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-50 backdrop-blur-lg bg-card/95">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 
              className="text-2xl font-bold cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigate('/')}
            >
              PG<span className="text-primary">Connect</span>
            </h1>
            <Badge variant="secondary">Owner Dashboard</Badge>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={async () => {
                await logout();
                navigate('/');
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <Badge variant="secondary">{stats.totalPGs}</Badge>
            </div>
            <h3 className="text-2xl font-bold mb-1">{stats.totalRooms}</h3>
            <p className="text-sm text-muted-foreground">Total Rooms</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-success" />
              </div>
              <Badge className="bg-success">{stats.totalRooms > 0 ? Math.round((stats.occupiedRooms / stats.totalRooms) * 100) : 0}%</Badge>
            </div>
            <h3 className="text-2xl font-bold mb-1">{stats.occupiedRooms}/{stats.totalRooms}</h3>
            <p className="text-sm text-muted-foreground">Rooms Occupied</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <IndianRupee className="h-6 w-6 text-primary" />
              </div>
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
            <h3 className="text-2xl font-bold mb-1">₹{stats.totalRevenue.toLocaleString()}</h3>
            <p className="text-sm text-muted-foreground">Monthly Revenue</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow border-destructive/50">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
              <Badge variant="destructive">{stats.pendingPayments}</Badge>
            </div>
            <h3 className="text-2xl font-bold mb-1">Pending Payments</h3>
            <p className="text-sm text-muted-foreground">Requires attention</p>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <Button size="lg" onClick={() => navigate('/owner/register-pg')}>
            <Plus className="h-5 w-5 mr-2" />
            Register New PG
          </Button>
          <Button size="lg" variant="outline">
            <Users className="h-5 w-5 mr-2" />
            View All Tenants
          </Button>
        </div>

        {/* PG List */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-6">Your Properties</h2>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading your properties...</p>
            </div>
          ) : pgs.length === 0 ? (
            <Card className="p-8 text-center">
              <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No Properties Listed</h3>
              <p className="text-muted-foreground mb-4">
                You haven't registered any PG properties yet. Start by adding your first property.
              </p>
              <Button onClick={() => navigate('/owner/register-pg')}>
                <Plus className="h-4 w-4 mr-2" />
                Register Your First PG
              </Button>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {pgs.map((pg) => (
                <Card 
                  key={pg.id}
                  className="p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  onClick={() => navigate(`/owner/pg/${pg.id}`)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">
                        {pg.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{pg.location}</p>
                    </div>
                    <Badge variant="outline">{pg.floors} Floors</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2 mb-1">
                        <Home className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Occupancy</span>
                      </div>
                      <p className="text-lg font-bold">{pg.occupiedRooms}/{pg.totalRooms}</p>
                    </div>

                    <div className="p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2 mb-1">
                        <IndianRupee className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Revenue</span>
                      </div>
                      <p className="text-lg font-bold">₹{pg.revenue.toLocaleString()}</p>
                    </div>
                  </div>

                  {pg.pendingPayments > 0 && (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/10 border border-destructive/20 mb-4">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-destructive" />
                        <span className="text-sm font-medium">{pg.pendingPayments} Pending Payments</span>
                      </div>
                      <Button size="sm" variant="destructive">
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </Button>
                    </div>
                  )}

                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/owner/pg/${pg.id}`);
                    }}
                  >
                    View Dashboard
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
