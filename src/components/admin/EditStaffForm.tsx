import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { mockStaff, mockRoles } from "@/data/mockData";
import type { Staff } from "@/types/admin";

interface EditStaffFormProps {
  staff: Staff;
  onClose: () => void;
  onSubmit: (staff: Staff) => void;
}

export default function EditStaffForm({ staff, onClose, onSubmit }: EditStaffFormProps) {
  const { toast } = useToast();

  const [formData, setFormData] = useState<Omit<Staff, 'id' | 'createdAt' | 'updatedAt'>>({
    fullName: staff.fullName,
    phoneNumber: staff.phoneNumber,
    address: staff.address,
    workEmail: staff.workEmail,
    country: staff.country,
    department: staff.department,
    employmentType: staff.employmentType,
    designation: staff.designation,
    joinedDate: staff.joinedDate,
    otApproverEmail: staff.otApproverEmail || "",
    leaveApproverEmail: staff.leaveApproverEmail || "",
    lastLoginDate: staff.lastLoginDate,
    isDeleted: staff.isDeleted || false,
    roleId: staff.roleId || "",
    allowance: staff.allowance || "",
    grossSalary: staff.grossSalary || ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.workEmail || !formData.phoneNumber || !formData.address || !formData.designation || !formData.joinedDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const updatedStaff: Staff = {
      ...staff,
      ...formData,
      updatedAt: new Date().toISOString()
    };

    onSubmit(updatedStaff);
    
    toast({
      title: "Staff Updated",
      description: `${formData.fullName} has been successfully updated.`,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Edit Staff Member</CardTitle>
            <CardDescription>
              Update staff member information. All fields are editable.
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Enter full name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="workEmail">Work Email *</Label>
                <Input
                  id="workEmail"
                  type="email"
                  value={formData.workEmail}
                  onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
                  placeholder="Enter work email"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  placeholder="Enter phone number"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Select 
                  value={formData.country} 
                  onValueChange={(value) => setFormData({ ...formData, country: value as Staff['country'] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Singapore">Singapore</SelectItem>
                    <SelectItem value="Malaysia">Malaysia</SelectItem>
                    <SelectItem value="Vietnam">Vietnam</SelectItem>
                    <SelectItem value="Indonesia">Indonesia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Enter address"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Select 
                  value={formData.department} 
                  onValueChange={(value) => setFormData({ ...formData, department: value as Staff['department'] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Management Team">Management Team</SelectItem>
                    <SelectItem value="Project Team">Project Team</SelectItem>
                    <SelectItem value="Sales Team">Sales Team</SelectItem>
                    <SelectItem value="Design Team">Design Team</SelectItem>
                    <SelectItem value="Development Team">Development Team</SelectItem>
                    <SelectItem value="Maintenance Team">Maintenance Team</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="designation">Designation *</Label>
                <Input
                  id="designation"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  placeholder="Enter designation"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="employmentType">Employment Type *</Label>
                <Select 
                  value={formData.employmentType} 
                  onValueChange={(value) => setFormData({ ...formData, employmentType: value as Staff['employmentType'] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select employment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-Time">Full-Time</SelectItem>
                    <SelectItem value="Part-Time">Part-Time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Intern">Intern</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="joinedDate">Joined Date *</Label>
                <Input
                  id="joinedDate"
                  type="date"
                  value={formData.joinedDate ? (() => {
                    // Handle DD/MM/YYYY format from mock data
                    if (formData.joinedDate.includes('/')) {
                      const [day, month, year] = formData.joinedDate.split('/');
                      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                    }
                    // Handle ISO format
                    return formData.joinedDate.split('T')[0];
                  })() : ""}
                  onChange={(e) => setFormData({ ...formData, joinedDate: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Assigned Role</Label>
                <Select value={formData.roleId} onValueChange={(value) => setFormData({ ...formData, roleId: value })}>
                  <SelectTrigger>
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
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="otApproverEmail">OT Approver Email</Label>
                <Input
                  id="otApproverEmail"
                  type="email"
                  value={formData.otApproverEmail}
                  onChange={(e) => setFormData({ ...formData, otApproverEmail: e.target.value })}
                  placeholder="Enter OT approver email (optional)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="leaveApproverEmail">Leave Approver Email *</Label>
                <Select value={formData.leaveApproverEmail} onValueChange={(value) => setFormData({ ...formData, leaveApproverEmail: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select leave approver" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockStaff.filter(s => !s.isDeleted && s.id !== staff.id).map((staffMember) => (
                      <SelectItem key={staffMember.id} value={staffMember.workEmail}>
                        {staffMember.fullName} - {staffMember.workEmail}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="allowance">Allowance (Optional)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                    {formData.country === "Singapore" ? "SGD" : 
                     formData.country === "Malaysia" ? "MYR" : 
                     formData.country === "Vietnam" ? "VND" : 
                     formData.country === "Indonesia" ? "IDR" : ""}
                  </span>
                  <Input
                    id="allowance"
                    value={formData.allowance}
                    onChange={(e) => setFormData({ ...formData, allowance: e.target.value })}
                    placeholder="Enter allowance amount"
                    className="pl-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="grossSalary">Gross Salary (Optional)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                    {formData.country === "Singapore" ? "SGD" : 
                     formData.country === "Malaysia" ? "MYR" : 
                     formData.country === "Vietnam" ? "VND" : 
                     formData.country === "Indonesia" ? "IDR" : ""}
                  </span>
                  <Input
                    id="grossSalary"
                    value={formData.grossSalary}
                    onChange={(e) => setFormData({ ...formData, grossSalary: e.target.value })}
                    placeholder="Enter gross salary amount"
                    className="pl-12"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-4 pt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                Update Staff
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}