import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Download, Edit, Eye } from "lucide-react";
import { mockStaff, mockRoles } from "@/data/mockData";
import { Staff, StaffFilters } from "@/types/admin";
import AddStaffForm from "@/components/admin/AddStaffForm";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function StaffManagement() {
  const { toast } = useToast();
  const navigate = useNavigate();
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
    const headers = ["Name", "Phone", "Email", "Joined Date", "Department", "Employment Type", "Country"];
    const rows = filteredStaff.map(member => [
      member.fullName,
      member.phoneNumber,
      member.workEmail,
      member.joinedDate,
      member.department,
      member.employmentType,
      member.country
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

  const handleAddStaff = (newStaff: Staff) => {
    setStaff([...staff, newStaff]);
  };

  const handleEditStaff = (staffId: string) => {
    navigate(`/admin/staff/edit/${staffId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Staff Management</h1>
          <p className="text-muted-foreground">
            Manage employee information and details
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
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
                   <TableHead>Email</TableHead>
                   <TableHead>Role</TableHead>
                   <TableHead>Joined Date</TableHead>
                   <TableHead>Department</TableHead>
                   <TableHead>Employment Type</TableHead>
                   <TableHead>Country</TableHead>
                   <TableHead>Actions</TableHead>
                 </TableRow>
              </TableHeader>
              <TableBody>
                 {filteredStaff.map((member) => {
                   const memberRole = mockRoles.find(role => role.id === member.roleId);
                   return (
                     <TableRow key={member.id}>
                       <TableCell className="font-medium">{member.fullName}</TableCell>
                       <TableCell>{member.workEmail}</TableCell>
                       <TableCell>
                         {memberRole ? (
                           <Badge variant="outline">{memberRole.name}</Badge>
                         ) : (
                           <span className="text-muted-foreground text-sm">No role assigned</span>
                         )}
                       </TableCell>
                       <TableCell>{formatDate(member.joinedDate)}</TableCell>
                       <TableCell>{member.department}</TableCell>
                       <TableCell>
                         <Badge variant={getEmploymentTypeBadge(member.employmentType)}>
                           {member.employmentType}
                         </Badge>
                       </TableCell>
                       <TableCell>{member.country}</TableCell>
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
                         </div>
                       </TableCell>
                     </TableRow>
                   );
                 })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Staff Form Modal */}
      {showAddForm && (
        <AddStaffForm
          onClose={() => setShowAddForm(false)}
          onSubmit={handleAddStaff}
        />
      )}

      {/* Staff Details Modal */}
      {selectedStaff && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Staff Details</CardTitle>
              <CardDescription>View staff member information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium">Name:</span>
                  <p>{selectedStaff.fullName}</p>
                </div>
                <div>
                  <span className="font-medium">Email:</span>
                  <p>{selectedStaff.workEmail}</p>
                </div>
                <div>
                  <span className="font-medium">Phone:</span>
                  <p>{selectedStaff.phoneNumber}</p>
                </div>
                <div>
                  <span className="font-medium">Country:</span>
                  <p>{selectedStaff.country}</p>
                </div>
                <div>
                  <span className="font-medium">Department:</span>
                  <p>{selectedStaff.department}</p>
                </div>
                <div>
                  <span className="font-medium">Employment Type:</span>
                  <p>{selectedStaff.employmentType}</p>
                </div>
                <div>
                  <span className="font-medium">Designation:</span>
                  <p>{selectedStaff.designation}</p>
                </div>
                <div>
                  <span className="font-medium">Joined Date:</span>
                  <p>{formatDate(selectedStaff.joinedDate)}</p>
                </div>
                <div className="col-span-2">
                  <span className="font-medium">Address:</span>
                  <p>{selectedStaff.address}</p>
                </div>
                <div>
                  <span className="font-medium">OT Approver Email:</span>
                  <p>{selectedStaff.otApproverEmail || "N/A"}</p>
                </div>
                <div>
                  <span className="font-medium">Leave Approver Email:</span>
                  <p>{selectedStaff.leaveApproverEmail || "N/A"}</p>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => setSelectedStaff(null)}>Close</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}