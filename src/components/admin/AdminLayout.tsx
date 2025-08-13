import { useState } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Users, 
  Shield, 
  Building2, 
  Menu, 
  X,
  LayoutDashboard,
  User,
  LogOut,
  ChevronDown,
  ChevronRight,
  Plus,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  { 
    name: "Staff Management", 
    href: "/admin/staff", 
    icon: Users,
    subItems: [
      { name: "Create Staff", href: "/admin/staff/create", icon: Plus, permission: "create" },
      { name: "View Staff", href: "/admin/staff", icon: Eye, permission: "read" },
      { name: "Edit Staff", href: "/admin/staff/edit", icon: Edit, permission: "update" },
      { name: "Delete Staff", href: "/admin/staff/delete", icon: Trash2, permission: "delete" },
    ]
  },
  { 
    name: "Role Management", 
    href: "/admin/roles", 
    icon: Shield,
    subItems: [
      { name: "Create Role", href: "/admin/roles/create", icon: Plus, permission: "create" },
      { name: "View Roles", href: "/admin/roles", icon: Eye, permission: "read" },
      { name: "Edit Role", href: "/admin/roles/edit", icon: Edit, permission: "update" },
      { name: "Delete Role", href: "/admin/roles/delete", icon: Trash2, permission: "delete" },
    ]
  },
  { 
    name: "Client Management", 
    href: "/admin/clients", 
    icon: Building2,
    subItems: [
      { name: "Create Client", href: "/admin/clients/create", icon: Plus, permission: "create" },
      { name: "View Clients", href: "/admin/clients", icon: Eye, permission: "read" },
      { name: "Edit Client", href: "/admin/clients/edit", icon: Edit, permission: "update" },
      { name: "Delete Client", href: "/admin/clients/delete", icon: Trash2, permission: "delete" },
    ]
  },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const handleLogout = () => {
    // In real app, this would call logout API and clear auth state
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 transform bg-card border-r border-border transition-transform duration-300 ease-in-out lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-border">
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Admin Panel
            </h1>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navigation.map((item) => {
              const isExpanded = expandedItems.includes(item.name);
              const isMainActive = location.pathname === item.href || 
                (item.href !== "/admin" && location.pathname.startsWith(item.href));
              
              return (
                <Collapsible 
                  key={item.name} 
                  open={isExpanded}
                  onOpenChange={() => toggleExpanded(item.name)}
                >
                  <CollapsibleTrigger className="w-full">
                    <div className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-muted hover:text-foreground",
                      isMainActive && !isExpanded
                        ? "bg-primary text-primary-foreground shadow-primary"
                        : "text-muted-foreground"
                    )}>
                      <item.icon className="h-4 w-4" />
                      <span className="flex-1 text-left">{item.name}</span>
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </div>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="space-y-1 pl-6 mt-1">
                    {item.subItems?.map((subItem) => {
                      const isSubActive = location.pathname === subItem.href;
                      
                      return (
                        <NavLink
                          key={subItem.name}
                          to={subItem.href}
                          className={cn(
                            "flex items-center gap-3 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200",
                            isSubActive
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                          )}
                          onClick={() => setSidebarOpen(false)}
                        >
                          <subItem.icon className="h-3 w-3" />
                          {subItem.name}
                        </NavLink>
                      );
                    })}
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-border p-4">
            <div className="text-xs text-muted-foreground">
              Admin Panel v1.0
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-4 w-4" />
          </Button>
          
          <div className="flex-1">
            <h2 className="text-lg font-semibold">
              {navigation.find(item => 
                location.pathname === item.href || 
                (item.href !== "/admin" && location.pathname.startsWith(item.href))
              )?.name || "Dashboard"}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground">
              Welcome, Admin
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => navigate("/admin/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}