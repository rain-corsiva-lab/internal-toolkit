import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { X, Check, ChevronsUpDown } from "lucide-react";
import { ClientPOC } from "@/types/admin";
import { useToast } from "@/hooks/use-toast";
import { getSalesStaff, mockClients } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface AddClientPOCFormProps {
  onClose: () => void;
  onAdd: (poc: ClientPOC) => void;
}

export default function AddClientPOCForm({ onClose, onAdd }: AddClientPOCFormProps) {
  const { toast } = useToast();
  const salesStaff = getSalesStaff();
  const [open, setOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    contactName: "",
    contactNumber: "",
    contactEmail: "",
    designation: "",
    salesPIC: "",
    projectStatus: "Quoted" as "Quoted" | "Confirmed",
    clientId: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.contactName || !formData.contactNumber || !formData.contactEmail || 
        !formData.designation || !formData.salesPIC || !formData.clientId) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newPOC: ClientPOC = {
      id: `poc_${Date.now()}`,
      clientId: formData.clientId,
      contactName: formData.contactName,
      contactNumber: formData.contactNumber,
      contactEmail: formData.contactEmail,
      designation: formData.designation,
      salesPIC: formData.salesPIC,
      projectStatus: formData.projectStatus,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onAdd(newPOC);
    toast({
      title: "Success",
      description: "Client POC added successfully"
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Add Client POC</CardTitle>
              <CardDescription>Enter client point of contact information</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="company">Company *</Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                  >
                    {formData.clientId
                      ? mockClients.find((client) => client.id === formData.clientId)?.companyName
                      : "Select company..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search company..." />
                    <CommandList>
                      <CommandEmpty>No company found.</CommandEmpty>
                      <CommandGroup>
                        {mockClients.map((client) => (
                          <CommandItem
                            key={client.id}
                            value={client.companyName}
                            onSelect={() => {
                              setFormData({ ...formData, clientId: client.id });
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.clientId === client.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {client.companyName}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
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
                Add Client POC
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}