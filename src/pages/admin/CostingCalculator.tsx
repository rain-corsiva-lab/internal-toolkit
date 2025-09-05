import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2 } from "lucide-react";
import { ProjectType } from "@/types/costing";
import { mockClients, mockClientPOCs, getSalesStaff } from "@/data/mockData";
import { getCostByDescription } from "@/data/costingData";
import AddClientForm from "@/components/admin/AddClientForm";
import AddClientPOCForm from "@/components/admin/AddClientPOCForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const CostingCalculator = () => {
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedSalesPIC, setSelectedSalesPIC] = useState("");
  const [selectedClientPOC, setSelectedClientPOC] = useState("");
  const [selectedBillingAddress, setSelectedBillingAddress] = useState("");
  const [projectType, setProjectType] = useState<ProjectType | "">("");
  const [totalCost, setTotalCost] = useState(0);
  
  // Corporate Websites fields
  const [uniquePages, setUniquePages] = useState(0);
  const [repetitivePages, setRepetitivePages] = useState(0);
  const [shortPages, setShortPages] = useState(0);
  const [addOns, setAddOns] = useState<any[]>([]);
  const [thirdPartyCosts, setThirdPartyCosts] = useState<any[]>([]);
  const [maintenanceItems, setMaintenanceItems] = useState<any[]>([]);
  
  // Digital Marketing / Graphic Designs fields
  const [descriptionItems, setDescriptionItems] = useState<any[]>([]);
  
  // Custom Solutions fields
  const [modules, setModules] = useState<any[]>([]);
  const [apiIntegrations, setApiIntegrations] = useState<any[]>([]);

  const [addClientDialogOpen, setAddClientDialogOpen] = useState(false);
  const [addPOCDialogOpen, setAddPOCDialogOpen] = useState(false);

  const salesStaff = getSalesStaff();
  const availableClients = mockClients.filter(client => 
    selectedSalesPIC ? mockClientPOCs.some(poc => 
      poc.clientId === client.id && poc.salesPIC === selectedSalesPIC
    ) : true
  );
  const availablePOCs = mockClientPOCs.filter(poc => 
    poc.clientId === selectedCompany && poc.salesPIC === selectedSalesPIC
  );
  const selectedClient = mockClients.find(client => client.id === selectedCompany);

  // Calculate total cost in real-time
  useEffect(() => {
    let cost = 0;
    
    switch (projectType) {
      case "AI Chatbot Project":
        cost = getCostByDescription("AI Chatbot");
        break;
      case "PSG Project - Package A":
        cost = getCostByDescription("PSG Package A");
        break;
      case "PSG Project - Package B":
        cost = getCostByDescription("PSG Package B");
        break;
      case "PSG Project - Package C":
        cost = getCostByDescription("PSG Package C");
        break;
      case "Corporate Websites":
        cost += uniquePages * getCostByDescription("Unique Pages");
        cost += repetitivePages * getCostByDescription("Repetitive Pages");
        cost += shortPages * getCostByDescription("Short Pages");
        
        addOns.forEach(addon => {
          if (addon.type === "internal") {
            cost += (addon.designHours || 0) * getCostByDescription("Design");
            cost += (addon.programmingHours || 0) * getCostByDescription("Programming");
          } else {
            cost += addon.price || 0;
          }
        });
        
        thirdPartyCosts.forEach(thirdParty => {
          cost += thirdParty.cost || 0;
        });
        
        maintenanceItems.forEach(maintenance => {
          cost += (maintenance.manHours || 0) * getCostByDescription("Programming");
        });
        break;
      case "Digital Marketing Project":
      case "Graphic Designs Project":
        descriptionItems.forEach(item => {
          cost += (item.manHours || 0) * getCostByDescription("Design");
        });
        break;
      case "Custom Solutions Project":
        modules.forEach(module => {
          cost += (module.manHours || 0) * getCostByDescription("Programming");
        });
        
        addOns.forEach(addon => {
          if (addon.type === "internal") {
            cost += (addon.designHours || 0) * getCostByDescription("Design");
            cost += (addon.programmingHours || 0) * getCostByDescription("Programming");
          } else {
            cost += addon.price || 0;
          }
        });
        
        thirdPartyCosts.forEach(thirdParty => {
          cost += thirdParty.cost || 0;
        });
        
        apiIntegrations.forEach(api => {
          cost += (api.manHours || 0) * getCostByDescription("Programming");
        });
        
        maintenanceItems.forEach(maintenance => {
          cost += (maintenance.manHours || 0) * getCostByDescription("Programming");
        });
        break;
    }
    
    setTotalCost(cost);
  }, [projectType, uniquePages, repetitivePages, shortPages, addOns, thirdPartyCosts, maintenanceItems, descriptionItems, modules, apiIntegrations]);

  const addDescriptionItem = () => {
    setDescriptionItems([...descriptionItems, { id: Date.now(), description: "", manHours: 0 }]);
  };

  const addModule = () => {
    setModules([...modules, { id: Date.now(), module: "", manHours: 0 }]);
  };

  const addAddOn = () => {
    setAddOns([...addOns, { id: Date.now(), type: "internal", title: "", designHours: 0, programmingHours: 0 }]);
  };

  const addThirdPartyCost = () => {
    setThirdPartyCosts([...thirdPartyCosts, { id: Date.now(), vendor: "", cost: 0 }]);
  };

  const addMaintenanceItem = () => {
    setMaintenanceItems([...maintenanceItems, { id: Date.now(), description: "", manHours: 0 }]);
  };

  const addAPIIntegration = () => {
    setApiIntegrations([...apiIntegrations, { id: Date.now(), description: "", manHours: 0 }]);
  };

  const removeItem = (items: any[], setItems: Function, id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (items: any[], setItems: Function, id: number, field: string, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const renderProjectFields = () => {
    switch (projectType) {
      case "AI Chatbot Project":
      case "PSG Project - Package A":
      case "PSG Project - Package B":
      case "PSG Project - Package C":
      case "E-commerce Websites Project":
        return null; // No additional fields needed

      case "Digital Marketing Project":
      case "Graphic Designs Project":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Project Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {descriptionItems.map((item) => (
                <div key={item.id} className="flex gap-4 items-end">
                  <div className="flex-1">
                    <Label>Description</Label>
                    <Textarea
                      value={item.description}
                      onChange={(e) => updateItem(descriptionItems, setDescriptionItems, item.id, "description", e.target.value)}
                      placeholder="Enter description"
                    />
                  </div>
                  <div className="w-32">
                    <Label>Man Hours</Label>
                    <Input
                      type="number"
                      value={item.manHours}
                      onChange={(e) => updateItem(descriptionItems, setDescriptionItems, item.id, "manHours", Number(e.target.value))}
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeItem(descriptionItems, setDescriptionItems, item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button onClick={addDescriptionItem} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </CardContent>
          </Card>
        );

      case "Corporate Websites":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Page Requirements</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Number of Unique Pages</Label>
                  <Input
                    type="number"
                    value={uniquePages}
                    onChange={(e) => setUniquePages(Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Number of Repetitive Pages</Label>
                  <Input
                    type="number"
                    value={repetitivePages}
                    onChange={(e) => setRepetitivePages(Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Number of Short Pages</Label>
                  <Input
                    type="number"
                    value={shortPages}
                    onChange={(e) => setShortPages(Number(e.target.value))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Add-ons, Third Party Costs, and Maintenance sections */}
            {/* ... (similar pattern for other sections) ... */}
          </div>
        );

      case "Custom Solutions Project":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Modules</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {modules.map((module) => (
                  <div key={module.id} className="flex gap-4 items-end">
                    <div className="flex-1">
                      <Label>Module</Label>
                      <Input
                        value={module.module}
                        onChange={(e) => updateItem(modules, setModules, module.id, "module", e.target.value)}
                        placeholder="Enter module name"
                      />
                    </div>
                    <div className="w-32">
                      <Label>Man Hours</Label>
                      <Input
                        type="number"
                        value={module.manHours}
                        onChange={(e) => updateItem(modules, setModules, module.id, "manHours", Number(e.target.value))}
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeItem(modules, setModules, module.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button onClick={addModule} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Module
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Costing Calculator</h1>
        <p className="text-muted-foreground">Generate quotations for projects</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Sales PIC</Label>
              <Select value={selectedSalesPIC} onValueChange={setSelectedSalesPIC}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Sales PIC" />
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
              <Label>Company</Label>
              <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Company" />
                </SelectTrigger>
                <SelectContent>
                  {availableClients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.companyName}
                    </SelectItem>
                  ))}
                  <Dialog open={addClientDialogOpen} onOpenChange={setAddClientDialogOpen}>
                    <DialogTrigger asChild>
                      <SelectItem value="add_new_company">
                        + Add New Company
                      </SelectItem>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Company</DialogTitle>
                      </DialogHeader>
                      <AddClientForm 
                        onClose={() => setAddClientDialogOpen(false)}
                        onAdd={(client) => {
                          // In real app, would update client list
                          setAddClientDialogOpen(false);
                        }}
                        onAddClientPOC={(poc) => {
                          // In real app, would update POC list
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Client POC</Label>
              <Select value={selectedClientPOC} onValueChange={setSelectedClientPOC}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Client POC" />
                </SelectTrigger>
                <SelectContent>
                  {availablePOCs.map((poc) => (
                    <SelectItem key={poc.id} value={poc.id}>
                      {poc.contactName}
                    </SelectItem>
                  ))}
                  <Dialog open={addPOCDialogOpen} onOpenChange={setAddPOCDialogOpen}>
                    <DialogTrigger asChild>
                      <SelectItem value="add_new_poc">
                        + Add New Client POC
                      </SelectItem>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Client POC</DialogTitle>
                      </DialogHeader>
                      <AddClientPOCForm 
                        onClose={() => setAddPOCDialogOpen(false)}
                        onAdd={(poc) => {
                          // In real app, would update POC list
                          setAddPOCDialogOpen(false);
                        }}
                        preselectedClientId={selectedCompany}
                      />
                    </DialogContent>
                  </Dialog>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Billing Address</Label>
              <Select value={selectedBillingAddress} onValueChange={setSelectedBillingAddress}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Billing Address" />
                </SelectTrigger>
                <SelectContent>
                  {selectedClient?.addresses.map((address) => (
                    <SelectItem key={address.id} value={address.address}>
                      {address.address} {address.isMain && "(Main)"}
                    </SelectItem>
                  ))}
                  <SelectItem value="add_new_address">
                    + Add New Address
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Project Type</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={projectType} onValueChange={(value) => setProjectType(value as ProjectType)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Project Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AI Chatbot Project">AI Chatbot Project</SelectItem>
              <SelectItem value="PSG Project - Package A">PSG Project - Package A</SelectItem>
              <SelectItem value="PSG Project - Package B">PSG Project - Package B</SelectItem>
              <SelectItem value="PSG Project - Package C">PSG Project - Package C</SelectItem>
              <SelectItem value="E-commerce Websites Project">E-commerce Websites Project</SelectItem>
              <SelectItem value="Digital Marketing Project">Digital Marketing Project</SelectItem>
              <SelectItem value="Graphic Designs Project">Graphic Designs Project</SelectItem>
              <SelectItem value="Corporate Websites">Corporate Websites</SelectItem>
              <SelectItem value="Custom Solutions Project">Custom Solutions Project</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {renderProjectFields()}

      <Card>
        <CardHeader>
          <CardTitle>Total Cost</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary">
            ${totalCost.toLocaleString()}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>Generate Quotation</Button>
      </div>
    </div>
  );
};

export default CostingCalculator;