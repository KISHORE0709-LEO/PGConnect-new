import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, Users, Bed, IndianRupee, Plus } from 'lucide-react';

interface Room {
  id: string;
  number: string;
  capacity: number;
  occupied: number;
  rent: number;
  pendingDues: number;
  occupants: Array<{
    name: string;
    college: string;
    dueAmount: number;
  }>;
}

interface Floor {
  id: string;
  number: number;
  rooms: Room[];
}

interface InteractiveBuildingLayoutProps {
  buildingConfig?: {
    floors: Floor[];
    totalFloors: number;
    totalRooms: number;
  };
  pgName: string;
}

const InteractiveBuildingLayout = ({ buildingConfig, pgName }: InteractiveBuildingLayoutProps) => {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);

  // Generate sample data if no config provided
  const generateSampleData = (): Floor[] => {
    const floors: Floor[] = [];
    for (let f = 1; f <= 3; f++) {
      const rooms: Room[] = [];
      for (let r = 1; r <= 6; r++) {
        const roomNumber = `${f}${r.toString().padStart(2, '0')}`;
        const capacity = Math.floor(Math.random() * 3) + 1;
        const occupied = Math.floor(Math.random() * (capacity + 1));
        rooms.push({
          id: roomNumber,
          number: roomNumber,
          capacity,
          occupied,
          rent: 8000 + (Math.random() * 4000),
          pendingDues: Math.random() > 0.7 ? Math.floor(Math.random() * 15000) : 0,
          occupants: Array.from({ length: occupied }, (_, i) => ({
            name: `Student ${i + 1}`,
            college: ['RVCE', 'PESIT', 'Christ'][Math.floor(Math.random() * 3)],
            dueAmount: Math.random() > 0.8 ? Math.floor(Math.random() * 8000) : 0
          }))
        });
      }
      floors.push({ id: f.toString(), number: f, rooms });
    }
    return floors;
  };

  const floors = buildingConfig?.floors || generateSampleData();

  const getRoomStatus = (room: Room) => {
    if (room.occupied === 0) return 'vacant';
    if (room.occupied === room.capacity) return 'full';
    return 'partial';
  };

  const getRoomColor = (room: Room) => {
    const status = getRoomStatus(room);
    if (room.pendingDues > 0) return 'bg-red-100 border-red-300 text-red-800';
    if (status === 'vacant') return 'bg-gray-100 border-gray-300 text-gray-600';
    if (status === 'full') return 'bg-green-100 border-green-300 text-green-800';
    return 'bg-yellow-100 border-yellow-300 text-yellow-800';
  };

  const totalStats = floors.reduce((acc, floor) => {
    floor.rooms.forEach(room => {
      acc.totalRooms++;
      acc.totalCapacity += room.capacity;
      acc.totalOccupied += room.occupied;
      acc.totalPendingDues += room.pendingDues;
    });
    return acc;
  }, { totalRooms: 0, totalCapacity: 0, totalOccupied: 0, totalPendingDues: 0 });

  return (
    <div className="space-y-6">
      {/* Building Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            <div>
              <div className="text-2xl font-bold">{totalStats.totalRooms}</div>
              <div className="text-sm text-muted-foreground">Total Rooms</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-green-600" />
            <div>
              <div className="text-2xl font-bold">{totalStats.totalOccupied}</div>
              <div className="text-sm text-muted-foreground">Occupied</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Bed className="h-5 w-5 text-orange-600" />
            <div>
              <div className="text-2xl font-bold">{totalStats.totalCapacity - totalStats.totalOccupied}</div>
              <div className="text-sm text-muted-foreground">Available</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <IndianRupee className="h-5 w-5 text-red-600" />
            <div>
              <div className="text-2xl font-bold">₹{Math.floor(totalStats.totalPendingDues / 1000)}K</div>
              <div className="text-sm text-muted-foreground">Pending Dues</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Interactive Building Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">Interactive Building Layout - {pgName}</h3>
            
            <div className="space-y-6">
              {floors.map((floor) => (
                <div key={floor.id} className="border rounded-lg p-4 bg-muted/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      <h4 className="font-semibold">Floor {floor.number}</h4>
                      <Badge variant="outline">{floor.rooms.length} rooms</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {floor.rooms.reduce((sum, r) => sum + r.occupied, 0)}/{floor.rooms.reduce((sum, r) => sum + r.capacity, 0)} occupied
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {floor.rooms.map((room) => (
                      <div
                        key={room.id}
                        className={`relative p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md ${getRoomColor(room)} ${
                          hoveredRoom === room.id ? 'ring-2 ring-blue-500' : ''
                        }`}
                        onClick={() => setSelectedRoom(room)}
                        onMouseEnter={() => setHoveredRoom(room.id)}
                        onMouseLeave={() => setHoveredRoom(null)}
                      >
                        <div className="text-center">
                          <div className="font-bold text-sm">{room.number}</div>
                          <div className="text-xs mt-1">
                            {room.occupied}/{room.capacity}
                          </div>
                          {room.pendingDues > 0 && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                          )}
                        </div>
                        
                        {/* Hover tooltip */}
                        {hoveredRoom === room.id && (
                          <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-black text-white text-xs rounded shadow-lg whitespace-nowrap">
                            <div>Room {room.number}</div>
                            <div>Occupancy: {room.occupied}/{room.capacity}</div>
                            <div>Rent: ₹{Math.floor(room.rent)}</div>
                            {room.pendingDues > 0 && <div className="text-red-300">Dues: ₹{Math.floor(room.pendingDues)}</div>}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Room Details Panel */}
        <div>
          <Card className="p-6 sticky top-4">
            {selectedRoom ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-bold">Room {selectedRoom.number}</h4>
                  <Badge variant={getRoomStatus(selectedRoom) === 'vacant' ? 'secondary' : 'default'}>
                    {getRoomStatus(selectedRoom) === 'vacant' ? 'Vacant' : 
                     getRoomStatus(selectedRoom) === 'full' ? 'Full' : 'Partial'}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Capacity</div>
                    <div className="font-semibold">{selectedRoom.capacity} beds</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Occupied</div>
                    <div className="font-semibold">{selectedRoom.occupied} students</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Available</div>
                    <div className="font-semibold text-green-600">{selectedRoom.capacity - selectedRoom.occupied} beds</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Monthly Rent</div>
                    <div className="font-semibold">₹{Math.floor(selectedRoom.rent)}</div>
                  </div>
                </div>

                {selectedRoom.pendingDues > 0 && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="text-red-800 font-semibold">Pending Dues</div>
                    <div className="text-red-600">₹{Math.floor(selectedRoom.pendingDues)}</div>
                  </div>
                )}

                {selectedRoom.occupants.length > 0 && (
                  <div>
                    <h5 className="font-semibold mb-2">Current Occupants</h5>
                    <div className="space-y-2">
                      {selectedRoom.occupants.map((occupant, index) => (
                        <div key={index} className="p-2 bg-muted rounded text-sm">
                          <div className="font-medium">{occupant.name}</div>
                          <div className="text-muted-foreground">{occupant.college}</div>
                          {occupant.dueAmount > 0 && (
                            <div className="text-red-600 text-xs">Due: ₹{occupant.dueAmount}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Button className="w-full" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Tenant
                  </Button>
                  <Button variant="outline" className="w-full" size="sm">
                    Send Reminder
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Click on any room to view details</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InteractiveBuildingLayout;