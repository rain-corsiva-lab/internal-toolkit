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
  const [showEditRoleForm, setShowEditRoleForm] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [editingStaffRole, setEditingStaffRole] = useState<string | null>(null);
  const [editingRolePermissions, setEditingRolePermissions] = useState<string | null>(null);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRolePermissions, setNewRolePermissions] = useState({
    staff: { create: false, read: false, update: false, delete: false },
    roles: { create: false, read: false, update: false, delete: false },
    clients: { create: false, read: false, update: false, delete: false },
    exportContacts: false
  });
  const [editRoleName, setEditRoleName] = useState("");
  const [editRolePermissions, setEditRolePermissions] = useState({
    staff: { create: false, read: false, update: false, delete: false },
    roles: { create: false, read: false, update: false, delete: false },
    clients: { create: false, read: false, update: false, delete: false },
    exportContacts: false
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
    if (module === "exportContacts") {
      setNewRolePermissions(prev => ({
        ...prev,
        exportContacts: level === "full"
      }));
    } else {
      setNewRolePermissions(prev => ({
        ...prev,
        [module]: {
          create: level === "full",
          read: level === "full" || level === "read",
          update: level === "full",
          delete: level === "full"
        }
      }));
    }
  };

  const setEditPermissionLevel = (module: string, level: string) => {
    if (module === "exportContacts") {
      setEditRolePermissions(prev => ({
        ...prev,
        exportContacts: level === "full"
      }));
    } else {
      setEditRolePermissions(prev => ({
        ...prev,
        [module]: {
          create: level === "full",
          read: level === "full" || level === "read",
          update: level === "full",
          delete: level === "full"
        }
      }));
    }
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setEditRoleName(role.name);
    setEditRolePermissions(role.permissions);
    setShowEditRoleForm(true);
  };

  const handleUpdateRole = () => {
    if (!editRoleName.trim() || !editingRole) {
      toast({
        title: "Error",
        description: "Role name is required",
        variant: "destructive",
      });
      return;
    }

    const updatedRole: Role = {
      ...editingRole,
      name: editRoleName,
      permissions: editRolePermissions,
      lastUpdated: new Date().toISOString()
    };

    setRoles(roles.map(r => r.id === editingRole.id ? updatedRole : r));
    setEditRoleName("");
    setEditRolePermissions({
      staff: { create: false, read: false, update: false, delete: false },
      roles: { create: false, read: false, update: false, delete: false },
      clients: { create: false, read: false, update: false, delete: false },
      exportContacts: false
    });
    setEditingRole(null);
    setShowEditRoleForm(false);
    
    toast({
      title: "Success",
      description: "Role updated successfully",
    });
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
      clients: { create: false, read: false, update: false, delete: false },
      exportContacts: false
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

  const permissionCategories = [
    {
      name: "Staff Management",
      key: "staff",
      subFunctions: [
        { name: "Add Employee", permission: "create" },
        { name: "View Employee", permission: "read" },
        { name: "Edit Employee", permission: "update" },
        { name: "Delete Employee", permission: "delete" }
      ]
    },
    {
      name: "Role Management", 
      key: "roles",
      subFunctions: [
        { name: "Create Role", permission: "create" },
        { name: "View Role", permission: "read" },
        { name: "Edit Role", permission: "update" },
        { name: "Delete Role", permission: "delete" }
      ]
    },
    {
      name: "Client Management",
      key: "clients", 
      subFunctions: [
        { name: "Add Client", permission: "create" },
        { name: "View Client", permission: "read" },
        { name: "Edit Client", permission: "update" },
        { name: "Delete Client", permission: "delete" },
        { name: "Export Contacts", permission: "exportContacts" }
      ]
    }
  ];

  const PermissionMatrix = () => {

    const getPermissionBadge = (hasPermission: boolean) => {
      if (hasPermission) {
        return (
          <Badge variant="default" className="text-xs">
            <Check className="h-3 w-3 mr-1" />
            Full Access
          </Badge>
        );
      } else {
        return (
          <Badge variant="outline" className="text-xs">
            <X className="h-3 w-3 mr-1" />
            No Access
          </Badge>
        );
      }
    };

    return (
      <div className="space-y-6">
        {/* Role Names Header */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="font-semibold text-lg">Functions</div>
          {roles.map(role => (
            <div key={role.id} className="text-center">
              <span className={`px-3 py-2 rounded-lg text-sm font-medium ${getRoleColor(role.name)}`}>
                {role.name}
              </span>
            </div>
          ))}
        </div>

        {/* Permission Categories */}
        {permissionCategories.map(category => (
          <Card key={category.key}>
            <CardHeader>
              <CardTitle className="text-lg">{category.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {category.subFunctions.map(subFunc => (
                  <div key={subFunc.name} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center py-2 border-b last:border-b-0">
                    <div className="font-medium text-sm">{subFunc.name}</div>
                     {roles.map(role => {
                        let hasPermission = false;
                        if (category.key === "exportContacts") {
                          hasPermission = role.permissions.exportContacts;
                        } else {
                          const categoryPerms = role.permissions[category.key as keyof typeof role.permissions];
                          hasPermission = categoryPerms[subFunc.permission as keyof typeof categoryPerms];
                        }
                        
                        return (
                          <div key={role.id} className="flex justify-center">
                            {editingRolePermissions === role.id ? (
                              <div className="flex gap-2">
                                <Select 
                                  value={hasPermission ? "full" : "none"}
                                  onValueChange={(value) => {
                                    const updatedPermissions = { ...role.permissions };
                                    if (category.key === "exportContacts") {
                                      updatedPermissions.exportContacts = value === "full";
                                    } else {
                                      updatedPermissions[category.key as keyof typeof updatedPermissions][subFunc.permission as keyof any] = value === "full";
                                    }
                                    
                                    setRoles(roles.map(r => 
                                      r.id === role.id 
                                        ? { ...r, permissions: updatedPermissions, lastUpdated: new Date().toISOString() }
                                        : r
                                    ));
                                  }}
                                >
                                  <SelectTrigger className="w-24 h-8">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="none">No Access</SelectItem>
                                    <SelectItem value="full">Full Access</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            ) : (
                              getPermissionBadge(hasPermission)
                            )}
                          </div>
                        );
                      })}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
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
              <h4 className="font-semibold">Permissions *</h4>
              {permissionCategories.map(category => (
                <div key={category.key} className="space-y-3">
                  <h5 className="font-medium text-sm">{category.name}</h5>
                  {category.subFunctions.map(subFunc => (
                    <div key={subFunc.name} className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm">{subFunc.name}</span>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={(() => {
                            if (subFunc.permission === "exportContacts") {
                              return newRolePermissions.exportContacts;
                            } else {
                              const categoryPerms = newRolePermissions[category.key as keyof typeof newRolePermissions];
                              return categoryPerms[subFunc.permission as keyof typeof categoryPerms];
                            }
                          })()}
                          onChange={(e) => {
                            if (subFunc.permission === "exportContacts") {
                              setNewRolePermissions(prev => ({
                                ...prev,
                                exportContacts: e.target.checked
                              }));
                            } else {
                              setNewRolePermissions(prev => ({
                                ...prev,
                                [category.key]: {
                                  ...(prev[category.key as keyof typeof prev] as any),
                                  [subFunc.permission]: e.target.checked
                                }
                              }));
                            }
                          }}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label className="text-sm font-medium">
                          {(() => {
                            if (subFunc.permission === "exportContacts") {
                              return newRolePermissions.exportContacts ? "Enabled" : "Disabled";
                            } else {
                              const categoryPerms = newRolePermissions[category.key as keyof typeof newRolePermissions];
                              return categoryPerms[subFunc.permission as keyof typeof categoryPerms] ? "Enabled" : "Disabled";
                            }
                          })()}
                        </label>
                      </div>
                    </div>
                  ))}
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

  const EditRoleForm = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>Edit Role</CardTitle>
          <CardDescription>Update role name and permissions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="editRoleName">Role Name *</Label>
            <Input
              id="editRoleName"
              value={editRoleName}
              onChange={(e) => setEditRoleName(e.target.value)}
              placeholder="Enter role name"
              required
            />
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold">Permissions</h4>
            {permissionCategories.map(module => (
              <div key={module.key} className="space-y-2">
                <Label>{module.name}</Label>
                <Select 
                  value={module.key === "exportContacts" 
                    ? (editRolePermissions.exportContacts ? "full" : "none")
                    : getPermissionLevel(editRolePermissions[module.key as keyof typeof editRolePermissions])
                  }
                  onValueChange={(value) => setEditPermissionLevel(module.key, value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Access</SelectItem>
                    {module.key !== "exportContacts" && <SelectItem value="read">View Only</SelectItem>}
                    <SelectItem value="full">Full Access</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => {
              setShowEditRoleForm(false);
              setEditingRole(null);
              setEditRoleName("");
              setEditRolePermissions({
                staff: { create: false, read: false, update: false, delete: false },
                roles: { create: false, read: false, update: false, delete: false },
                clients: { create: false, read: false, update: false, delete: false },
                exportContacts: false
              });
            }}>
              Cancel
            </Button>
            <Button onClick={handleUpdateRole}>
              Update Role
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
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="roles">Custom Role Permission Matrix</TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="space-y-6">
          {/* System Role Permission with Detailed Functions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Custom Role Permission Matrix ({roles.length})
              </CardTitle>
              <CardDescription>
                Manage roles and their detailed function permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Role Names Header */}
                <div className="grid grid-cols-6 gap-4 items-center">
                  <div className="font-semibold text-lg">Functions</div>
                  {roles.map(role => (
                    <div key={role.id} className="text-center">
                      <div className="flex flex-col items-center gap-2">
                        <span className={`px-3 py-2 rounded-lg text-sm font-medium ${getRoleColor(role.name)}`}>
                          {role.name}
                        </span>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingRolePermissions(editingRolePermissions === role.id ? null : role.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setRoles(roles.filter(r => r.id !== role.id));
                              toast({
                                title: "Success",
                                description: "Role deleted successfully",
                              });
                            }}
                            className="h-8 w-8 p-0"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                 {/* Permission Categories */}
                {permissionCategories.map(category => (
                  <Card key={category.key}>
                    <CardHeader>
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {category.subFunctions.map(subFunc => (
                          <div key={subFunc.name} className="grid grid-cols-6 gap-4 items-center py-2 border-b last:border-b-0">
                            <div className="font-medium text-sm">{subFunc.name}</div>
                             {roles.map(role => {
                               let hasPermission = false;
                               if (subFunc.permission === "exportContacts") {
                                 hasPermission = role.permissions.exportContacts;
                               } else if (category.key === "clients") {
                                 const categoryPerms = role.permissions[category.key as keyof typeof role.permissions];
                                 hasPermission = categoryPerms[subFunc.permission as keyof typeof categoryPerms];
                               } else {
                                 const categoryPerms = role.permissions[category.key as keyof typeof role.permissions];
                                 hasPermission = categoryPerms[subFunc.permission as keyof typeof categoryPerms];
                               }
                               
                               return (
                                 <div key={role.id} className="flex justify-center">
                                   {editingRolePermissions === role.id ? (
                                     <Select 
                                       value={hasPermission ? "full" : "none"}
                                       onValueChange={(value) => {
                                         const updatedPermissions = { ...role.permissions };
                                         if (subFunc.permission === "exportContacts") {
                                           updatedPermissions.exportContacts = value === "full";
                                         } else {
                                           (updatedPermissions[category.key as keyof typeof updatedPermissions] as any)[subFunc.permission] = value === "full";
                                         }
                                         
                                         setRoles(roles.map(r => 
                                           r.id === role.id 
                                             ? { ...r, permissions: updatedPermissions, lastUpdated: new Date().toISOString() }
                                             : r
                                         ));
                                       }}
                                     >
                                       <SelectTrigger className="w-24 h-8">
                                         <SelectValue />
                                       </SelectTrigger>
                                       <SelectContent>
                                         <SelectItem value="none">No Access</SelectItem>
                                         <SelectItem value="full">Full Access</SelectItem>
                                       </SelectContent>
                                     </Select>
                                    ) : (
                                      <div className="flex justify-center">
                                        {hasPermission ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-red-500" />}
                                      </div>
                                    )}
                                 </div>
                               );
                             })}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                 {editingRolePermissions && (
                   <div className="flex justify-end mt-4">
                     <Button 
                       onClick={() => {
                         setEditingRolePermissions(null);
                         toast({
                           title: "Success",
                           description: "Role permissions updated successfully",
                         });
                       }}
                     >
                       Save Changes
                     </Button>
                   </div>
                 )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>

      {/* Create Role Form Modal */}
      {showCreateRoleForm && <CreateRoleForm />}

      {/* Edit Role Form Modal */}
      {showEditRoleForm && <EditRoleForm />}

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