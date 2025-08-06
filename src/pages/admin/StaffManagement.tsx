import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Search, Download, Edit, Trash2, Eye, Shield, Users } from "lucide-react";
import { mockStaff, mockRoles } from "@/data/mockData";
import { Staff, StaffFilters, Role } from "@/types/admin";
import AddStaffForm from "@/components/admin/AddStaffForm";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function StaffManagement() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [staff, setStaff] = useState<Staff[]>(mockStaff.filter(s => !s.isDeleted));
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [filters, setFilters] = useState<StaffFilters>({});
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCreateRoleForm, setShowCreateRoleForm] = useState(false);
  const [editingRole, setEditingRole] = useState<string | null>(null);

  // Filter staff based on current filters
  const filteredStaff = staff.filter(member => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (!member.fullName.toLowerCase().includes(searchLower) &&
          !member.phoneNumber.includes(searchLower) &&
          !member.workEmail.toLowerCase().includes(searchLower)) {
        return false;
      }
    }
    if (filters.country && member.country !== filters.country) return false;
    if (filters.department && member.department !== filters.department) return false;
    if (filters.employmentType && member.employmentType !== filters.employmentType) return false;
    return true;
  });

  const handleExportCSV = () => {
    const headers = ["Name", "Phone", "Address", "Email", "Country", "Joined Date", "Department", "Type of Employment"];
    const rows = filteredStaff.map(member => [
      member.fullName,
      member.phoneNumber,
      member.address,
      member.workEmail,
      member.country,
      member.joinedDate,
      member.department,
      member.employmentType
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "staff_list.csv";
    a.click();
  };

  const getEmploymentTypeBadge = (type: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      "Full-Time": "default",
      "Part-Time": "secondary",
      "Contract": "outline",
      "Intern": "destructive"
    };
    return variants[type] || "default";
  };

  const getRoleBadgeColor = (roleId?: string) => {
    if (!roleId) return "bg-muted text-muted-foreground";
    const role = mockRoles.find(r => r.id === roleId);
    if (!role) return "bg-muted text-muted-foreground";
    
    const colors: Record<string, string> = {
      "Management": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      "Sales": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      "Project": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      "Designer": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      "Developer": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
    };
    
    return colors[role.name] || "bg-muted text-muted-foreground";
  };

  const handleAddStaff = (newStaff: Staff) => {
    setStaff([...staff, newStaff]);
  };

  const handleDeleteStaff = (staffId: string) => {
    setStaff(staff.filter(s => s.id !== staffId));
    toast({
      title: "Success",
      description: "Staff member deleted successfully",
    });
  };

  const handleEditStaff = (staffId: string) => {
    navigate(`/admin/staff/edit/${staffId}`);
  };

  const handleRoleChange = (staffId: string, newRoleId: string) => {
    setStaff(staff.map(s => 
      s.id === staffId 
        ? { ...s, roleId: newRoleId, updatedAt: new Date().toISOString() }
        : s
    ));
    setEditingRole(null);
    toast({
      title: "Success",
      description: "Staff role updated successfully",
    });
  };

  const getPermissionCount = (role: Role) => {
    const allPermissions = Object.values(role.permissions).flatMap(p => Object.values(p));
    return allPermissions.filter(p => p).length;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const PermissionMatrix = ({ permissions, readOnly = true }: { permissions: any, readOnly?: boolean }) => {
    const modules = ['Staff Management', 'Role Management', 'Client Management'];
    const actions = ['create', 'read', 'update', 'delete'];

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left p-2 border-b">Module/Role</th>
              {roles.map(role => (
                <th key={role.id} className="text-center p-2 border-b min-w-24">{role.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {modules.map(module => (
              <tr key={module}>
                <td className="p-2 border-b font-medium">{module}</td>
                {roles.map(role => {
                  const moduleKey = module.replace(' Management', '').toLowerCase() + 's';
                  const modulePerms = role.permissions[moduleKey as keyof typeof role.permissions];
                  let access = "None";
                  
                  if (modulePerms) {
                    const hasAll = modulePerms.create && modulePerms.read && modulePerms.update && modulePerms.delete;
                    const hasRead = modulePerms.read;
                    
                    if (hasAll) access = "CRUD";
                    else if (hasRead) access = "Read";
                  }
                  
                  return (
                    <td key={role.id} className="text-center p-2 border-b">
                      <Badge 
                        variant={access === "CRUD" ? "default" : access === "Read" ? "secondary" : "outline"}
                        className="text-xs"
                      >
                        {access}
                      </Badge>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Staff & Role Management</h1>
          <p className="text-muted-foreground">
            Manage employee information, roles, and permissions
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Staff
        </Button>
      </div>

      <Tabs defaultValue="staff" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="staff">Staff Management</TabsTrigger>
          <TabsTrigger value="roles">Role Management</TabsTrigger>
        </TabsList>

        <TabsContent value="staff" className="space-y-6">

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, phone, email..."
                value={filters.search || ""}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-9"
              />
            </div>
            
            <Select value={filters.country || "all"} onValueChange={(value) => setFilters({ ...filters, country: value === "all" ? undefined : value })}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                <SelectItem value="Singapore">Singapore</SelectItem>
                <SelectItem value="Malaysia">Malaysia</SelectItem>
                <SelectItem value="Vietnam">Vietnam</SelectItem>
                <SelectItem value="Indonesia">Indonesia</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.department || "all"} onValueChange={(value) => setFilters({ ...filters, department: value === "all" ? undefined : value })}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="Management Team">Management Team</SelectItem>
                <SelectItem value="Project Team">Project Team</SelectItem>
                <SelectItem value="Sales Team">Sales Team</SelectItem>
                <SelectItem value="Design Team">Design Team</SelectItem>
                <SelectItem value="Development Team">Development Team</SelectItem>
                <SelectItem value="Maintenance Team">Maintenance Team</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={handleExportCSV} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Staff List */}
      <Card>
        <CardHeader>
          <CardTitle>Staff List ({filteredStaff.length})</CardTitle>
          <CardDescription>
            View and manage all staff members
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Employment Type</TableHead>
                  <TableHead>Assigned Role</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.fullName}</TableCell>
                    <TableCell>{member.phoneNumber}</TableCell>
                    <TableCell>{member.workEmail}</TableCell>
                    <TableCell>{member.country}</TableCell>
                    <TableCell>{member.department}</TableCell>
                    <TableCell>
                      <Badge variant={getEmploymentTypeBadge(member.employmentType)}>
                        {member.employmentType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {editingRole === member.id ? (
                        <div className="flex items-center gap-2">
                          <Select 
                            value={member.roleId || ""} 
                            onValueChange={(value) => handleRoleChange(member.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockRoles.map((role) => (
                                <SelectItem key={role.id} value={role.id}>
                                  {role.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingRole(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <div 
                          className="flex items-center gap-2 cursor-pointer"
                          onClick={() => setEditingRole(member.id)}
                        >
                          <span 
                            className={`px-2 py-1 rounded text-xs font-medium ${getRoleBadgeColor(member.roleId)}`}
                          >
                            {member.roleId ? mockRoles.find(r => r.id === member.roleId)?.name : "No Role"}
                          </span>
                          <Edit className="h-3 w-3 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{member.lastLoginDate || "Never"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedStaff(member)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditStaff(member.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteStaff(member.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-6">
          {/* Role Management Header */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold">Role Permissions</h2>
              <p className="text-muted-foreground">
                Management role details and permissions matrix
              </p>
            </div>
            <Button onClick={() => setShowCreateRoleForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Role
            </Button>
          </div>

          {/* Permission Matrix */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Role Permissions Matrix
              </CardTitle>
              <CardDescription>
                Overview of permissions across all roles and modules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PermissionMatrix permissions={{}} />
            </CardContent>
          </Card>

          {/* Roles List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                System Roles ({roles.length})
              </CardTitle>
              <CardDescription>
                View and manage all system roles and their permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Role Name</TableHead>
                      <TableHead>Permissions</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {roles.map((role) => (
                      <TableRow key={role.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {role.name}
                            {role.isDefault && (
                              <Badge variant="secondary">Default</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">
                            {getPermissionCount(role)} permissions enabled
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(role.lastUpdated)}</TableCell>
                        <TableCell>
                          <Badge variant="default">Active</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedRole(role)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              disabled={role.isDefault}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Staff Role Assignments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Staff Role Assignments
              </CardTitle>
              <CardDescription>
                View and manage role assignments for all staff members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Staff Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Assigned Role</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staff.map((member) => {
                      const assignedRole = roles.find(role => role.id === member.roleId);
                      return (
                        <TableRow key={member.id}>
                          <TableCell className="font-medium">{member.fullName}</TableCell>
                          <TableCell>{member.workEmail}</TableCell>
                          <TableCell>{member.department}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {assignedRole?.name || "No Role"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Staff Detail Modal */}
      {selectedStaff && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Staff Details - {selectedStaff.fullName}</CardTitle>
              <CardDescription>Complete information and login history</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Full Name</label>
                  <p className="text-sm text-muted-foreground">{selectedStaff.fullName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Phone Number</label>
                  <p className="text-sm text-muted-foreground">{selectedStaff.phoneNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Work Email</label>
                  <p className="text-sm text-muted-foreground">{selectedStaff.workEmail}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Country</label>
                  <p className="text-sm text-muted-foreground">{selectedStaff.country}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Department</label>
                  <p className="text-sm text-muted-foreground">{selectedStaff.department}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Employment Type</label>
                  <p className="text-sm text-muted-foreground">{selectedStaff.employmentType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Designation</label>
                  <p className="text-sm text-muted-foreground">{selectedStaff.designation}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Joined Date</label>
                  <p className="text-sm text-muted-foreground">{selectedStaff.joinedDate}</p>
                </div>
                {selectedStaff.approverEmail && (
                  <div>
                    <label className="text-sm font-medium">OT Approver Email</label>
                    <p className="text-sm text-muted-foreground">{selectedStaff.approverEmail}</p>
                  </div>
                )}
              </div>
              
              <div>
                <label className="text-sm font-medium">Address</label>
                <p className="text-sm text-muted-foreground">{selectedStaff.address}</p>
              </div>

              <div>
                <label className="text-sm font-medium">Login History</label>
                <div className="mt-2 p-3 bg-muted rounded-lg">
                  <p className="text-sm">Last Login: {selectedStaff.lastLoginDate || "Never logged in"}</p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setSelectedStaff(null)}>
                  Close
                </Button>
                <Button>Edit Staff</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Role Detail Modal */}
      {selectedRole && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Role Details - {selectedRole.name}
                {selectedRole.isDefault && (
                  <Badge variant="secondary">Default Role</Badge>
                )}
              </CardTitle>
              <CardDescription>
                Detailed permissions and last updated: {formatDate(selectedRole.lastUpdated)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold mb-4">Permission Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h5 className="font-medium mb-2">Staff Management</h5>
                    <div className="space-y-1 text-sm">
                      <div>Create: {selectedRole.permissions.staff?.create ? "✅" : "❌"}</div>
                      <div>Read: {selectedRole.permissions.staff?.read ? "✅" : "❌"}</div>
                      <div>Update: {selectedRole.permissions.staff?.update ? "✅" : "❌"}</div>
                      <div>Delete: {selectedRole.permissions.staff?.delete ? "✅" : "❌"}</div>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">Role Management</h5>
                    <div className="space-y-1 text-sm">
                      <div>Create: {selectedRole.permissions.roles?.create ? "✅" : "❌"}</div>
                      <div>Read: {selectedRole.permissions.roles?.read ? "✅" : "❌"}</div>
                      <div>Update: {selectedRole.permissions.roles?.update ? "✅" : "❌"}</div>
                      <div>Delete: {selectedRole.permissions.roles?.delete ? "✅" : "❌"}</div>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">Client Management</h5>
                    <div className="space-y-1 text-sm">
                      <div>Create: {selectedRole.permissions.clients?.create ? "✅" : "❌"}</div>
                      <div>Read: {selectedRole.permissions.clients?.read ? "✅" : "❌"}</div>
                      <div>Update: {selectedRole.permissions.clients?.update ? "✅" : "❌"}</div>
                      <div>Delete: {selectedRole.permissions.clients?.delete ? "✅" : "❌"}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setSelectedRole(null)}>
                  Close
                </Button>
                {!selectedRole.isDefault && (
                  <Button>Edit Permissions</Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Create Role Form Modal */}
      {showCreateRoleForm && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Create New Role</CardTitle>
              <CardDescription>
                Define a new role with custom permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Role Name</label>
                <Input 
                  placeholder="Enter role name"
                  className="mt-1"
                />
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4">Permissions</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['Staff Management', 'Role Management', 'Client Management'].map(module => (
                    <div key={module} className="space-y-2">
                      <h5 className="font-medium">{module}</h5>
                      {['create', 'read', 'update', 'delete'].map(action => (
                        <div key={action} className="flex items-center space-x-2">
                          <Checkbox id={`${module}-${action}`} />
                          <label htmlFor={`${module}-${action}`} className="text-sm capitalize">
                            {action}
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowCreateRoleForm(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowCreateRoleForm(false)}>
                  Create Role
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Staff Form */}
      {showAddForm && (
        <AddStaffForm 
          onClose={() => setShowAddForm(false)}
          onAdd={handleAddStaff}
        />
      )}
    </div>
  );
}