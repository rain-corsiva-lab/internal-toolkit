import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus, Trash2 } from "lucide-react";
import { Client, ClientAddress } from "@/types/admin";
import { useToast } from "@/hooks/use-toast";

interface EditClientFormProps {
  client: Client;
  onClose: () => void;
  onSave: (client: Client) => void;
}

export default function EditClientForm({ client, onClose, onSave }: EditClientFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    companyName: client.companyName,
    registrationNumber: client.registrationNumber,
    addresses: client.addresses.map(addr => ({ ...addr })),
    country: client.country,
    industry: client.industry,
    customIndustry: client.customIndustry || ""
  });

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
      addresses: [...formData.addresses, { 
        id: `addr_${Date.now()}`,
        address: "", 
        type: "Other",
        isMain: false
      }]
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

  const updateAddressType = (index: number, type: "Main" | "Other") => {
    const newAddresses = [...formData.addresses];
    newAddresses[index].type = type;
    newAddresses[index].isMain = type === "Main";
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

    const updatedClient: Client = {
      ...client,
      companyName: formData.companyName,
      registrationNumber: formData.registrationNumber,
      addresses: formData.addresses,
      country: formData.country,
      industry: (formData.industry === "Others" ? formData.customIndustry : formData.industry) as any,
      customIndustry: formData.industry === "Others" ? formData.customIndustry : undefined,
      updatedAt: new Date().toISOString()
    };

    onSave(updatedClient);
    toast({
      title: "Success",
      description: "Client updated successfully"
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Edit Client</CardTitle>
              <CardDescription>Update client company information</CardDescription>
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
                  Add Address
                </Button>
              </div>
               <div className="space-y-3">
                 {formData.addresses.map((address, index) => (
                   <div key={address.id} className="space-y-2">
                     <div className="flex gap-2">
                       <div className="flex-1">
                         <Textarea
                           value={address.address}
                           onChange={(e) => updateAddress(index, e.target.value)}
                           placeholder="Enter address"
                           rows={2}
                           required
                         />
                       </div>
                       {formData.addresses.length > 1 && (
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
                  onValueChange={(value) => setFormData({ ...formData, country: value as "Singapore" | "Malaysia" })}
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
                  onValueChange={(value) => setFormData({ ...formData, industry: value as any, customIndustry: "" })}
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