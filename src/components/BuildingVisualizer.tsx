import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Users, IndianRupee, Wifi, Car, Utensils, Shield, Building2 } from "lucide-react";
import { db } from "@/config/firebase";
import { doc, getDoc } from "firebase/firestore";

interface Room {
  id: string;
  number: string;
  rent: number;
  capacity: number;
  occupied: number;
  status: 'available' | 'occupied' | 'sold';
  occupants: Array<{
    name: string;
    college: string;
    year: string;
  }>;
  amenities: string[];
  sharingType: string;
}

interface Floor {
  id: number;
  name: string;
  rooms: Room[];
}

interface BuildingVisualizerProps {
  floors?: number;
  roomsPerFloor?: number;
  pgId?: string;
  buildingData?: any;
  onBookRoom?: () => void;
}

// Generate building data similar to RedBus layout
const generateBuildingData = (numFloors: number, roomsPerFloor: number): Floor[] => {
  const floors: Floor[] = [];
  const floorNames = ["Ground Floor", "First Floor", "Second Floor", "Third Floor", "Fourth Floor"];
  
  for (let i = 0; i < numFloors; i++) {
    const floorName = i < floorNames.length ? floorNames[i] : `Floor ${i + 1}`;
    
    const rooms: Room[] = [];
    for (let j = 1; j <= roomsPerFloor; j++) {
      const roomNumber = `${i + 1}${j.toString().padStart(2, '0')}`;
      const capacity = Math.floor(Math.random() * 3) + 1;
      const occupied = Math.floor(Math.random() * (capacity + 1));
      const statusOptions = ['available', 'occupied', 'sold'] as const;
      const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
      
      rooms.push({
        id: roomNumber,
        number: roomNumber,
        rent: 2900 + (Math.floor(Math.random() * 4) * 100), // 2900-3200 like in image
        capacity,
        occupied: status === 'available' ? 0 : occupied,
        status,
        occupants: Array.from({ length: status === 'available' ? 0 : occupied }, (_, k) => ({
          name: `Student ${k + 1}`,
          college: ["RVCE", "PESIT", "Christ", "IIT", "IISc"][Math.floor(Math.random() * 5)],
          year: ["1st Year", "2nd Year", "3rd Year", "4th Year"][Math.floor(Math.random() * 4)]
        })),
        amenities: ["WiFi", "AC", "Attached Bathroom", "Balcony"].slice(0, Math.floor(Math.random() * 4) + 1),
        sharingType: capacity === 1 ? "Single" : capacity === 2 ? "Double" : "Triple"
      });
    }
    
    floors.push({ id: i + 1, name: floorName, rooms });
  }
  
  return floors;
};

const BuildingVisualizer = ({ floors = 2, roomsPerFloor = 12, pgId, buildingData: propBuildingData, onBookRoom }: BuildingVisualizerProps) => {
  const [buildingData, setBuildingData] = useState<Floor[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBuildingData = async () => {
      // Use prop data if provided
      if (propBuildingData?.floors) {
        const transformedFloors = propBuildingData.floors.map((floor: any, index: number) => ({
          id: floor.number || index + 1,
          name: floor.name || (index === 0 ? 'Ground Floor' : `Floor ${index + 1}`),
          rooms: floor.rooms.map((room: any) => ({
            id: room.id || room.number,
            number: room.number,
            rent: room.rent,
            capacity: room.capacity || room.sharing,
            occupied: room.occupied || 0,
            status: room.status || 'available',
            occupants: room.occupants || [],
            amenities: room.amenities || [],
            sharingType: room.capacity === 1 ? 'Single' : room.capacity === 2 ? 'Double' : 'Triple'
          }))
        }));
        setBuildingData(transformedFloors);
        setLoading(false);
        return;
      }

      if (pgId) {
        try {
          const pgDocRef = doc(db, 'pgs', pgId);
          const pgDocSnap = await getDoc(pgDocRef);
          
          if (pgDocSnap.exists()) {
            const pgData = pgDocSnap.data();
            if (pgData.buildingConfiguration?.floors) {
              const transformedFloors = pgData.buildingConfiguration.floors.map((floor: any, index: number) => ({
                id: floor.number || index + 1,
                name: floor.name || (index === 0 ? 'Ground Floor' : `Floor ${index + 1}`),
                rooms: floor.rooms.map((room: any) => ({
                  id: room.id || room.number,
                  number: room.number,
                  rent: room.rent,
                  capacity: room.capacity || room.sharing,
                  occupied: room.occupied || 0,
                  status: room.status || 'available',
                  occupants: room.occupants || [],
                  amenities: room.amenities || [],
                  sharingType: room.capacity === 1 ? 'Single' : room.capacity === 2 ? 'Double' : 'Triple'
                }))
              }));
              setBuildingData(transformedFloors);
            } else {
              setBuildingData(generateBuildingData(floors, roomsPerFloor));
            }
          }
        } catch (error) {
          console.error('Error fetching building data:', error);
          setBuildingData(generateBuildingData(floors, roomsPerFloor));
        }
      } else {
        setBuildingData(generateBuildingData(floors, roomsPerFloor));
      }
      setLoading(false);
    };

    fetchBuildingData();
  }, [pgId, floors, roomsPerFloor, propBuildingData]);

  const getRoomColor = (status: string) => {
    switch (status) {
      case 'available': 
        return 'border-2 border-green-500 bg-white hover:bg-green-50 shadow-lg hover:shadow-xl transform hover:scale-105';
      case 'occupied': 
        return 'border-2 border-gray-300 bg-gray-100 opacity-60 cursor-not-allowed';
      case 'sold': 
        return 'border-2 border-gray-400 bg-gray-200 opacity-50 cursor-not-allowed';
      default: 
        return 'border-2 border-gray-300';
    }
  };

  const handleRoomClick = (room: Room) => {
    if (room.status === 'available') {
      setSelectedRoom(room);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto space-y-8 p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading building layout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 p-6">
      {/* Building Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Building2 className="h-8 w-8 text-primary" />
          <h2 className="text-3xl font-bold">3D Building Layout</h2>
        </div>
        <p className="text-muted-foreground text-lg">Interactive floor plan with real-time room availability</p>
      </div>

      {/* Floor Layout - RedBus Style */}
      <div className="grid lg:grid-cols-2 gap-8">
        {buildingData.map((floor, floorIndex) => (
          <Card key={floor.id} className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-primary/20 shadow-2xl">
            {/* Floor Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-3 bg-primary/10 px-6 py-3 rounded-full">
                <Building2 className="h-6 w-6 text-primary" />
                <h3 className="text-2xl font-bold text-primary">{floor.name}</h3>
              </div>
              <div className="mt-4">
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  {floor.rooms.filter(r => r.status === 'available').length} Available Rooms
                </Badge>
              </div>
            </div>

            {/* Room Grid - Large Cards */}
            <div className="grid grid-cols-3 gap-4">
              {floor.rooms.map((room) => (
                <div
                  key={room.id}
                  className={`
                    relative p-6 rounded-xl cursor-pointer transition-all duration-300
                    ${getRoomColor(room.status)}
                    perspective-1000
                  `}
                  onClick={() => handleRoomClick(room)}
                  style={{
                    minHeight: '120px',
                    transform: room.status === 'available' ? 'rotateX(5deg) rotateY(5deg)' : 'none',
                    transformStyle: 'preserve-3d'
                  }}
                >
                  {/* 3D Effect Shadow */}
                  <div className="absolute inset-0 bg-black/10 rounded-xl transform translate-x-1 translate-y-1 -z-10"></div>
                  
                  <div className="text-center relative z-10">
                    {/* Room Number */}
                    <div className="text-lg font-bold mb-2 text-gray-800">
                      {room.number}
                    </div>
                    
                    {/* Price */}
                    <div className="text-sm font-semibold text-green-600 mb-2">
                      ₹{room.rent}
                    </div>
                    
                    {/* Status */}
                    <div className="text-xs">
                      {room.status === 'available' && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          Available
                        </span>
                      )}
                      {room.status === 'occupied' && (
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          Occupied
                        </span>
                      )}
                      {room.status === 'sold' && (
                        <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full">
                          Sold
                        </span>
                      )}
                    </div>
                    
                    {/* Occupancy for occupied rooms */}
                    {room.status === 'occupied' && (
                      <div className="text-xs mt-1 text-gray-500">
                        {room.occupied}/{room.capacity}
                      </div>
                    )}
                  </div>
                  
                  {/* 3D Highlight for available rooms */}
                  {room.status === 'available' && (
                    <div className="absolute top-2 right-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Floor Statistics */}
            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
              <div className="bg-white/50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {floor.rooms.filter(r => r.status === 'available').length}
                </div>
                <div className="text-sm text-gray-600">Available</div>
              </div>
              <div className="bg-white/50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">
                  {floor.rooms.filter(r => r.status === 'occupied').length}
                </div>
                <div className="text-sm text-gray-600">Occupied</div>
              </div>
              <div className="bg-white/50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {floor.rooms.filter(r => r.status === 'sold').length}
                </div>
                <div className="text-sm text-gray-600">Sold</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-8 text-sm bg-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 border-2 border-green-500 bg-white rounded shadow-md"></div>
          <span className="font-medium">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 border-2 border-gray-300 bg-gray-100 rounded"></div>
          <span className="font-medium">Occupied</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 border-2 border-gray-400 bg-gray-200 rounded"></div>
          <span className="font-medium">Sold</span>
        </div>
      </div>

      {/* Room Details Modal */}
      <Dialog open={!!selectedRoom} onOpenChange={() => setSelectedRoom(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Room {selectedRoom?.number}
            </DialogTitle>
          </DialogHeader>

          {selectedRoom && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <IndianRupee className="h-5 w-5 mx-auto mb-1 text-primary" />
                  <div className="font-bold">₹{selectedRoom.rent}</div>
                  <div className="text-xs text-muted-foreground">Monthly Rent</div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <Users className="h-5 w-5 mx-auto mb-1 text-primary" />
                  <div className="font-bold">{selectedRoom.capacity} Sharing</div>
                  <div className="text-xs text-muted-foreground">{selectedRoom.sharingType}</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Room Amenities</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedRoom.amenities.map((amenity, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {amenity === "WiFi" && <Wifi className="h-3 w-3 mr-1" />}
                      {amenity === "Parking" && <Car className="h-3 w-3 mr-1" />}
                      {amenity === "Food" && <Utensils className="h-3 w-3 mr-1" />}
                      {amenity === "CCTV" && <Shield className="h-3 w-3 mr-1" />}
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button className="w-full" size="lg" onClick={() => {
                setSelectedRoom(null);
                onBookRoom?.();
              }}>
                Book Room {selectedRoom.number}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BuildingVisualizer;