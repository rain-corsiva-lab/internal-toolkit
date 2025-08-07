import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Shield, Check, X, Eye, Users, Edit, Trash2 } from "lucide-react";
import { mockRoles, mockStaff } from "@/data/mockData";
import { Role, Staff } from "@/types/admin";
import { useToast } from "@/hooks/use-toast";

export default function RoleManagement() {
  const { toast } = useToast();
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [staff, setStaff] = useState<Staff[]>(mockStaff.filter(s => !s.isDeleted));
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showCreateRoleForm, setShowCreateRoleForm] = useState(false);
  const [editingStaffRole, setEditingStaffRole] = useState<string | null>(null);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRolePermissions, setNewRolePermissions] = useState({
    staff: { create: false, read: false, update: false, delete: false },
    roles: { create: false, read: false, update: false, delete: false },
    clients: { create: false, read: false, update: false, delete: false }
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getRoleColor = (roleName: string) => {
    const colors: Record<string, string> = {
      "Management": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      "Sales": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      "Project": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      "Designer": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      "Developer": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
    };
    return colors[roleName] || "bg-muted text-muted-foreground";
  };

  const getPermissionIcon = (hasPermission: boolean, readOnly?: boolean) => {
    if (readOnly) {
      return <Eye className="h-4 w-4 text-blue-500" />;
    }
    return hasPermission ? (
      <Check className="h-4 w-4 text-green-500" />
    ) : (
      <X className="h-4 w-4 text-red-500" />
    );
  };

  const getPermissionLevel = (permissions: any) => {
    const hasAll = permissions.create && permissions.read && permissions.update && permissions.delete;
    const hasRead = permissions.read && !permissions.create && !permissions.update && !permissions.delete;
    
    if (hasAll) return "full";
    if (hasRead) return "read";
    return "none";
  };

  const setPermissionLevel = (module: string, level: string) => {
    setNewRolePermissions(prev => ({
      ...prev,
      [module]: {
        create: level === "full",
        read: level === "full" || level === "read",
        update: level === "full",
        delete: level === "full"
      }
    }));
  };

  const handleCreateRole = () => {
    if (!newRoleName.trim()) {
      toast({
        title: "Error",
        description: "Role name is required",
        variant: "destructive",
      });
      return;
    }

    const newRole: Role = {
      id: `role_${Date.now()}`,
      name: newRoleName,
      permissions: newRolePermissions,
      lastUpdated: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    setRoles([...roles, newRole]);
    setNewRoleName("");
    setNewRolePermissions({
      staff: { create: false, read: false, update: false, delete: false },
      roles: { create: false, read: false, update: false, delete: false },
      clients: { create: false, read: false, update: false, delete: false }
    });
    setShowCreateRoleForm(false);
    
    toast({
      title: "Success",
      description: "Role created successfully",
    });
  };

  const handleStaffRoleChange = (staffId: string, newRoleId: string) => {
    setStaff(staff.map(s => 
      s.id === staffId 
        ? { ...s, roleId: newRoleId, updatedAt: new Date().toISOString() }
        : s
    ));
    setEditingStaffRole(null);
    toast({
      title: "Success",
      description: "Staff role updated successfully",
    });
  };

  const PermissionMatrix = () => {
    const modules = [
      { name: "Staff Management", key: "staff" },
      { name: "Role Management", key: "roles" },
      { name: "Client Management", key: "clients" }
    ];

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left p-3 border-b font-semibold">Module</th>
              {roles.map(role => (
                <th key={role.id} className="text-center p-3 border-b min-w-32 font-semibold">
                  {role.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {modules.map(module => (
              <tr key={module.key} className="hover:bg-muted/50">
                <td className="p-3 border-b font-medium">{module.name}</td>
                {roles.map(role => {
                  const modulePerms = role.permissions[module.key as keyof typeof role.permissions];
                  const level = getPermissionLevel(modulePerms);
                  
                  return (
                    <td key={role.id} className="text-center p-3 border-b">
                      <div className="flex justify-center">
                        {level === "full" ? (
                          <Badge variant="default" className="text-xs">
                            <Check className="h-3 w-3 mr-1" />
                            Full Access
                          </Badge>
                        ) : level === "read" ? (
                          <Badge variant="secondary" className="text-xs">
                            <Eye className="h-3 w-3 mr-1" />
                            View Only
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            <X className="h-3 w-3 mr-1" />
                            No Access
                          </Badge>
                        )}
                      </div>
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

  const CreateRoleForm = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>Create New Role</CardTitle>
          <CardDescription>Define role name and permissions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="roleName">Role Name *</Label>
            <Input
              id="roleName"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
              placeholder="Enter role name"
              required
            />
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold">Permissions</h4>
            {[
              { name: "Staff Management", key: "staff" },
              { name: "Role Management", key: "roles" },
              { name: "Client Management", key: "clients" }
            ].map(module => (
              <div key={module.key} className="space-y-2">
                <Label>{module.name}</Label>
                <Select 
                  value={getPermissionLevel(newRolePermissions[module.key as keyof typeof newRolePermissions])}
                  onValueChange={(value) => setPermissionLevel(module.key, value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Access</SelectItem>
                    <SelectItem value="read">View Only</SelectItem>
                    <SelectItem value="full">Full Access</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowCreateRoleForm(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateRole}>
              Create Role
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Role Management</h1>
          <p className="text-muted-foreground">
            View and manage all system roles and their permissions
          </p>
        </div>
        <Button onClick={() => setShowCreateRoleForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Role
        </Button>
      </div>

      <Tabs defaultValue="roles" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="roles">Role Permissions</TabsTrigger>
          <TabsTrigger value="assignments">Staff Role Assignments</TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="space-y-6">

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
          <PermissionMatrix />
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
            Manage individual roles and their detailed permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role Name</TableHead>
                  <TableHead>Staff Management</TableHead>
                  <TableHead>Role Management</TableHead>
                  <TableHead>Client Management</TableHead>
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
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleColor(role.name)}`}>
                          {role.name}
                        </span>
                        {role.isDefault && (
                          <Badge variant="secondary" className="text-xs">
                            Default
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        {getPermissionIcon(
                          role.permissions.staff.create && role.permissions.staff.update && role.permissions.staff.delete,
                          role.permissions.staff.read && !role.permissions.staff.create
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        {getPermissionIcon(
                          role.permissions.roles.create && role.permissions.roles.update && role.permissions.roles.delete,
                          role.permissions.roles.read && !role.permissions.roles.create
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        {getPermissionIcon(
                          role.permissions.clients.create && role.permissions.clients.update && role.permissions.clients.delete,
                          role.permissions.clients.read && !role.permissions.clients.create
                        )}
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
                          onClick={() => {
                            toast({
                              title: "Edit Role",
                              description: "Role editing functionality would be implemented here",
                            });
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {!role.isDefault && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setRoles(roles.filter(r => r.id !== role.id));
                              toast({
                                title: "Success",
                                description: "Role deleted successfully",
                              });
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
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

        <TabsContent value="assignments" className="space-y-6">
          {/* Staff Role Assignments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Staff Role Assignments ({staff.length})
              </CardTitle>
              <CardDescription>
                Manage role assignments for all staff members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Staff Name</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Employment Type</TableHead>
                      <TableHead>Current Role</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staff.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">{member.fullName}</TableCell>
                        <TableCell>{member.department}</TableCell>
                        <TableCell>
                          <Badge variant={member.employmentType === "Full-Time" ? "default" : "secondary"}>
                            {member.employmentType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {editingStaffRole === member.id ? (
                            <div className="flex items-center gap-2">
                              <Select 
                                value={member.roleId || ""} 
                                onValueChange={(value) => handleStaffRoleChange(member.id, value)}
                              >
                                <SelectTrigger className="w-40">
                                  <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                  {roles.map((role) => (
                                    <SelectItem key={role.id} value={role.id}>
                                      {role.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingStaffRole(null)}
                              >
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <div 
                              className="flex items-center gap-2 cursor-pointer"
                              onClick={() => setEditingStaffRole(member.id)}
                            >
                              <span 
                                className={`px-2 py-1 rounded text-xs font-medium ${
                                  member.roleId 
                                    ? getRoleColor(roles.find(r => r.id === member.roleId)?.name || "")
                                    : "bg-muted text-muted-foreground"
                                }`}
                              >
                                {member.roleId ? roles.find(r => r.id === member.roleId)?.name : "No Role"}
                              </span>
                              <Edit className="h-3 w-3 text-muted-foreground" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingStaffRole(member.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Role Form Modal */}
      {showCreateRoleForm && <CreateRoleForm />}

      {/* Role Details Modal */}
      {selectedRole && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Role Details: {selectedRole.name}
              </CardTitle>
              <CardDescription>
                Detailed permissions for this role
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                {Object.entries(selectedRole.permissions).map(([module, perms]) => (
                  <div key={module} className="space-y-3">
                    <h4 className="font-semibold capitalize">{module} Management</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                       {Object.entries(perms).map(([action, hasPermission]) => (
                         <div key={action} className="flex items-center gap-2">
                           {getPermissionIcon(hasPermission as boolean)}
                           <span className="text-sm capitalize">{action}</span>
                         </div>
                       ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedRole(null)}>
                  Close
                </Button>
                <Button onClick={() => {
                  toast({
                    title: "Edit Role",
                    description: "Role editing functionality would be implemented here",
                  });
                }}>
                  Edit Role
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}