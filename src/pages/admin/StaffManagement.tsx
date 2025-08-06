import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Download, Edit, Trash2, Eye } from "lucide-react";
import { mockStaff } from "@/data/mockData";
import { Staff, StaffFilters } from "@/types/admin";

export default function StaffManagement() {
  const [staff, setStaff] = useState<Staff[]>(mockStaff.filter(s => !s.isDeleted));
  const [filters, setFilters] = useState<StaffFilters>({});
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Staff Management</h1>
          <p className="text-muted-foreground">
            Manage employee information and track login history
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="bg-admin-primary hover:bg-admin-primary-hover">
          <Plus className="h-4 w-4 mr-2" />
          Add New Staff
        </Button>
      </div>

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
            
            <Select value={filters.country || ""} onValueChange={(value) => setFilters({ ...filters, country: value || undefined })}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Countries</SelectItem>
                <SelectItem value="Singapore">Singapore</SelectItem>
                <SelectItem value="Malaysia">Malaysia</SelectItem>
                <SelectItem value="Vietnam">Vietnam</SelectItem>
                <SelectItem value="Indonesia">Indonesia</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.department || ""} onValueChange={(value) => setFilters({ ...filters, department: value || undefined })}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Departments</SelectItem>
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
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
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
    </div>
  );
}