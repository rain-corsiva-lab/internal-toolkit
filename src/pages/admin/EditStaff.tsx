import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { mockStaff } from "@/data/mockData";
import type { Staff } from "@/types/admin";

export default function EditStaff() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  
  const staff = mockStaff.find(s => s.id === id);
  
  const [formData, setFormData] = useState<Omit<Staff, 'id' | 'createdAt' | 'updatedAt'>>({
    fullName: staff?.fullName || "",
    phoneNumber: staff?.phoneNumber || "",
    address: staff?.address || "",
    workEmail: staff?.workEmail || "",
    country: staff?.country || "Singapore",
    department: staff?.department || "Management Team",
    employmentType: staff?.employmentType || "Full-Time",
    designation: staff?.designation || "",
    joinedDate: staff?.joinedDate || "",
    otApproverEmail: staff?.otApproverEmail || "",
    leaveApproverEmail: staff?.leaveApproverEmail || "",
    lastLoginDate: staff?.lastLoginDate || "",
    isDeleted: staff?.isDeleted || false,
  });

  if (!staff) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Staff Not Found</h1>
          <Button onClick={() => navigate("/admin/staff")} className="mt-4">
            Back to Staff Management
          </Button>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    // In real app, this would call an API to update the staff member
    toast({
      title: "Staff Updated",
      description: `${formData.fullName} has been successfully updated.`,
    });
    navigate("/admin/staff");
  };

  const handleCancel = () => {
    navigate("/admin/staff");
  };

  const handleDelete = () => {
    // In real app, this would call an API to delete the staff member
    toast({
      title: "Staff Deleted",
      description: `${formData.fullName} has been successfully deleted.`,
      variant: "destructive",
    });
    navigate("/admin/staff");
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/admin/staff")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Staff Member</h1>
          <p className="text-muted-foreground">
            Update staff member information
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Staff Information</CardTitle>
          <CardDescription>
            Edit the staff member's details. All fields except joined date can be modified.
          </CardDescription>
        </CardHeader>
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
                value={formData.joinedDate ? new Date(formData.joinedDate).toISOString().split('T')[0] : ""}
                onChange={(e) => setFormData({ ...formData, joinedDate: e.target.value })}
                required
              />
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
              <Label htmlFor="leaveApproverEmail">Leave Approver Email</Label>
              <Input
                id="leaveApproverEmail"
                type="email"
                value={formData.leaveApproverEmail}
                onChange={(e) => setFormData({ ...formData, leaveApproverEmail: e.target.value })}
                placeholder="Enter leave approver email (optional)"
              />
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-6">
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Staff
            </Button>
            <div className="flex gap-4">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}