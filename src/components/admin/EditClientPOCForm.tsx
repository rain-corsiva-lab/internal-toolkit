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
    salesPIC: poc.salesPIC,
    phoneNumber: poc.contactNumber,
    email: poc.contactEmail,
    status: poc.projectStatus as "Active" | "Inactive"
  });

  const salesStaff = getSalesStaff();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.contactName.trim() || !formData.salesPIC || !formData.phoneNumber.trim() || !formData.email.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const updatedPOC: ClientPOC = {
      ...poc,
      contactName: formData.contactName,
      salesPIC: formData.salesPIC,
      contactNumber: formData.phoneNumber,
      contactEmail: formData.email,
      projectStatus: formData.status,
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
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
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
                <Label htmlFor="contactName">POC Name *</Label>
                <Input
                  id="contactName"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  placeholder="Enter POC name"
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
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email"
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="status">POC Status *</Label>
                <Select value={formData.status} onValueChange={(value: "Active" | "Inactive") => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
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