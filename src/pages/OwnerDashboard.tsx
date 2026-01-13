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
  AlertCircle,
  MapPin,
  Calendar,
  Settings,
  Bell,
  Search,
  MoreVertical,
  Eye,
  Edit,
  UserCheck,
  Clock,
  Activity,
  BarChart3,
  PieChart,
  Menu,
  X,
  LogOut,
  FileText,
  CreditCard,
  Wrench
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ownerData = {
  name: "Rajesh Kumar",
  totalPGs: 4,
  totalRooms: 48,
  occupiedRooms: 42,
  totalTenants: 42,
  totalRevenue: 356000,
  monthlyGrowth: 12.5,
  pendingPayments: 5
};

const mockPGs = [
  {
    id: 1,
    name: "Green Valley PG",
    location: "Jayanagar, Bangalore",
    branch: "South Bangalore",
    totalRooms: 15,
    occupiedRooms: 13,
    revenue: 111000,
    status: "Active"
  },
  {
    id: 2,
    name: "Sunrise Residency",
    location: "Koramangala, Bangalore", 
    branch: "Central Bangalore",
    totalRooms: 12,
    occupiedRooms: 11,
    revenue: 94000,
    status: "Active"
  },
  {
    id: 3,
    name: "Elite Heights",
    location: "Whitefield, Bangalore",
    branch: "East Bangalore", 
    totalRooms: 18,
    occupiedRooms: 16,
    revenue: 136000,
    status: "Active"
  }
];

const recentAlerts = [
  { id: 1, message: "Payment overdue for Room A-101", time: "5 min ago", priority: "high" },
  { id: 2, message: "AC repair request in Room B-205", time: "15 min ago", priority: "medium" },
  { id: 3, message: "New booking inquiry for Elite Heights", time: "1 hour ago", priority: "low" }
];

const mockTenants = [
  { id: 1, name: "Amit Sharma", room: "A-101", joinDate: "2024-01-15", nextRentDue: "2024-02-03", status: "paid" },
  { id: 2, name: "Priya Singh", room: "B-205", joinDate: "2024-01-20", nextRentDue: "2024-02-03", status: "overdue" },
  { id: 3, name: "Rahul Kumar", room: "C-301", joinDate: "2024-02-01", nextRentDue: "2024-03-03", status: "due" }
];

const getCurrentDate = () => {
  return new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

const getRentStatus = (joinDate: string) => {
  const join = new Date(joinDate);
  const today = new Date();
  const nextMonth = new Date(join.getFullYear(), join.getMonth() + 1, 3);
  const daysDiff = Math.floor((today.getTime() - nextMonth.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysDiff > 4) return 'overdue';
  if (daysDiff >= 0) return 'due';
  return 'paid';
};

const sidebarItems = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "properties", label: "Properties", icon: Building2 },
  { id: "tenants", label: "Tenants", icon: Users },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "maintenance", label: "Maintenance", icon: Wrench },
  { id: "reports", label: "Reports", icon: FileText },
  { id: "settings", label: "Settings", icon: Settings }
];

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-2xl hover:-translate-y-2 hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <span className="text-2xl font-bold">{ownerData.totalPGs}</span>
                </div>
                <h3 className="text-lg font-semibold mb-1">{ownerData.totalPGs}</h3>
                <p className="text-blue-100 text-sm">Total Properties</p>
                <div className="flex items-center gap-1 mt-2 text-sm">
                  <TrendingUp className="h-4 w-4" />
                  <span>+2 this month</span>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white hover:shadow-2xl hover:-translate-y-2 hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <Users className="h-6 w-6" />
                  </div>
                  <span className="text-sm bg-white/20 px-2 py-1 rounded">88%</span>
                </div>
                <h3 className="text-lg font-semibold mb-1">{ownerData.totalTenants}</h3>
                <p className="text-green-100 text-sm">Active Tenants</p>
                <div className="flex items-center gap-1 mt-2 text-sm">
                  <span>★ {ownerData.occupiedRooms}/{ownerData.totalRooms} rooms</span>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:shadow-2xl hover:-translate-y-2 hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <IndianRupee className="h-6 w-6" />
                  </div>
                  <span className="text-sm">+{ownerData.monthlyGrowth}%</span>
                </div>
                <h3 className="text-lg font-semibold mb-1">₹{ownerData.totalRevenue.toLocaleString()}</h3>
                <p className="text-purple-100 text-sm">Monthly Revenue</p>
                <div className="flex items-center gap-1 mt-2 text-sm">
                  <span>vs last month</span>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-orange-500 to-red-500 text-white hover:shadow-2xl hover:-translate-y-2 hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <AlertCircle className="h-6 w-6" />
                  </div>
                  <span className="text-2xl font-bold">{ownerData.pendingPayments}</span>
                </div>
                <h3 className="text-lg font-semibold mb-1">{ownerData.pendingPayments}</h3>
                <p className="text-orange-100 text-sm">Pending Payments</p>
                <div className="flex items-center gap-1 mt-2 text-sm">
                  <Clock className="h-4 w-4" />
                  <span>Requires attention</span>
                </div>
              </Card>
            </div>

            {/* Smart Alerts */}
            <Card className="p-4 hover:shadow-md transition-shadow duration-200 mb-6">
              <h3 className="text-lg font-semibold mb-3">Smart Alerts</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <span className="text-sm font-medium">3 rooms vacant on Floor 2 for 14+ days</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm font-medium">5 rent payments due this week</span>
                </div>
              </div>
            </Card>

            {/* Property Performance & Alerts */}
            <div className="grid lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <Card className="p-4 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Property Performance</h3>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {mockPGs.map((pg) => (
                      <div key={pg.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-blue-100 rounded-lg">
                            <Building2 className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{pg.name}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <MapPin className="h-3 w-3" />
                              <span>{pg.location}</span>
                              <span>•</span>
                              <span>{pg.branch}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <div className="font-bold">{pg.occupiedRooms}/{pg.totalRooms}</div>
                            <div className="text-xs text-gray-500">Occupancy</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-green-600">₹{(pg.revenue/1000).toFixed(0)}K</div>
                            <div className="text-xs text-gray-500">Revenue</div>
                          </div>
                          <Badge className="bg-green-100 text-green-700">
                            {pg.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              <div>
                <Card className="p-4 hover:shadow-md transition-shadow duration-200">
                  <h3 className="text-lg font-semibold mb-4">Recent Alerts</h3>
                  <div className="space-y-4">
                    {recentAlerts.map((alert) => (
                      <div key={alert.id} className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          alert.priority === 'high' ? 'bg-red-500' : 
                          alert.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}></div>
                        <div>
                          <p className="text-sm font-medium">{alert.message}</p>
                          <p className="text-xs text-gray-500">{alert.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        );

      case "properties":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold">Your Properties</h3>
              <Button
                onClick={() => navigate('/owner/register-pg')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Building
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {mockPGs.map((pg) => (
                <Card key={pg.id} className="p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 border-0 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-bold mb-1">{pg.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin className="h-3 w-3" />
                        <span>{pg.location}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <div className="text-sm font-bold text-blue-600">{pg.totalRooms}</div>
                      <div className="text-xs text-gray-500">Total</div>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded">
                      <div className="text-sm font-bold text-green-600">{pg.occupiedRooms}</div>
                      <div className="text-xs text-gray-500">Occupied</div>
                    </div>
                    <div className="text-center p-2 bg-red-50 rounded">
                      <div className="text-sm font-bold text-red-600">{pg.totalRooms - pg.occupiedRooms}</div>
                      <div className="text-xs text-gray-500">Vacant</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
                      variant="default"
                      onClick={() => navigate(`/manage/pg/${pg.id}`)}
                      size="sm"
                    >
                      View Building Layout
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      size="sm"
                    >
                      Assign Tenant
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case "tenants":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold">Tenant Management</h3>
              <Input placeholder="Search by name or room" className="w-64" />
            </div>
            <div className="grid gap-4">
              {mockTenants.map((tenant) => (
                <Card key={tenant.id} className="p-4 hover:shadow-md transition-all duration-200 border-0 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{tenant.name}</h4>
                        <p className="text-sm text-gray-500">Room {tenant.room} • Joined {tenant.joinDate}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={tenant.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                            {tenant.status === 'paid' ? 'Rent Paid' : 'Rent Due'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">View Timeline</Button>
                      <Button size="sm">Contact</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case "analytics":
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">Analytics Dashboard</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="p-6">
                <h4 className="font-semibold mb-4">Occupancy Rate</h4>
                <div className="text-3xl font-bold text-blue-600 mb-2">88%</div>
                <p className="text-sm text-gray-500">↑ 5% from last month</p>
              </Card>
              <Card className="p-6">
                <h4 className="font-semibold mb-4">Monthly Revenue</h4>
                <div className="text-3xl font-bold text-green-600 mb-2">₹3.5L</div>
                <p className="text-sm text-gray-500">Expected vs Collected: 95%</p>
              </Card>
              <Card className="p-6">
                <h4 className="font-semibold mb-4">Highest Vacancy Floor</h4>
                <div className="text-3xl font-bold text-red-600 mb-2">Floor 2</div>
                <p className="text-sm text-gray-500">3 vacant rooms</p>
              </Card>
            </div>
            <Card className="p-6">
              <h4 className="font-semibold mb-4">Common Complaints</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>AC Issues</span>
                  <span className="font-semibold">45%</span>
                </div>
                <div className="flex justify-between">
                  <span>Water Problems</span>
                  <span className="font-semibold">30%</span>
                </div>
                <div className="flex justify-between">
                  <span>WiFi Issues</span>
                  <span className="font-semibold">25%</span>
                </div>
              </div>
            </Card>
          </div>
        );

      case "maintenance":
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">Maintenance Requests</h3>
            <div className="grid gap-4">
              <Card className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">AC Repair - Room B-205</h4>
                    <p className="text-sm text-gray-500">Reported 2 hours ago • High Priority</p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-700">In Progress</Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>Resolution Time: 4 hours avg</span>
                  <Button size="sm" variant="outline">View Photos</Button>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">WiFi Issue - Room A-101</h4>
                    <p className="text-sm text-gray-500">Reported 1 day ago • Medium Priority</p>
                  </div>
                  <Badge className="bg-green-100 text-green-700">Resolved</Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>Resolved in: 6 hours</span>
                  <Button size="sm" variant="outline">View Details</Button>
                </div>
              </Card>
            </div>
          </div>
        );

      case "reports":
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">Reports & Export</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h4 className="font-semibold mb-2">Monthly PG Report</h4>
                <p className="text-sm text-gray-500 mb-4">Complete monthly overview with all metrics</p>
                <Button className="w-full" size="sm">Download PDF</Button>
              </Card>
              <Card className="p-6">
                <h4 className="font-semibold mb-2">Tenant List</h4>
                <p className="text-sm text-gray-500 mb-4">Export tenant details and contact info</p>
                <Button className="w-full" variant="outline" size="sm">Download CSV</Button>
              </Card>
              <Card className="p-6">
                <h4 className="font-semibold mb-2">Rent Collection Report</h4>
                <p className="text-sm text-gray-500 mb-4">Monthly rent collection summary</p>
                <div className="space-y-2">
                  <Input type="month" className="w-full" />
                  <Button className="w-full" variant="outline" size="sm">Generate Report</Button>
                </div>
              </Card>
              <Card className="p-6">
                <h4 className="font-semibold mb-2">Maintenance Report</h4>
                <p className="text-sm text-gray-500 mb-4">Track maintenance requests and resolution</p>
                <Button className="w-full" variant="outline" size="sm">Download PDF</Button>
              </Card>
            </div>
          </div>
        );

      case "settings":
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">Settings & Configuration</h3>
            <div className="grid gap-6">
              <Card className="p-6">
                <h4 className="font-semibold mb-4">PG Information</h4>
                <div className="space-y-4">
                  <div>
                    <Label>Property Name</Label>
                    <Input placeholder="Enter property name" />
                  </div>
                  <div>
                    <Label>Contact Number</Label>
                    <Input placeholder="Enter contact number" />
                  </div>
                  <div>
                    <Label>Address</Label>
                    <Input placeholder="Enter full address" />
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <h4 className="font-semibold mb-4">Rent Rules</h4>
                <div className="space-y-4">
                  <div>
                    <Label>Monthly Rent Due Date</Label>
                    <Input type="number" placeholder="3" />
                  </div>
                  <div>
                    <Label>Late Payment Grace Period (days)</Label>
                    <Input type="number" placeholder="4" />
                  </div>
                  <div>
                    <Label>Security Deposit (months)</Label>
                    <Input type="number" placeholder="2" />
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <h4 className="font-semibold mb-4">Notification Preferences</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Rent Due Reminders</span>
                    <Button size="sm" variant="outline">Enabled</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Maintenance Alerts</span>
                    <Button size="sm" variant="outline">Enabled</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Vacancy Notifications</span>
                    <Button size="sm" variant="outline">Disabled</Button>
                  </div>
                </div>
              </Card>
              <Button className="w-full">Save All Changes</Button>
            </div>
          </div>
        );

      case "payments":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold">Payment Management</h3>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">Send Reminders</Button>
                <Button size="sm">Download Receipts</Button>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <Card className="p-4">
                <h4 className="font-semibold text-green-600">Collected</h4>
                <div className="text-2xl font-bold">₹2.8L</div>
              </Card>
              <Card className="p-4">
                <h4 className="font-semibold text-yellow-600">Pending</h4>
                <div className="text-2xl font-bold">₹45K</div>
              </Card>
              <Card className="p-4">
                <h4 className="font-semibold text-red-600">Overdue</h4>
                <div className="text-2xl font-bold">₹15K</div>
              </Card>
            </div>
            <div className="grid gap-4">
              {mockTenants.map((tenant) => {
                const status = getRentStatus(tenant.joinDate);
                return (
                  <Card key={tenant.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{tenant.name}</h4>
                        <p className="text-sm text-gray-500">Room {tenant.room} • UPI Payment</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                            status === 'overdue' ? 'bg-red-100 text-red-700' :
                            status === 'due' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {status === 'overdue' ? 'Overdue' : status === 'due' ? 'Due Soon' : 'Paid'}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Next: {tenant.nextRentDue}</p>
                        </div>
                        <Button size="sm" variant="outline">Send Reminder</Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Feature coming soon...</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-blue-600 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300`}>
        <div className="flex items-center justify-between h-16 px-6 bg-blue-700">
          <h1 className="text-xl font-bold text-white">
            PGConnect
          </h1>
          <Button
            variant="ghost"
            size="sm"
            className="text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4">
          <p className="text-blue-200 text-xs font-medium mb-4 px-2">MAIN MENU</p>
          
          <nav className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-500 text-white'
                      : 'text-blue-100 hover:bg-blue-500 hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-8 pt-4 border-t border-blue-500">
            <button
              onClick={async () => {
                await logout();
                navigate('/');
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-blue-100 hover:bg-blue-500 hover:text-white rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-sm font-medium">Log Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {showNotifications && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowNotifications(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="bg-white border-b h-16 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button
              className="w-10 h-10 rounded-lg bg-blue-500 hover:bg-blue-600 flex items-center justify-center transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <div className="flex flex-col gap-1">
                <div className="w-4 h-0.5 bg-white rounded"></div>
                <div className="w-4 h-0.5 bg-white rounded"></div>
                <div className="w-4 h-0.5 bg-white rounded"></div>
              </div>
            </button>
            
          <div className="flex items-center gap-3">
            <Button
              onClick={() => navigate('/home')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              ← Back to Home
            </Button>
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-gray-900">Good Morning, Robo</h2>
              <p className="text-sm text-gray-500">Here's your property overview for today</p>
            </div>
          </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>{getCurrentDate()}</span>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search properties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-gray-400" />
            </div>
            <div className="relative">
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </Button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
                  <div className="p-4 border-b">
                    <h3 className="font-semibold">Notifications</h3>
                  </div>
                  <div className="p-4 space-y-3">
                    {recentAlerts.map((alert) => (
                      <div key={alert.id} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          alert.priority === 'high' ? 'bg-red-500' : 
                          alert.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}></div>
                        <div>
                          <p className="text-sm font-medium">{alert.message}</p>
                          <p className="text-xs text-gray-500">{alert.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default OwnerDashboard;