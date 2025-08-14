import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { ClientPOC } from "@/types/admin";
import { getSalesStaff } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

interface EditClientPOCFormProps {
  poc: ClientPOC;
  onClose: () => void;
  onSave: (updatedPOC: ClientPOC) => void;
}

export default function EditClientPOCForm({ poc, onClose, onSave }: EditClientPOCFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    contactName: poc.contactName,
    contactNumber: poc.contactNumber,
    contactEmail: poc.contactEmail,
    designation: poc.designation,
    salesPIC: poc.salesPIC,
    projectStatus: poc.projectStatus,
    projectName: poc.projectName || "",
    projectType: poc.projectType || ""
  });

  const salesStaff = getSalesStaff();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.contactName.trim() || !formData.contactNumber.trim() || 
        !formData.contactEmail.trim() || !formData.designation.trim() || 
        !formData.salesPIC) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const updatedPOC: ClientPOC = {
      ...poc,
      ...formData,
      updatedAt: new Date().toISOString()
    };

    onSave(updatedPOC);
    onClose();

    toast({
      title: "Success",
      description: "Client POC updated successfully",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Edit Client POC</CardTitle>
              <CardDescription>Update client point of contact information</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactName">Contact Name *</Label>
                <Input
                  id="contactName"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  placeholder="Enter contact name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactNumber">Contact Number *</Label>
                <Input
                  id="contactNumber"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  placeholder="Enter contact number"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email *</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  placeholder="Enter contact email"
                  required
                />
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
                <Label htmlFor="salesPIC">Sales PIC *</Label>
                <Select value={formData.salesPIC} onValueChange={(value) => setFormData({ ...formData, salesPIC: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sales person" />
                  </SelectTrigger>
                  <SelectContent>
                    {salesStaff.map(staff => (
                      <SelectItem key={staff.id} value={staff.id}>
                        {staff.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectStatus">Project Status</Label>
                <Select value={formData.projectStatus} onValueChange={(value) => setFormData({ ...formData, projectStatus: value as "Active" | "Inactive" })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select project status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectName">Project Name</Label>
                <Input
                  id="projectName"
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  placeholder="Enter project name (optional)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectType">Project Type</Label>
                <Input
                  id="projectType"
                  value={formData.projectType}
                  onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                  placeholder="Enter project type (optional)"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                Update POC
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}