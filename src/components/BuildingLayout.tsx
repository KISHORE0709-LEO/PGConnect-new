import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Users, IndianRupee, MapPin, Wifi, Car, Utensils } from "lucide-react";

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

interface BuildingLayoutProps {
  floors: Floor[];
  maxFloorsPerRow?: number;
}

const BuildingLayout = ({ floors, maxFloorsPerRow = 5 }: BuildingLayoutProps) => {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [activeFloor, setActiveFloor] = useState(0);

  const getRoomStatus = (room: Room) => {
    if (room.occupied === 0) return 'available';
    if (room.occupied >= room.capacity) return 'occupied';
    return 'partial';
  };

  const getRoomColor = (status: string) => {
    switch (status) {
      case 'available': return 'border-green-500 bg-green-50 hover:bg-green-100';
      case 'occupied': return 'border-gray-300 bg-gray-100 cursor-not-allowed opacity-60';
      case 'partial': return 'border-yellow-500 bg-yellow-50 hover:bg-yellow-100';
      default: return 'border-gray-300';
    }
  };

  const handleRoomClick = (room: Room) => {
    const status = getRoomStatus(room);
    if (status !== 'occupied') {
      setSelectedRoom(room);
    }
  };

  // Split floors into rows based on maxFloorsPerRow
  const floorRows = [];
  for (let i = 0; i < floors.length; i += maxFloorsPerRow) {
    floorRows.push(floors.slice(i, i + maxFloorsPerRow));
  }

  return (
    <div className="w-full space-y-8">
      {/* Floor Navigation */}
      <div className="flex flex-wrap gap-2 justify-center">
        {floors.map((floor, index) => (
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

      {/* Building Layout */}
      <div className="space-y-8">
        {floorRows.map((floorRow, rowIndex) => (
          <div key={rowIndex} className="grid gap-6" style={{
            gridTemplateColumns: `repeat(${Math.min(floorRow.length, maxFloorsPerRow)}, 1fr)`
          }}>
            {floorRow.map((floor, floorIndex) => {
              const globalFloorIndex = rowIndex * maxFloorsPerRow + floorIndex;
              const isActive = activeFloor === globalFloorIndex;
              
              return (
                <Card 
                  key={floor.id} 
                  className={`p-4 transition-all duration-300 ${
                    isActive ? 'ring-2 ring-primary shadow-lg' : 'opacity-70'
                  }`}
                >
                  <div className="text-center mb-4">
                    <h3 className="font-bold text-lg">{floor.name}</h3>
                    <Badge variant="secondary" className="mt-1">
                      {floor.rooms.filter(r => getRoomStatus(r) === 'available').length} Available
                    </Badge>
                  </div>

                  {/* Room Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {floor.rooms.map((room) => {
                      const status = getRoomStatus(room);
                      return (
                        <div
                          key={room.id}
                          className={`
                            p-3 rounded-lg border-2 cursor-pointer transition-all duration-200
                            ${getRoomColor(status)}
                            ${status === 'occupied' ? '' : 'hover:scale-105 hover:shadow-md'}
                          `}
                          onClick={() => handleRoomClick(room)}
                        >
                          <div className="text-center">
                            <div className="font-bold text-sm">{room.number}</div>
                            <div className="text-xs text-muted-foreground">
                              ₹{room.rent.toLocaleString()}
                            </div>
                            <div className="text-xs mt-1">
                              <span className={`
                                px-1 py-0.5 rounded text-xs
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
              );
            })}
          </div>
        ))}
      </div>

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
              <div>
                <Badge variant="outline" className="w-full justify-center py-2">
                  {selectedRoom.sharingType} Sharing
                </Badge>
              </div>

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

export default BuildingLayout;