import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Shield, Check, X, Eye } from "lucide-react";
import { mockRoles } from "@/data/mockData";
import { Role } from "@/types/admin";
import { useToast } from "@/hooks/use-toast";

export default function RoleManagement() {
  const { toast } = useToast();
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showCreateRoleForm, setShowCreateRoleForm] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
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
                        {role.name}
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
                          Edit
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