import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Shield, Building2, TrendingUp } from "lucide-react";
import { mockStaff, mockRoles, mockClients, mockClientPOCs } from "@/data/mockData";

export default function Dashboard() {
  const activeStaff = mockStaff.filter(staff => !staff.isDeleted).length;
  const totalRoles = mockRoles.length;
  const totalClients = mockClients.length;
  const totalPOCs = mockClientPOCs.length;

  const stats = [
    {
      title: "Total Staff",
      value: activeStaff,
      description: "Active employees",
      icon: Users,
      change: "+2 this month"
    },
    {
      title: "Active Roles",
      value: totalRoles,
      description: "System roles",
      icon: Shield,
      change: "5 roles configured"
    },
    {
      title: "Clients",
      value: totalClients,
      description: "Active clients",
      icon: Building2,
      change: "+1 this quarter"
    },
    {
      title: "Client POCs",
      value: totalPOCs,
      description: "Points of contact",
      icon: TrendingUp,
      change: "+3 this month"
    }
  ];

  const recentActivity = [
    { action: "New staff member added", user: "John Smith", time: "2 hours ago" },
    { action: "Client POC updated", user: "Sarah Johnson", time: "4 hours ago" },
    { action: "Role permissions modified", user: "John Smith", time: "1 day ago" },
    { action: "New client registered", user: "Sarah Johnson", time: "2 days ago" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-primary rounded-lg p-6 text-primary-foreground">
        <h1 className="text-2xl font-bold mb-2">Welcome to Admin Panel</h1>
        <p className="text-primary-foreground/90">
          Manage your staff, roles, and clients efficiently from this central dashboard.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="transition-all duration-200 hover:shadow-elevation">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
              <p className="text-xs text-admin-success mt-1">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest actions performed in the system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">by {activity.user}</p>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Commonly used administrative functions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <button className="w-full p-3 text-left rounded-lg border border-border hover:bg-muted transition-colors">
              <div className="font-medium">Add New Staff</div>
              <div className="text-sm text-muted-foreground">Register a new employee</div>
            </button>
            <button className="w-full p-3 text-left rounded-lg border border-border hover:bg-muted transition-colors">
              <div className="font-medium">Create Role</div>
              <div className="text-sm text-muted-foreground">Define new permissions</div>
            </button>
            <button className="w-full p-3 text-left rounded-lg border border-border hover:bg-muted transition-colors">
              <div className="font-medium">Add Client</div>
              <div className="text-sm text-muted-foreground">Register new client company</div>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}