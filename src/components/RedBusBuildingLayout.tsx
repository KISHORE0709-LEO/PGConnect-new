import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Users,
  IndianRupee,
  User,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Bed,
  Home
} from "lucide-react";

interface RoomData {
  id: string;
  number: string;
  floor: number;
  price: number;
  capacity: number;
  occupied: number;
  status: 'available' | 'occupied' | 'sold';
  roommates: Array<{
    name: string;
    age: number;
    college: string;
    course: string;
    phone: string;
    joinDate: string;
  }>;
}

interface RedBusBuildingLayoutProps {
  pgId?: string;
  floors?: number;
  roomsPerFloor?: number;
}

const RedBusBuildingLayout = ({ pgId, floors = 3, roomsPerFloor = 12 }: RedBusBuildingLayoutProps) => {
  const [rooms, setRooms] = useState<RoomData[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<RoomData | null>(null);
  const [showRoomModal, setShowRoomModal] = useState(false);

  useEffect(() => {
    const fetchRoomData = async () => {
      if (!pgId) {
        // Generate sample data if no pgId
        setRooms(generateSampleRooms());
        return;
      }

      try {
        const { db } = await import('@/config/firebase');
        const { doc, getDoc } = await import('firebase/firestore');
        
        const pgRef = doc(db, 'pgs', pgId);
        const pgSnap = await getDoc(pgRef);
        
        if (pgSnap.exists()) {
          const pgData = pgSnap.data();
          if (pgData.buildingLayout && pgData.buildingLayout.rooms) {
            // Convert Firebase data to our format
            const firebaseRooms = pgData.buildingLayout.rooms.map(room => ({
              id: room.id || room.number,
              number: room.number,
              floor: (room.floorId || 0) + 1, // Convert 0-based to 1-based
              price: room.rent || 8000,
              capacity: room.capacity || 2,
              occupied: room.occupied || 0,
              status: room.status || 'available',
              roommates: (room.occupants || []).map(occupant => ({
                name: occupant.name,
                age: 20,
                college: occupant.college || 'Unknown',
                course: occupant.year || 'Unknown',
                phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
                joinDate: new Date().toLocaleDateString()
              }))
            }));
            setRooms(firebaseRooms);
          } else {
            setRooms(generateSampleRooms());
          }
        } else {
          setRooms(generateSampleRooms());
        }
      } catch (error) {
        console.error('Error fetching room data:', error);
        setRooms(generateSampleRooms());
      }
    };

    const generateSampleRooms = () => {
      // Generate sample room data (existing code)
      const roomData: RoomData[] = [];
      const sampleNames = [
        "Aarav Sharma", "Vivek Kumar", "Priya Singh", "Rohan Patel", "Ananya Gupta",
        "Arjun Mehta", "Diya Verma", "Karan Singh", "Sneha Reddy", "Rahul Jain"
      ];
      const colleges = ["NMIT", "RVCE", "IISc", "PESIT", "Christ University"];
      const courses = ["Computer Science", "Electronics", "Mechanical", "Civil", "Information Science"];

      for (let floor = 1; floor <= floors; floor++) {
        for (let room = 1; room <= roomsPerFloor; room++) {
          const roomNumber = `${floor}${room.toString().padStart(2, '0')}`;
          const capacity = Math.floor(Math.random() * 3) + 1;
          const occupied = Math.floor(Math.random() * (capacity + 1));
          const basePrice = 8000 + (Math.floor(Math.random() * 5) * 500);
          
          const roommates = [];
          for (let i = 0; i < occupied; i++) {
            roommates.push({
              name: sampleNames[Math.floor(Math.random() * sampleNames.length)],
              age: 18 + Math.floor(Math.random() * 6),
              college: colleges[Math.floor(Math.random() * colleges.length)],
              course: courses[Math.floor(Math.random() * courses.length)],
              phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
              joinDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toLocaleDateString()
            });
          }

          let status: 'available' | 'occupied' | 'sold' = 'available';
          if (occupied === capacity) status = 'sold';
          else if (occupied > 0) status = 'occupied';

          roomData.push({
            id: roomNumber,
            number: roomNumber,
            floor,
            price: basePrice,
            capacity,
            occupied,
            status,
            roommates
          });
        }
      }
      return roomData;
    };

    fetchRoomData();
  }, [pgId, floors, roomsPerFloor]);

  const getRoomColor = (room: RoomData) => {
    switch (room.status) {
      case 'available': return 'border-green-400 bg-green-50 hover:bg-green-100';
      case 'occupied': return 'border-blue-400 bg-blue-50 hover:bg-blue-100';
      case 'sold': return 'border-gray-400 bg-gray-200';
      default: return 'border-gray-300 bg-white';
    }
  };

  const handleRoomClick = (room: RoomData) => {
    setSelectedRoom(room);
    setShowRoomModal(true);
  };

  const renderFloor = (floorNumber: number) => {
    const floorRooms = rooms.filter(room => room.floor === floorNumber);
    const leftSide = floorRooms.slice(0, roomsPerFloor / 2);
    const rightSide = floorRooms.slice(roomsPerFloor / 2);

    return (
      <div key={floorNumber} className="mb-8">
        <div className="text-center mb-4">
          <Badge variant="outline" className="text-lg px-4 py-2 font-bold">
            Floor {floorNumber}
          </Badge>
        </div>
        
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          {/* Left Side Rooms */}
          <div className="grid grid-cols-2 gap-3">
            {leftSide.map((room) => (
              <div
                key={room.id}
                className={`relative w-24 h-32 border-2 rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${getRoomColor(room)}`}
                onClick={() => handleRoomClick(room)}
                style={{
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  transform: 'perspective(100px) rotateX(5deg)'
                }}
              >
                <div className="p-2 h-full flex flex-col justify-between">
                  <div className="text-xs font-bold text-center">{room.number}</div>
                  <div className="text-center">
                    <div className="text-xs text-green-600 font-semibold">
                      ₹{room.price.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {room.occupied}/{room.capacity}
                    </div>
                    {room.status === 'sold' && (
                      <div className="text-xs text-red-600 font-bold">Sold</div>
                    )}
                  </div>
                </div>
                
                {/* 3D Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-lg pointer-events-none"></div>
              </div>
            ))}
          </div>

          {/* Center Corridor */}
          <div className="flex flex-col items-center mx-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full border-4 border-gray-300 flex items-center justify-center mb-2">
              <Home className="h-6 w-6 text-gray-600" />
            </div>
            <div className="text-xs text-gray-500 font-medium">Corridor</div>
            <div className="w-1 h-20 bg-gray-300 my-2"></div>
          </div>

          {/* Right Side Rooms */}
          <div className="grid grid-cols-2 gap-3">
            {rightSide.map((room) => (
              <div
                key={room.id}
                className={`relative w-24 h-32 border-2 rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${getRoomColor(room)}`}
                onClick={() => handleRoomClick(room)}
                style={{
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  transform: 'perspective(100px) rotateX(5deg)'
                }}
              >
                <div className="p-2 h-full flex flex-col justify-between">
                  <div className="text-xs font-bold text-center">{room.number}</div>
                  <div className="text-center">
                    <div className="text-xs text-green-600 font-semibold">
                      ₹{room.price.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {room.occupied}/{room.capacity}
                    </div>
                    {room.status === 'sold' && (
                      <div className="text-xs text-red-600 font-bold">Sold</div>
                    )}
                  </div>
                </div>
                
                {/* 3D Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-lg pointer-events-none"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-gradient-to-b from-blue-50 to-white p-8 rounded-xl">
      {/* Legend */}
      <div className="flex justify-center gap-6 mb-8">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-green-400 bg-green-50 rounded"></div>
          <span className="text-sm">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-blue-400 bg-blue-50 rounded"></div>
          <span className="text-sm">Partially Occupied</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-gray-400 bg-gray-200 rounded"></div>
          <span className="text-sm">Fully Occupied</span>
        </div>
      </div>

      {/* Building Layout */}
      <div className="space-y-8">
        {Array.from({ length: floors }, (_, i) => floors - i).map(floorNumber => 
          renderFloor(floorNumber)
        )}
      </div>

      {/* Room Details Modal */}
      <Dialog open={showRoomModal} onOpenChange={setShowRoomModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bed className="h-5 w-5" />
              Room {selectedRoom?.number} Details
            </DialogTitle>
          </DialogHeader>
          
          {selectedRoom && (
            <div className="space-y-6">
              {/* Room Info */}
              <Card className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Floor {selectedRoom.floor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IndianRupee className="h-4 w-4 text-green-600" />
                    <span className="font-semibold">₹{selectedRoom.price.toLocaleString()}/month</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Capacity: {selectedRoom.capacity}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-orange-600" />
                    <span className="text-sm">Occupied: {selectedRoom.occupied}</span>
                  </div>
                </div>
              </Card>

              {/* Roommates */}
              {selectedRoom.roommates.length > 0 ? (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Current Roommates</h3>
                  <div className="space-y-3">
                    {selectedRoom.roommates.map((roommate, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold">{roommate.name}</h4>
                            <p className="text-sm text-gray-600">{roommate.age} years • {roommate.course}</p>
                            <p className="text-sm text-gray-600">{roommate.college}</p>
                          </div>
                          <div className="text-right text-sm">
                            <div className="flex items-center gap-1 mb-1">
                              <Phone className="h-3 w-3" />
                              <span>{roommate.phone}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>Joined: {roommate.joinDate}</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Bed className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">No current roommates</p>
                  <p className="text-sm text-gray-500">This room is available for booking</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                {selectedRoom.status === 'available' && (
                  <Button className="flex-1">Book This Room</Button>
                )}
                {selectedRoom.status === 'occupied' && selectedRoom.occupied < selectedRoom.capacity && (
                  <Button className="flex-1">Join as Roommate</Button>
                )}
                <Button variant="outline" onClick={() => setShowRoomModal(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RedBusBuildingLayout;