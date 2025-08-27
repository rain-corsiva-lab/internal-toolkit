import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Mock current user data - in real app this would come from auth context
const currentUser = {
  id: "1",
  fullName: "John Smith",
  phoneNumber: "+65 9123 4567",
  address: "123 Marina Bay, Singapore",
  workEmail: "john.smith@company.com",
  country: "Singapore",
  joinedDate: "2023-01-15",
  department: "Management Team",
  employmentType: "Full-Time",
  designation: "CEO",
  leaveApproverEmail: "board@company.com",
  otApproverEmail: "hr@company.com",
  allowance: "SGD 1,500",
  grossSalary: "SGD 12,000",
  createdAt: "2023-01-15T09:00:00Z",
  updatedAt: "2024-01-08T14:30:00Z"
};

export default function Profile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    phoneNumber: currentUser.phoneNumber,
    address: currentUser.address,
  });

  const handleSave = () => {
    // In real app, this would call an API to update the profile
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const handleCancel = () => {
    setFormData({
      phoneNumber: currentUser.phoneNumber,
      address: currentUser.address,
    });
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/admin")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your personal information
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            View and update your profile details. Only phone number and address can be edited.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input 
                id="fullName" 
                value={currentUser.fullName} 
                disabled 
                className="bg-muted text-muted-foreground"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="workEmail">Work Email</Label>
              <Input 
                id="workEmail" 
                value={currentUser.workEmail} 
                disabled 
                className="bg-muted text-muted-foreground"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="Enter phone number"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input 
                id="country" 
                value={currentUser.country} 
                disabled 
                className="bg-muted text-muted-foreground"
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter address"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input 
                id="department" 
                value={currentUser.department} 
                disabled 
                className="bg-muted text-muted-foreground"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="designation">Designation</Label>
              <Input 
                id="designation" 
                value={currentUser.designation} 
                disabled 
                className="bg-muted text-muted-foreground"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="employmentType">Employment Type</Label>
              <Input 
                id="employmentType" 
                value={currentUser.employmentType} 
                disabled 
                className="bg-muted text-muted-foreground"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="joinedDate">Joined Date</Label>
              <Input 
                id="joinedDate" 
                value={new Date(currentUser.joinedDate).toLocaleDateString()} 
                disabled 
                className="bg-muted text-muted-foreground"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="leaveApproverEmail">Leave Approver Email</Label>
              <Input 
                id="leaveApproverEmail" 
                value={currentUser.leaveApproverEmail || "N/A"} 
                disabled 
                className="bg-muted text-muted-foreground"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="otApproverEmail">OT Approver Email</Label>
              <Input 
                id="otApproverEmail" 
                value={currentUser.otApproverEmail || "N/A"} 
                disabled 
                className="bg-muted text-muted-foreground"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="allowance">Allowance</Label>
              <Input 
                id="allowance" 
                value={currentUser.allowance || "N/A"} 
                disabled 
                className="bg-muted text-muted-foreground"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="grossSalary">Gross Salary</Label>
              <Input 
                id="grossSalary" 
                value={currentUser.grossSalary || "N/A"} 
                disabled 
                className="bg-muted text-muted-foreground"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-4 pt-6">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}