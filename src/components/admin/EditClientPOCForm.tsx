import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { ClientPOC } from "@/types/admin";
import { useToast } from "@/hooks/use-toast";
import { getSalesStaff, mockClients } from "@/data/mockData";

interface EditClientPOCFormProps {
  poc: ClientPOC;
  onClose: () => void;
  onSave: (poc: ClientPOC) => void;
}

export default function EditClientPOCForm({ poc, onClose, onSave }: EditClientPOCFormProps) {
  const { toast } = useToast();
  const salesStaff = getSalesStaff();
  const client = mockClients.find(c => c.id === poc.clientId);
  
  const [formData, setFormData] = useState({
    contactName: poc.contactName,
    contactNumber: poc.contactNumber,
    contactEmail: poc.contactEmail,
    designation: poc.designation,
    salesPIC: poc.salesPIC,
    projectStatus: poc.projectStatus
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.contactName || !formData.contactNumber || !formData.contactEmail || 
        !formData.designation || !formData.salesPIC) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const updatedPOC: ClientPOC = {
      ...poc,
      contactName: formData.contactName,
      contactNumber: formData.contactNumber,
      contactEmail: formData.contactEmail,
      designation: formData.designation,
      salesPIC: formData.salesPIC,
      projectStatus: formData.projectStatus,
      updatedAt: new Date().toISOString()
    };

    onSave(updatedPOC);
    toast({
      title: "Success",
      description: "Client POC updated successfully"
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Edit Client POC</CardTitle>
              <CardDescription>Update client point of contact information</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={client?.companyName || "Unknown Company"}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactName">Contact Name *</Label>
                <Input
                  id="contactName"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  placeholder="Enter contact name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="contactNumber">Contact Number *</Label>
                <Input
                  id="contactNumber"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  placeholder="Enter contact number"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="contactEmail">Contact Email Address *</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  placeholder="Enter contact email"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="designation">Contact Designation *</Label>
                <Input
                  id="designation"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  placeholder="Enter designation"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="salesPIC">Sales PIC *</Label>
                <Select 
                  value={formData.salesPIC} 
                  onValueChange={(value) => setFormData({ ...formData, salesPIC: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sales person" />
                  </SelectTrigger>
                  <SelectContent>
                    {salesStaff.map((staff) => (
                      <SelectItem key={staff.id} value={staff.id}>
                        {staff.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="projectStatus">Project Status</Label>
                <Select 
                  value={formData.projectStatus} 
                  onValueChange={(value) => setFormData({ ...formData, projectStatus: value as "Quoted" | "Confirmed" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Quoted">Quoted</SelectItem>
                    <SelectItem value="Confirmed">Confirmed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}