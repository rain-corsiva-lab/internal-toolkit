import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit, Eye, Shield, Users } from "lucide-react";
import { mockRoles, mockStaff } from "@/data/mockData";
import { Role, Staff, CRUDPermissions } from "@/types/admin";

export default function RoleManagement() {
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const getPermissionCount = (role: Role) => {
    const allPermissions = Object.values(role.permissions).flatMap(p => Object.values(p));
    return allPermissions.filter(p => p).length;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const PermissionMatrix = ({ permissions, readOnly = true }: { permissions: any, readOnly?: boolean }) => {
    const modules = ['staff', 'roles', 'clients', 'dashboard'];
    const actions = ['create', 'read', 'update', 'delete'];

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left p-2 border-b">Module</th>
              {actions.map(action => (
                <th key={action} className="text-center p-2 border-b capitalize">{action}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {modules.map(module => (
              <tr key={module}>
                <td className="p-2 border-b font-medium capitalize">{module}</td>
                {actions.map(action => (
                  <td key={action} className="text-center p-2 border-b">
                    <Checkbox 
                      checked={permissions[module]?.[action] || false}
                      disabled={readOnly}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Mock staff-role assignments
  const staffRoleAssignments = mockStaff.map(staff => ({
    ...staff,
    roleId: staff.department === "Management Team" ? "1" : 
            staff.department === "Sales Team" ? "2" :
            staff.department === "Project Team" ? "3" :
            staff.department === "Design Team" ? "4" : "5"
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Role Management</h1>
          <p className="text-muted-foreground">
            Manage system roles and permissions
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="bg-admin-primary hover:bg-admin-primary-hover">
          <Plus className="h-4 w-4 mr-2" />
          Create Role
        </Button>
      </div>

      <Tabs defaultValue="roles" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="roles">Role Permissions</TabsTrigger>
          <TabsTrigger value="staff-roles">Staff Roles</TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="space-y-6">
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
        </TabsContent>

        <TabsContent value="staff-roles" className="space-y-6">
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
                    {staffRoleAssignments.filter(staff => !staff.isDeleted).map((staff) => {
                      const assignedRole = roles.find(role => role.id === staff.roleId);
                      return (
                        <TableRow key={staff.id}>
                          <TableCell className="font-medium">{staff.fullName}</TableCell>
                          <TableCell>{staff.workEmail}</TableCell>
                          <TableCell>{staff.department}</TableCell>
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
                <h4 className="text-lg font-semibold mb-4">Permission Matrix</h4>
                <PermissionMatrix permissions={selectedRole.permissions} />
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
      {showCreateForm && (
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
                <input 
                  type="text"
                  className="w-full mt-1 px-3 py-2 border border-border rounded-md"
                  placeholder="Enter role name"
                />
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4">Permissions</h4>
                <PermissionMatrix 
                  permissions={{
                    staff: { create: false, read: false, update: false, delete: false },
                    roles: { create: false, read: false, update: false, delete: false },
                    clients: { create: false, read: false, update: false, delete: false },
                    dashboard: { create: false, read: false, update: false, delete: false }
                  }} 
                  readOnly={false}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowCreateForm(false)}>
                  Create Role
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}