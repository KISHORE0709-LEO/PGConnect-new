import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "@/config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ArrowLeft, UserPlus, Edit, UserMinus, IndianRupee, Users, Building2, CheckCircle, XCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface Tenant {
  name: string;
  email: string;
  phone?: string;
  rentPaid: boolean;
  rentDueDate?: string;
  advancePayment?: number;
  joinedDate?: string;
}

interface Room {
  number: string;
  capacity: number;
  occupants: Tenant[];
}

interface Floor {
  number: number;
  rooms: Room[];
}

const ManageTenants = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [pgData, setPgData] = useState<any>(null);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<{ floorIdx: number; roomIdx: number } | null>(null);
  const [selectedTenant, setSelectedTenant] = useState<{ floorIdx: number; roomIdx: number; tenantIdx: number } | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", advancePayment: "" });

  useEffect(() => {
    fetchPGData();
  }, [id]);

  const fetchPGData = async () => {
    if (!id) return;
    try {
      const docRef = doc(db, "pgs", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setPgData(data);
        setFloors(data.buildingConfiguration?.floors || []);
      }
    } catch (error) {
      console.error("Error fetching PG:", error);
      toast({ title: "Error", description: "Failed to load PG data", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleAddTenant = async () => {
    if (!selectedRoom || !formData.name || !formData.email) return;
    const { floorIdx, roomIdx } = selectedRoom;
    const updatedFloors = [...floors];
    const newTenant: Tenant = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      rentPaid: false,
      rentDueDate: new Date(new Date().setDate(5)).toISOString().split("T")[0],
      advancePayment: Number(formData.advancePayment) || 0,
      joinedDate: new Date().toISOString().split("T")[0],
    };
    updatedFloors[floorIdx].rooms[roomIdx].occupants.push(newTenant);
    await updatePG(updatedFloors);
    setModalOpen(false);
    setFormData({ name: "", email: "", phone: "", advancePayment: "" });
    toast({ title: "Success", description: "Tenant added successfully" });
  };

  const handleEditTenant = async () => {
    if (!selectedTenant || !formData.name || !formData.email) return;
    const { floorIdx, roomIdx, tenantIdx } = selectedTenant;
    const updatedFloors = [...floors];
    updatedFloors[floorIdx].rooms[roomIdx].occupants[tenantIdx] = {
      ...updatedFloors[floorIdx].rooms[roomIdx].occupants[tenantIdx],
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      advancePayment: Number(formData.advancePayment) || 0,
    };
    await updatePG(updatedFloors);
    setEditModalOpen(false);
    setFormData({ name: "", email: "", phone: "", advancePayment: "" });
    toast({ title: "Success", description: "Tenant updated successfully" });
  };

  const handleVacateTenant = async (floorIdx: number, roomIdx: number, tenantIdx: number) => {
    if (!confirm("Are you sure you want to mark this tenant as vacated?")) return;
    const updatedFloors = [...floors];
    updatedFloors[floorIdx].rooms[roomIdx].occupants.splice(tenantIdx, 1);
    await updatePG(updatedFloors);
    toast({ title: "Success", description: "Tenant marked as vacated" });
  };

  const toggleRentStatus = async (floorIdx: number, roomIdx: number, tenantIdx: number) => {
    const updatedFloors = [...floors];
    const tenant = updatedFloors[floorIdx].rooms[roomIdx].occupants[tenantIdx];
    tenant.rentPaid = !tenant.rentPaid;
    await updatePG(updatedFloors);
    toast({ title: "Success", description: `Rent marked as ${tenant.rentPaid ? "paid" : "pending"}` });
  };

  const updatePG = async (updatedFloors: Floor[]) => {
    if (!id) return;
    try {
      const docRef = doc(db, "pgs", id);
      await updateDoc(docRef, { "buildingConfiguration.floors": updatedFloors });
      setFloors(updatedFloors);
    } catch (error) {
      console.error("Error updating PG:", error);
      toast({ title: "Error", description: "Failed to update data", variant: "destructive" });
    }
  };

  const openAddModal = (floorIdx: number, roomIdx: number) => {
    setSelectedRoom({ floorIdx, roomIdx });
    setModalOpen(true);
  };

  const openEditModal = (floorIdx: number, roomIdx: number, tenantIdx: number) => {
    const tenant = floors[floorIdx].rooms[roomIdx].occupants[tenantIdx];
    setSelectedTenant({ floorIdx, roomIdx, tenantIdx });
    setFormData({
      name: tenant.name,
      email: tenant.email,
      phone: tenant.phone || "",
      advancePayment: tenant.advancePayment?.toString() || "",
    });
    setEditModalOpen(true);
  };

  const getTotalStats = () => {
    let totalRooms = 0, occupiedBeds = 0, totalBeds = 0, paidCount = 0, pendingCount = 0;
    floors.forEach((floor) => {
      floor.rooms.forEach((room) => {
        totalRooms++;
        totalBeds += room.capacity;
        occupiedBeds += room.occupants.length;
        room.occupants.forEach((t) => (t.rentPaid ? paidCount++ : pendingCount++));
      });
    });
    return { totalRooms, occupiedBeds, totalBeds, paidCount, pendingCount };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const stats = getTotalStats();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <header className="bg-card border-b sticky top-0 z-50 backdrop-blur-lg bg-card/95">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/owner/dashboard")}>
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
          <h1 className="text-xl font-bold">Manage Tenants</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-1">{pgData?.name}</h2>
          <p className="text-muted-foreground">{pgData?.address}</p>
        </div>

        <div className="grid md:grid-cols-5 gap-4 mb-8">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground mb-1">Total Rooms</div>
            <div className="text-2xl font-bold">{stats.totalRooms}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground mb-1">Occupancy</div>
            <div className="text-2xl font-bold">{stats.occupiedBeds}/{stats.totalBeds}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground mb-1">Rent Paid</div>
            <div className="text-2xl font-bold text-green-600">{stats.paidCount}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground mb-1">Rent Pending</div>
            <div className="text-2xl font-bold text-red-600">{stats.pendingCount}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground mb-1">Monthly Rent</div>
            <div className="text-2xl font-bold text-primary">₹{pgData?.monthlyRent || 0}</div>
          </Card>
        </div>

        {floors.map((floor, floorIdx) => (
          <div key={floorIdx} className="mb-10">
            <div className="flex items-center gap-3 mb-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-lg shadow-md">
              <Building2 className="h-6 w-6" />
              <h3 className="text-2xl font-bold">Floor {floor.number}</h3>
              <Badge className="ml-auto bg-white/20 text-white border-0">{floor.rooms.length} Rooms</Badge>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {floor.rooms.map((room, roomIdx) => (
                <Card key={roomIdx} className="p-6 hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-300">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-2xl text-blue-600">Room {room.number}</h4>
                      <div className="flex items-center gap-2 mt-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {room.occupants.length}/{room.capacity} Occupied
                        </span>
                      </div>
                    </div>
                    {room.occupants.length < room.capacity && (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => openAddModal(floorIdx, roomIdx)}>
                        <UserPlus className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    )}
                  </div>
                  
                  <div className="border-t pt-4 mt-4">
                    {room.occupants.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Users className="h-12 w-12 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">No tenants yet</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {room.occupants.map((tenant, tenantIdx) => (
                          <div key={tenantIdx} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <p className="font-semibold text-lg">{tenant.name}</p>
                                <p className="text-xs text-muted-foreground mt-1">{tenant.email}</p>
                                {tenant.phone && <p className="text-xs text-muted-foreground">{tenant.phone}</p>}
                              </div>
                            </div>
                            <div className="flex gap-2 mt-3 flex-wrap">
                              <Badge variant={tenant.rentPaid ? "default" : "destructive"} className="text-xs">
                                {tenant.rentPaid ? "✓ Paid" : "⚠ Pending"}
                              </Badge>
                              {tenant.advancePayment && tenant.advancePayment > 0 && (
                                <Badge variant="outline" className="text-xs">₹{tenant.advancePayment}</Badge>
                              )}
                            </div>
                            <div className="flex gap-2 mt-3">
                              <Button size="sm" variant="outline" className="flex-1" onClick={() => toggleRentStatus(floorIdx, roomIdx, tenantIdx)}>
                                {tenant.rentPaid ? <XCircle className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />}
                              </Button>
                              <Button size="sm" variant="outline" className="flex-1" onClick={() => openEditModal(floorIdx, roomIdx, tenantIdx)}>
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="destructive" className="flex-1" onClick={() => handleVacateTenant(floorIdx, roomIdx, tenantIdx)}>
                                <UserMinus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Tenant</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name *</Label>
              <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div>
              <Label>Email *</Label>
              <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <div>
              <Label>Phone</Label>
              <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            </div>
            <div>
              <Label>Advance Payment</Label>
              <Input type="number" value={formData.advancePayment} onChange={(e) => setFormData({ ...formData, advancePayment: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAddTenant}>Add Tenant</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Tenant</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name *</Label>
              <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div>
              <Label>Email *</Label>
              <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <div>
              <Label>Phone</Label>
              <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            </div>
            <div>
              <Label>Advance Payment</Label>
              <Input type="number" value={formData.advancePayment} onChange={(e) => setFormData({ ...formData, advancePayment: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>Cancel</Button>
            <Button onClick={handleEditTenant}>Update Tenant</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageTenants;
