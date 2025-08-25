import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { Staff } from "@/types/admin";
import { mockRoles, mockStaff } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

interface AddStaffFormProps {
  onClose: () => void;
  onSubmit: (staff: Staff) => void;
}

export default function AddStaffForm({ onClose, onSubmit }: AddStaffFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
    workEmail: "",
    country: "",
    department: "",
    employmentType: "",
    designation: "",
    otApproverEmail: "",
    leaveApproverEmail: "",
    roleId: "",
    allowance: "",
    grossSalary: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.phoneNumber || !formData.workEmail || !formData.country || !formData.department || !formData.employmentType) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newStaff: Staff = {
      id: `staff_${Date.now()}`,
      fullName: formData.fullName,
      phoneNumber: formData.phoneNumber,
      address: formData.address,
      workEmail: formData.workEmail,
      country: formData.country as Staff["country"],
      joinedDate: new Date().toISOString().split('T')[0],
      department: formData.department as Staff["department"],
      employmentType: formData.employmentType as Staff["employmentType"],
      designation: formData.designation,
      otApproverEmail: formData.otApproverEmail || undefined,
      leaveApproverEmail: formData.leaveApproverEmail || undefined,
      isDeleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      roleId: formData.roleId,
      allowance: formData.allowance || undefined,
      grossSalary: formData.grossSalary || undefined
    };

    onSubmit(newStaff);
    toast({
      title: "Success",
      description: "Staff member added successfully",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Add New Staff</CardTitle>
              <CardDescription>Add a new employee to the system</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Label htmlFor="country">Country *</Label>
                <Select value={formData.country} onValueChange={(value) => setFormData({ ...formData, country: value })}>
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

              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
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
                <Label htmlFor="employmentType">Employment Type *</Label>
                <Select value={formData.employmentType} onValueChange={(value) => setFormData({ ...formData, employmentType: value })}>
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
                <Label htmlFor="designation">Designation</Label>
                <Input
                  id="designation"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  placeholder="Enter designation"
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
                  placeholder="Enter OT approver email"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="leaveApproverEmail">Leave Approver Email</Label>
                <Select value={formData.leaveApproverEmail} onValueChange={(value) => setFormData({ ...formData, leaveApproverEmail: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select leave approver" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockStaff.filter(s => !s.isDeleted).map((staff) => (
                      <SelectItem key={staff.id} value={staff.workEmail}>
                        {staff.fullName} - {staff.workEmail}
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

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter address"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                Add Staff
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}