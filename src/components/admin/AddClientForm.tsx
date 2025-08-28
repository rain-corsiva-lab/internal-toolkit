import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus, Trash2 } from "lucide-react";
import { Client, ClientPOC } from "@/types/admin";
import { getSalesStaff, mockClientPOCs } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

interface AddClientFormProps {
  onClose: () => void;
  onAdd: (client: Client) => void;
  onAddClientPOC: (poc: ClientPOC) => void;
}

export default function AddClientForm({ onClose, onAdd, onAddClientPOC }: AddClientFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    companyName: "",
    registrationNumber: "",
    addresses: [{ address: "", type: "Main" as "Main" | "Other" }],
    country: "",
    industry: "",
    customIndustry: ""
  });

  const [pocData, setPocData] = useState({
    name: "",
    salesPIC: "",
    phoneNumber: "",
    email: "",
    status: "Active" as "Active" | "Inactive",
    isNewName: false
  });

  const salesStaff = getSalesStaff();
  const existingPOCs = mockClientPOCs;

  const industries = [
    "Retail",
    "F&B", 
    "Manufacturing, Engineering and Technology",
    "Sports",
    "Education",
    "Medical",
    "Professional Services",
    "Event & Hospitality",
    "Construction",
    "Automobile",
    "Non-profit Organization/ Social Enterprise",
    "Beauty and Fashion",
    "Art, music and Entertainment",
    "Others"
  ];

  const addAddress = () => {
    setFormData({
      ...formData,
      addresses: [...formData.addresses, { address: "", type: "Other" }]
    });
  };

  const removeAddress = (index: number) => {
    if (formData.addresses.length > 1) {
      setFormData({
        ...formData,
        addresses: formData.addresses.filter((_, i) => i !== index)
      });
    }
  };

  const updateAddress = (index: number, address: string) => {
    const newAddresses = [...formData.addresses];
    newAddresses[index].address = address;
    setFormData({ ...formData, addresses: newAddresses });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const hasEmptyAddress = formData.addresses.some(addr => !addr.address.trim());
    if (!formData.companyName || hasEmptyAddress || !formData.country || !formData.industry) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (formData.industry === "Others" && !formData.customIndustry) {
      toast({
        title: "Error", 
        description: "Please specify the custom industry",
        variant: "destructive"
      });
      return;
    }

    const newClient: Client = {
      id: `client_${Date.now()}`,
      companyName: formData.companyName,
      registrationNumber: formData.registrationNumber,
      addresses: formData.addresses.map((addr, index) => ({
        id: `addr_${Date.now()}_${index}`,
        type: addr.type,
        address: addr.address,
        isMain: index === 0
      })),
      country: formData.country as "Singapore" | "Malaysia",
      industry: (formData.industry === "Others" ? formData.customIndustry : formData.industry) as any,
      customIndustry: formData.industry === "Others" ? formData.customIndustry : undefined,
      numberOfProjects: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onAdd(newClient);

    // Create POC if data is provided
    if (pocData.name && pocData.salesPIC && pocData.phoneNumber && pocData.email) {
      const newPOC: ClientPOC = {
        id: `poc_${Date.now()}`,
        clientId: newClient.id,
        contactName: pocData.name,
        contactNumber: pocData.phoneNumber,
        contactEmail: pocData.email,
        designation: "",
        salesPIC: pocData.salesPIC,
        projectStatus: pocData.status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      onAddClientPOC(newPOC);
    }

    toast({
      title: "Success",
      description: "Client added successfully"
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Add New Client</CardTitle>
              <CardDescription>Enter client company information</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyName">Company Name (as per ACRA) *</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="Enter company name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="registrationNumber">Registration Number</Label>
                <Input
                  id="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                  placeholder="Enter registration number"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Company Addresses *</Label>
                <Button type="button" variant="outline" size="sm" onClick={addAddress}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Other Address
                </Button>
              </div>
              <div className="space-y-3">
                {formData.addresses.map((address, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="flex-1">
                      <Textarea
                        value={address.address}
                        onChange={(e) => updateAddress(index, e.target.value)}
                        placeholder={index === 0 ? "Enter main company address" : "Enter other address"}
                        rows={2}
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-muted-foreground">
                        {index === 0 ? "Main Address" : "Other Address"}
                      </span>
                      {formData.addresses.length > 1 && index > 0 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeAddress(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="country">Country *</Label>
                <Select 
                  value={formData.country} 
                  onValueChange={(value) => setFormData({ ...formData, country: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Singapore">Singapore</SelectItem>
                    <SelectItem value="Malaysia">Malaysia</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="industry">Industry *</Label>
                <Select 
                  value={formData.industry} 
                  onValueChange={(value) => setFormData({ ...formData, industry: value, customIndustry: "" })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.industry === "Others" && (
              <div>
                <Label htmlFor="customIndustry">Custom Industry *</Label>
                <Input
                  id="customIndustry"
                  value={formData.customIndustry}
                  onChange={(e) => setFormData({ ...formData, customIndustry: e.target.value })}
                  placeholder="Specify the industry type"
                  required
                />
              </div>
            )}

            {/* Client POC Section */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-lg font-semibold">Client POC (Optional)</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pocName">POC Name</Label>
                  {pocData.isNewName ? (
                    <div className="flex gap-2">
                      <Input
                        id="pocName"
                        value={pocData.name}
                        onChange={(e) => setPocData({ ...pocData, name: e.target.value })}
                        placeholder="Enter new POC name"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setPocData({ ...pocData, isNewName: false, name: "" })}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Select value={pocData.name} onValueChange={(value) => {
                      if (value === "add_new") {
                        setPocData({ ...pocData, isNewName: true, name: "", email: "" });
                      } else {
                        const existingPOC = existingPOCs.find(poc => poc.contactName === value && poc.salesPIC === pocData.salesPIC);
                        setPocData({ 
                          ...pocData, 
                          name: value,
                          email: existingPOC?.contactEmail || ""
                        });
                      }
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select existing POC or add new" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="add_new">Add New POC</SelectItem>
                        {pocData.salesPIC && existingPOCs
                          .filter(poc => poc.salesPIC === pocData.salesPIC)
                          .map(poc => (
                            <SelectItem key={poc.id} value={poc.contactName}>
                              {poc.contactName} ({poc.contactEmail})
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pocSalesPIC">Sales PIC</Label>
                  <Select value={pocData.salesPIC} onValueChange={(value) => setPocData({ ...pocData, salesPIC: value, name: "", email: "" })}>
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
                  <Label htmlFor="pocPhone">Phone Number</Label>
                  <Input
                    id="pocPhone"
                    value={pocData.phoneNumber}
                    onChange={(e) => setPocData({ ...pocData, phoneNumber: e.target.value })}
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pocEmail">Email</Label>
                  <Input
                    id="pocEmail"
                    type="email"
                    value={pocData.email}
                    onChange={(e) => setPocData({ ...pocData, email: e.target.value })}
                    placeholder="Enter email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pocStatus">Status</Label>
                  <Select value={pocData.status} onValueChange={(value: "Active" | "Inactive") => setPocData({ ...pocData, status: value })}>
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
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                Add Client
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}