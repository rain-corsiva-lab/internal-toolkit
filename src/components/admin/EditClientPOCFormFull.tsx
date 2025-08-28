import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Plus } from "lucide-react";
import { ClientPOC } from "@/types/admin";
import { getSalesStaff, mockClients } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

interface ContactSet {
  companyName: string;
  phoneNumber: string;
  email: string;
  status: "Active" | "Inactive";
}

interface EditClientPOCFormFullProps {
  poc: ClientPOC;
  onClose: () => void;
  onSave: (updatedPOC: ClientPOC) => void;
  onDelete: (pocId: string) => void;
}

export default function EditClientPOCFormFull({ poc, onClose, onSave, onDelete }: EditClientPOCFormFullProps) {
  const { toast } = useToast();
  const [pocName, setPocName] = useState(poc.contactName);
  const [salesPIC, setSalesPIC] = useState(poc.salesPIC);
  const [contactSets, setContactSets] = useState<ContactSet[]>([
    {
      companyName: poc.clientId,
      phoneNumber: poc.contactNumber,
      email: poc.contactEmail,
      status: poc.projectStatus as "Active" | "Inactive"
    }
  ]);

  const salesStaff = getSalesStaff();
  const clients = mockClients;

  const handleAddContactSet = () => {
    setContactSets([...contactSets, {
      companyName: "",
      phoneNumber: "",
      email: "",
      status: "Active"
    }]);
  };

  const handleRemoveContactSet = (index: number) => {
    if (contactSets.length > 1) {
      setContactSets(contactSets.filter((_, i) => i !== index));
    }
  };

  const handleContactSetChange = (index: number, field: keyof ContactSet, value: string) => {
    const updated = [...contactSets];
    updated[index] = { ...updated[index], [field]: value };
    setContactSets(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate first contact set
    const firstContact = contactSets[0];
    if (!pocName.trim() || !firstContact.companyName.trim() || !firstContact.phoneNumber.trim() || !firstContact.email.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const updatedPOC: ClientPOC = {
      ...poc,
      clientId: firstContact.companyName,
      contactName: pocName,
      salesPIC: salesPIC,
      contactNumber: firstContact.phoneNumber,
      contactEmail: firstContact.email,
      projectStatus: firstContact.status,
      updatedAt: new Date().toISOString()
    };

    onSave(updatedPOC);
    onClose();

    toast({
      title: "Success",
      description: "Client POC updated successfully",
    });
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this Client POC? This action cannot be undone.")) {
      onDelete(poc.id);
      onClose();
      toast({
        title: "Success",
        description: "Client POC deleted successfully",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
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
                <Label htmlFor="pocName">POC Name *</Label>
                <Input
                  id="pocName"
                  value={pocName}
                  onChange={(e) => setPocName(e.target.value)}
                  placeholder="Enter POC name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salesPIC">Sales PIC *</Label>
                <Select value={salesPIC} onValueChange={setSalesPIC}>
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
                <h3 className="text-lg font-semibold">Contact Sets</h3>
                <Button type="button" variant="outline" onClick={handleAddContactSet}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Contact Set
                </Button>
              </div>

              {contactSets.map((contact, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Contact Set {index + 1}</CardTitle>
                      {contactSets.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveContactSet(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`companyName${index}`}>Company Name *</Label>
                        <Select
                          value={contact.companyName}
                          onValueChange={(value) => handleContactSetChange(index, 'companyName', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select company" />
                          </SelectTrigger>
                          <SelectContent>
                            {clients.map(client => (
                              <SelectItem key={client.id} value={client.id}>
                                {client.companyName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`phoneNumber${index}`}>Phone Number *</Label>
                        <Input
                          id={`phoneNumber${index}`}
                          value={contact.phoneNumber}
                          onChange={(e) => handleContactSetChange(index, 'phoneNumber', e.target.value)}
                          placeholder="Enter phone number"
                          required={index === 0}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`email${index}`}>Email *</Label>
                        <Input
                          id={`email${index}`}
                          type="email"
                          value={contact.email}
                          onChange={(e) => handleContactSetChange(index, 'email', e.target.value)}
                          placeholder="Enter email"
                          required={index === 0}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`status${index}`}>POC Status *</Label>
                        <Select 
                          value={contact.status} 
                          onValueChange={(value: "Active" | "Inactive") => handleContactSetChange(index, 'status', value)}
                        >
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
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-between">
              <Button type="button" variant="destructive" onClick={handleDelete}>
                Delete Client POC
              </Button>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit">
                  Update POC
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}