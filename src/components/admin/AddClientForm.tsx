import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

interface AddClientFormProps {
  onClientAdded?: () => void;
}

export function AddClientForm({ onClientAdded }: AddClientFormProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    registrationNumber: "",
    address: "",
    country: "Singapore",
    industry: "",
    customIndustry: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.companyName || !formData.registrationNumber || !formData.address) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (formData.industry === "Others" && !formData.customIndustry) {
      toast({
        title: "Error", 
        description: "Please specify the custom industry.",
        variant: "destructive",
      });
      return;
    }

    // In real app, this would call an API to create the client
    toast({
      title: "Client Added",
      description: `${formData.companyName} has been successfully added.`,
    });

    // Reset form and close dialog
    setFormData({
      companyName: "",
      registrationNumber: "",
      address: "",
      country: "Singapore",
      industry: "",
      customIndustry: ""
    });
    setOpen(false);
    onClientAdded?.();
  };

  const handleCancel = () => {
    setFormData({
      companyName: "",
      registrationNumber: "",
      address: "",
      country: "Singapore", 
      industry: "",
      customIndustry: ""
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Client
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
          <DialogDescription>
            Enter the client information to add them to the system.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name (as per ACRA) *</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="Enter company name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="registrationNumber">Registration Number *</Label>
              <Input
                id="registrationNumber"
                value={formData.registrationNumber}
                onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                placeholder="Enter unique registration number"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Company Address *</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Enter complete company address"
              required
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
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
            
            <div className="space-y-2">
              <Label htmlFor="industry">Industry *</Label>
              <Select 
                value={formData.industry} 
                onValueChange={(value) => {
                  setFormData({ ...formData, industry: value, customIndustry: value === "Others" ? formData.customIndustry : "" });
                }}
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
            <div className="space-y-2">
              <Label htmlFor="customIndustry">Specify Industry *</Label>
              <Input
                id="customIndustry"
                value={formData.customIndustry}
                onChange={(e) => setFormData({ ...formData, customIndustry: e.target.value })}
                placeholder="Enter custom industry"
                required
              />
            </div>
          )}
          
          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit">
              Add Client
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}