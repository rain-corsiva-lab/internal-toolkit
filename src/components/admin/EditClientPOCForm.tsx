import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Plus, Minus } from "lucide-react";
import { ClientPOC } from "@/types/admin";
import { getSalesStaff } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

interface ContactSet {
  id: string;
  phoneNumber: string;
  email: string;
  company: string;
  status: "Active" | "Inactive";
}

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
  });

  const [contactSets, setContactSets] = useState<ContactSet[]>([
    {
      id: "1",
      phoneNumber: poc.contactNumber,
      email: poc.contactEmail,
      company: "Default Company", // You might want to get this from the client data
      status: poc.projectStatus
    }
  ]);

  const salesStaff = getSalesStaff();

  const addContactSet = () => {
    const newSet: ContactSet = {
      id: Date.now().toString(),
      phoneNumber: "",
      email: "",
      company: "",
      status: "Active"
    };
    setContactSets([...contactSets, newSet]);
  };

  const removeContactSet = (id: string) => {
    if (contactSets.length > 1) {
      setContactSets(contactSets.filter(set => set.id !== id));
    }
  };

  const updateContactSet = (id: string, field: keyof ContactSet, value: string) => {
    setContactSets(contactSets.map(set => 
      set.id === id ? { ...set, [field]: value } : set
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.contactName.trim() || !formData.salesPIC) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Validate contact sets
    const validContactSets = contactSets.filter(set => 
      set.phoneNumber.trim() && set.email.trim() && set.company.trim()
    );

    if (validContactSets.length === 0) {
      toast({
        title: "Error",
        description: "At least one complete contact set is required",
        variant: "destructive",
      });
      return;
    }

    // For simplicity, use the first contact set for the main POC data
    const primaryContact = validContactSets[0];
    
    const updatedPOC: ClientPOC = {
      ...poc,
      contactName: formData.contactName,
      salesPIC: formData.salesPIC,
      contactNumber: primaryContact.phoneNumber,
      contactEmail: primaryContact.email,
      projectStatus: primaryContact.status,
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
            {/* POC Name and Sales PIC */}
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
            </div>

            {/* Contact Sets */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold">Contact Information</Label>
                <Button type="button" variant="outline" size="sm" onClick={addContactSet}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Contact Set
                </Button>
              </div>

              {contactSets.map((contactSet, index) => (
                <Card key={contactSet.id} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">Contact Set {index + 1}</h4>
                    {contactSets.length > 1 && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeContactSet(contactSet.id)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <Input
                        value={contactSet.phoneNumber}
                        onChange={(e) => updateContactSet(contactSet.id, "phoneNumber", e.target.value)}
                        placeholder="Enter phone number"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={contactSet.email}
                        onChange={(e) => updateContactSet(contactSet.id, "email", e.target.value)}
                        placeholder="Enter email"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Company</Label>
                      <Input
                        value={contactSet.company}
                        onChange={(e) => updateContactSet(contactSet.id, "company", e.target.value)}
                        placeholder="Enter company"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>POC Status</Label>
                      <Select 
                        value={contactSet.status} 
                        onValueChange={(value) => updateContactSet(contactSet.id, "status", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </Card>
              ))}
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