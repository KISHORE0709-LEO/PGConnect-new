import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Users, IndianRupee, Wifi, Car, Utensils, Shield } from "lucide-react";

interface Room {
  id: string;
  number: string;
  rent: number;
  capacity: number;
  occupied: number;
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
}

// Sample data generator
const generateBuildingData = (numFloors: number, roomsPerFloor: number): Floor[] => {
  const floors: Floor[] = [];
  const floorNames = ["Ground Floor", "First Floor", "Second Floor", "Third Floor", "Fourth Floor"];
  
  for (let i = 0; i < numFloors; i++) {
    const floorName = i < floorNames.length ? floorNames[i] : `Floor ${i + 1}`;
    const floorPrefix = i === 0 ? "G" : String.fromCharCode(65 + i - 1); // G, A, B, C...
    
    const rooms: Room[] = [];
    for (let j = 1; j <= roomsPerFloor; j++) {
      const roomNumber = `${floorPrefix}${j.toString().padStart(2, '0')}`;
      const capacity = Math.floor(Math.random() * 3) + 1; // 1-3 capacity
      const occupied = Math.floor(Math.random() * (capacity + 1)); // 0 to capacity
      
      rooms.push({
        id: roomNumber,
        number: roomNumber,
        rent: 7500 + (Math.floor(Math.random() * 6) * 500),
        capacity,
        occupied,
        occupants: Array.from({ length: occupied }, (_, k) => ({
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

const BuildingVisualizer = ({ floors = 3, roomsPerFloor = 6 }: BuildingVisualizerProps) => {
  const [buildingData] = useState(() => generateBuildingData(floors, roomsPerFloor));
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [activeFloor, setActiveFloor] = useState(0);

  const getRoomStatus = (room: Room) => {
    if (room.occupied === 0) return 'available';
    if (room.occupied >= room.capacity) return 'occupied';
    return 'partial';
  };

  const getRoomColor = (status: string) => {
    switch (status) {
      case 'available': return 'border-green-500 bg-green-50 hover:bg-green-100 hover:shadow-md';
      case 'occupied': return 'border-gray-300 bg-gray-100 cursor-not-allowed opacity-60';
      case 'partial': return 'border-yellow-500 bg-yellow-50 hover:bg-yellow-100 hover:shadow-md';
      default: return 'border-gray-300';
    }
  };

  const handleRoomClick = (room: Room) => {
    const status = getRoomStatus(room);
    if (status !== 'occupied') {
      setSelectedRoom(room);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Floor Navigation */}
      <div className="flex flex-wrap gap-2 justify-center">
        {buildingData.map((floor, index) => (
          <Button
            key={floor.id}
            variant={activeFloor === index ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFloor(index)}
          >
            {floor.name}
          </Button>
        ))}
      </div>

      {/* Active Floor Layout */}
      <Card className="p-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold">{buildingData[activeFloor]?.name}</h3>
          <Badge variant="secondary" className="mt-2">
            {buildingData[activeFloor]?.rooms.filter(r => getRoomStatus(r) === 'available').length} Available Rooms
          </Badge>
        </div>

        {/* Room Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {buildingData[activeFloor]?.rooms.map((room) => {
            const status = getRoomStatus(room);
            return (
              <div
                key={room.id}
                className={`
                  p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 transform
                  ${getRoomColor(status)}
                  ${status === 'occupied' ? '' : 'hover:scale-105'}
                `}
                onClick={() => handleRoomClick(room)}
              >
                <div className="text-center">
                  <div className="font-bold text-sm mb-1">{room.number}</div>
                  <div className="text-xs text-muted-foreground mb-2">
                    ₹{room.rent.toLocaleString()}
                  </div>
                  <div className="text-xs">
                    <span className={`
                      px-2 py-1 rounded-full text-xs font-medium
                      ${status === 'available' ? 'bg-green-200 text-green-800' :
                        status === 'partial' ? 'bg-yellow-200 text-yellow-800' :
                        'bg-gray-200 text-gray-600'}
                    `}>
                      {room.occupied}/{room.capacity}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Legend */}
      <div className="flex justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-green-500 bg-green-50 rounded"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-yellow-500 bg-yellow-50 rounded"></div>
          <span>Partially Occupied</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-gray-300 bg-gray-100 rounded"></div>
          <span>Fully Occupied</span>
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
              {/* Room Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <IndianRupee className="h-5 w-5 mx-auto mb-1 text-primary" />
                  <div className="font-bold">₹{selectedRoom.rent.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Monthly Rent</div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <Users className="h-5 w-5 mx-auto mb-1 text-primary" />
                  <div className="font-bold">{selectedRoom.occupied}/{selectedRoom.capacity}</div>
                  <div className="text-xs text-muted-foreground">Occupancy</div>
                </div>
              </div>

              {/* Sharing Type */}
              <Badge variant="outline" className="w-full justify-center py-2">
                {selectedRoom.sharingType} Sharing
              </Badge>

              {/* Occupants */}
              {selectedRoom.occupants.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Current Occupants</h4>
                  <div className="space-y-2">
                    {selectedRoom.occupants.map((occupant, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 bg-muted rounded">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold">{occupant.name.charAt(0)}</span>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{occupant.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {occupant.college} • {occupant.year}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Amenities */}
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

              {/* Action Button */}
              {getRoomStatus(selectedRoom) === 'available' && (
                <Button className="w-full">
                  Book This Room
                </Button>
              )}
              {getRoomStatus(selectedRoom) === 'partial' && (
                <Button className="w-full" variant="outline">
                  Join as Roommate
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BuildingVisualizer;