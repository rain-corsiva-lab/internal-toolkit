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
  const [projectName, setProjectName] = useState("");
  const [projectType, setProjectType] = useState<ProjectType | "">("");
  const [totalCost, setTotalCost] = useState(0);
  const [costBreakdown, setCostBreakdown] = useState<{description: string; cost: number}[]>([]);
  
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
  const currency = selectedClient?.country === "Malaysia" ? "MYR" : "SGD";

  // Calculate total cost in real-time
  useEffect(() => {
    let cost = 0;
    const breakdown: {description: string; cost: number}[] = [];
    
    switch (projectType) {
      case "AI Chatbot Project":
        const chatbotCost = getCostByDescription("AI Chatbot", currency);
        cost = chatbotCost;
        breakdown.push({description: "AI Chatbot", cost: chatbotCost});
        break;
      case "PSG Project - Package A":
        const packageACost = getCostByDescription("PSG Package A", currency);
        cost = packageACost;
        breakdown.push({description: "PSG Package A", cost: packageACost});
        break;
      case "PSG Project - Package B":
        const packageBCost = getCostByDescription("PSG Package B", currency);
        cost = packageBCost;
        breakdown.push({description: "PSG Package B", cost: packageBCost});
        break;
      case "PSG Project - Package C":
        const packageCCost = getCostByDescription("PSG Package C", currency);
        cost = packageCCost;
        breakdown.push({description: "PSG Package C", cost: packageCCost});
        break;
      case "E-commerce Websites Project":
        // Fixed cost for e-commerce - using PSG Package B cost as baseline
        const ecommerceCost = getCostByDescription("PSG Package B", currency);
        cost = ecommerceCost;
        breakdown.push({description: "E-commerce Website", cost: ecommerceCost});
        break;
      case "Corporate Websites":
        const uniquePagesCost = uniquePages * getCostByDescription("Unique Pages", currency);
        const repetitivePagesCost = repetitivePages * getCostByDescription("Repetitive Pages", currency);
        const shortPagesCost = shortPages * getCostByDescription("Short Pages", currency);
        
        if (uniquePagesCost > 0) breakdown.push({description: `Unique Pages (${uniquePages})`, cost: uniquePagesCost});
        if (repetitivePagesCost > 0) breakdown.push({description: `Repetitive Pages (${repetitivePages})`, cost: repetitivePagesCost});
        if (shortPagesCost > 0) breakdown.push({description: `Short Pages (${shortPages})`, cost: shortPagesCost});
        
        cost += uniquePagesCost + repetitivePagesCost + shortPagesCost;
        
        addOns.forEach(addon => {
          if (addon.type === "internal") {
            const designCost = (addon.designHours || 0) * getCostByDescription("Design", currency);
            const programmingCost = (addon.programmingHours || 0) * getCostByDescription("Programming", currency);
            const addonTotal = designCost + programmingCost;
            if (addonTotal > 0) breakdown.push({description: `Add-on: ${addon.title}`, cost: addonTotal});
            cost += addonTotal;
          } else {
            const addonCost = addon.price || 0;
            if (addonCost > 0) breakdown.push({description: `Add-on: ${addon.title}`, cost: addonCost});
            cost += addonCost;
          }
        });
        
        thirdPartyCosts.forEach(thirdParty => {
          const thirdPartyCost = thirdParty.cost || 0;
          if (thirdPartyCost > 0) breakdown.push({description: `3rd Party: ${thirdParty.vendor}`, cost: thirdPartyCost});
          cost += thirdPartyCost;
        });
        
        maintenanceItems.forEach(maintenance => {
          const maintenanceCost = (maintenance.manHours || 0) * getCostByDescription("Programming", currency);
          if (maintenanceCost > 0) breakdown.push({description: `Maintenance: ${maintenance.description}`, cost: maintenanceCost});
          cost += maintenanceCost;
        });
        break;
      case "Digital Marketing Project":
      case "Graphic Designs Project":
        descriptionItems.forEach(item => {
          const itemCost = (item.manHours || 0) * getCostByDescription("Design", currency);
          if (itemCost > 0) breakdown.push({description: item.description || "Service", cost: itemCost});
          cost += itemCost;
        });
        break;
      case "Custom Solutions Project":
        modules.forEach(module => {
          const moduleCost = (module.manHours || 0) * getCostByDescription("Programming", currency);
          if (moduleCost > 0) breakdown.push({description: `Module: ${module.module}`, cost: moduleCost});
          cost += moduleCost;
        });
        
        addOns.forEach(addon => {
          if (addon.type === "internal") {
            const designCost = (addon.designHours || 0) * getCostByDescription("Design", currency);
            const programmingCost = (addon.programmingHours || 0) * getCostByDescription("Programming", currency);
            const addonTotal = designCost + programmingCost;
            if (addonTotal > 0) breakdown.push({description: `Add-on: ${addon.title}`, cost: addonTotal});
            cost += addonTotal;
          } else {
            const addonCost = addon.price || 0;
            if (addonCost > 0) breakdown.push({description: `Add-on: ${addon.title}`, cost: addonCost});
            cost += addonCost;
          }
        });
        
        thirdPartyCosts.forEach(thirdParty => {
          const thirdPartyCost = thirdParty.cost || 0;
          if (thirdPartyCost > 0) breakdown.push({description: `3rd Party: ${thirdParty.vendor}`, cost: thirdPartyCost});
          cost += thirdPartyCost;
        });
        
        apiIntegrations.forEach(api => {
          const apiCost = (api.manHours || 0) * getCostByDescription("Programming", currency);
          if (apiCost > 0) breakdown.push({description: `API: ${api.description}`, cost: apiCost});
          cost += apiCost;
        });
        
        maintenanceItems.forEach(maintenance => {
          const maintenanceCost = (maintenance.manHours || 0) * getCostByDescription("Programming", currency);
          if (maintenanceCost > 0) breakdown.push({description: `Maintenance: ${maintenance.description}`, cost: maintenanceCost});
          cost += maintenanceCost;
        });
        break;
    }
    
    setTotalCost(cost);
    setCostBreakdown(breakdown);
  }, [projectType, uniquePages, repetitivePages, shortPages, addOns, thirdPartyCosts, maintenanceItems, descriptionItems, modules, apiIntegrations, currency]);

  const renderProjectFields = () => {
    if (!projectType) return null;

    switch (projectType) {
      case "AI Chatbot Project":
      case "PSG Project - Package A":
      case "PSG Project - Package B": 
      case "PSG Project - Package C":
      case "E-commerce Websites Project":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This project type has fixed pricing. No additional configuration required.
              </p>
            </CardContent>
          </Card>
        );

      case "Digital Marketing Project":
      case "Graphic Designs Project":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Service Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {descriptionItems.map((item, index) => (
                  <div key={index} className="flex gap-4 items-end">
                    <div className="flex-1">
                      <Label>Description</Label>
                      <Input 
                        value={item.description || ""}
                        onChange={(e) => {
                          const newItems = [...descriptionItems];
                          newItems[index] = { ...item, description: e.target.value };
                          setDescriptionItems(newItems);
                        }}
                        placeholder="Service description" 
                      />
                    </div>
                    <div className="w-32">
                      <Label>Man Hours</Label>
                      <Input 
                        type="number"
                        value={item.manHours || 0}
                        onChange={(e) => {
                          const newItems = [...descriptionItems];
                          newItems[index] = { ...item, manHours: Number(e.target.value) };
                          setDescriptionItems(newItems);
                        }}
                        placeholder="0" 
                      />
                    </div>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => {
                        const newItems = descriptionItems.filter((_, i) => i !== index);
                        setDescriptionItems(newItems);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  onClick={() => setDescriptionItems([...descriptionItems, { description: "", manHours: 0 }])}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Service
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case "Corporate Websites":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Page Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Unique Pages</Label>
                    <Input 
                      type="number" 
                      value={uniquePages}
                      onChange={(e) => setUniquePages(Number(e.target.value))}
                      placeholder="0" 
                    />
                  </div>
                  <div>
                    <Label>Repetitive Pages</Label>
                    <Input 
                      type="number" 
                      value={repetitivePages}
                      onChange={(e) => setRepetitivePages(Number(e.target.value))}
                      placeholder="0" 
                    />
                  </div>
                  <div>
                    <Label>Short Pages</Label>
                    <Input 
                      type="number" 
                      value={shortPages}
                      onChange={(e) => setShortPages(Number(e.target.value))}
                      placeholder="0" 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Add-ons</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {addOns.map((addon, index) => (
                    <div key={index} className="border p-4 rounded-lg space-y-4">
                      <div className="flex gap-4 items-end">
                        <div className="flex-1">
                          <Label>Title</Label>
                          <Input 
                            value={addon.title || ""}
                            onChange={(e) => {
                              const newAddOns = [...addOns];
                              newAddOns[index] = { ...addon, title: e.target.value };
                              setAddOns(newAddOns);
                            }}
                            placeholder="Add-on title" 
                          />
                        </div>
                        <div className="w-32">
                          <Label>Type</Label>
                          <Select 
                            value={addon.type || ""} 
                            onValueChange={(value) => {
                              const newAddOns = [...addOns];
                              newAddOns[index] = { ...addon, type: value };
                              setAddOns(newAddOns);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="internal">Internal</SelectItem>
                              <SelectItem value="external">External</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => {
                            const newAddOns = addOns.filter((_, i) => i !== index);
                            setAddOns(newAddOns);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {addon.type === "external" && (
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label>Price</Label>
                            <Input 
                              type="number"
                              value={addon.price || 0}
                              onChange={(e) => {
                                const newAddOns = [...addOns];
                                newAddOns[index] = { ...addon, price: Number(e.target.value) };
                                setAddOns(newAddOns);
                              }}
                              placeholder="0" 
                            />
                          </div>
                          <div>
                            <Label>Vendor Name</Label>
                            <Input 
                              value={addon.vendorName || ""}
                              onChange={(e) => {
                                const newAddOns = [...addOns];
                                newAddOns[index] = { ...addon, vendorName: e.target.value };
                                setAddOns(newAddOns);
                              }}
                              placeholder="Vendor name" 
                            />
                          </div>
                          <div>
                            <Label>Vendor Cost</Label>
                            <Input 
                              type="number"
                              value={addon.vendorCost || 0}
                              onChange={(e) => {
                                const newAddOns = [...addOns];
                                newAddOns[index] = { ...addon, vendorCost: Number(e.target.value) };
                                setAddOns(newAddOns);
                              }}
                              placeholder="0" 
                            />
                          </div>
                        </div>
                      )}
                      
                      {addon.type === "internal" && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Design Hours</Label>
                            <Input 
                              type="number"
                              value={addon.designHours || 0}
                              onChange={(e) => {
                                const newAddOns = [...addOns];
                                newAddOns[index] = { ...addon, designHours: Number(e.target.value) };
                                setAddOns(newAddOns);
                              }}
                              placeholder="0" 
                            />
                          </div>
                          <div>
                            <Label>Programming Hours</Label>
                            <Input 
                              type="number"
                              value={addon.programmingHours || 0}
                              onChange={(e) => {
                                const newAddOns = [...addOns];
                                newAddOns[index] = { ...addon, programmingHours: Number(e.target.value) };
                                setAddOns(newAddOns);
                              }}
                              placeholder="0" 
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    onClick={() => setAddOns([...addOns, { title: "", type: "" }])}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Add-on
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Third Party Costs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {thirdPartyCosts.map((thirdParty, index) => (
                    <div key={index} className="flex gap-4 items-end">
                      <div className="flex-1">
                        <Label>Vendor</Label>
                        <Input 
                          value={thirdParty.vendor || ""}
                          onChange={(e) => {
                            const newThirdParty = [...thirdPartyCosts];
                            newThirdParty[index] = { ...thirdParty, vendor: e.target.value };
                            setThirdPartyCosts(newThirdParty);
                          }}
                          placeholder="Vendor name" 
                        />
                      </div>
                      <div className="w-32">
                        <Label>Cost</Label>
                        <Input 
                          type="number"
                          value={thirdParty.cost || 0}
                          onChange={(e) => {
                            const newThirdParty = [...thirdPartyCosts];
                            newThirdParty[index] = { ...thirdParty, cost: Number(e.target.value) };
                            setThirdPartyCosts(newThirdParty);
                          }}
                          placeholder="0" 
                        />
                      </div>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => {
                          const newThirdParty = thirdPartyCosts.filter((_, i) => i !== index);
                          setThirdPartyCosts(newThirdParty);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    onClick={() => setThirdPartyCosts([...thirdPartyCosts, { vendor: "", cost: 0 }])}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Third Party Cost
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Maintenance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {maintenanceItems.map((maintenance, index) => (
                    <div key={index} className="flex gap-4 items-end">
                      <div className="flex-1">
                        <Label>Description</Label>
                        <Input 
                          value={maintenance.description || ""}
                          onChange={(e) => {
                            const newMaintenance = [...maintenanceItems];
                            newMaintenance[index] = { ...maintenance, description: e.target.value };
                            setMaintenanceItems(newMaintenance);
                          }}
                          placeholder="Maintenance description" 
                        />
                      </div>
                      <div className="w-32">
                        <Label>Man Hours</Label>
                        <Input 
                          type="number"
                          value={maintenance.manHours || 0}
                          onChange={(e) => {
                            const newMaintenance = [...maintenanceItems];
                            newMaintenance[index] = { ...maintenance, manHours: Number(e.target.value) };
                            setMaintenanceItems(newMaintenance);
                          }}
                          placeholder="0" 
                        />
                      </div>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => {
                          const newMaintenance = maintenanceItems.filter((_, i) => i !== index);
                          setMaintenanceItems(newMaintenance);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    onClick={() => setMaintenanceItems([...maintenanceItems, { description: "", manHours: 0 }])}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Maintenance Item
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "Custom Solutions Project":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Modules</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {modules.map((module, index) => (
                    <div key={index} className="flex gap-4 items-end">
                      <div className="flex-1">
                        <Label>Module</Label>
                        <Input 
                          value={module.module || ""}
                          onChange={(e) => {
                            const newModules = [...modules];
                            newModules[index] = { ...module, module: e.target.value };
                            setModules(newModules);
                          }}
                          placeholder="Module name" 
                        />
                      </div>
                      <div className="w-32">
                        <Label>Man Hours</Label>
                        <Input 
                          type="number"
                          value={module.manHours || 0}
                          onChange={(e) => {
                            const newModules = [...modules];
                            newModules[index] = { ...module, manHours: Number(e.target.value) };
                            setModules(newModules);
                          }}
                          placeholder="0" 
                        />
                      </div>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => {
                          const newModules = modules.filter((_, i) => i !== index);
                          setModules(newModules);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    onClick={() => setModules([...modules, { module: "", manHours: 0 }])}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Module
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Reuse Add-ons component from Corporate Websites */}
            <Card>
              <CardHeader>
                <CardTitle>Add-ons</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {addOns.map((addon, index) => (
                    <div key={index} className="border p-4 rounded-lg space-y-4">
                      <div className="flex gap-4 items-end">
                        <div className="flex-1">
                          <Label>Title</Label>
                          <Input 
                            value={addon.title || ""}
                            onChange={(e) => {
                              const newAddOns = [...addOns];
                              newAddOns[index] = { ...addon, title: e.target.value };
                              setAddOns(newAddOns);
                            }}
                            placeholder="Add-on title" 
                          />
                        </div>
                        <div className="w-32">
                          <Label>Type</Label>
                          <Select 
                            value={addon.type || ""} 
                            onValueChange={(value) => {
                              const newAddOns = [...addOns];
                              newAddOns[index] = { ...addon, type: value };
                              setAddOns(newAddOns);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="internal">Internal</SelectItem>
                              <SelectItem value="external">External</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => {
                            const newAddOns = addOns.filter((_, i) => i !== index);
                            setAddOns(newAddOns);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {addon.type === "external" && (
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label>Price</Label>
                            <Input 
                              type="number"
                              value={addon.price || 0}
                              onChange={(e) => {
                                const newAddOns = [...addOns];
                                newAddOns[index] = { ...addon, price: Number(e.target.value) };
                                setAddOns(newAddOns);
                              }}
                              placeholder="0" 
                            />
                          </div>
                          <div>
                            <Label>Vendor Name</Label>
                            <Input 
                              value={addon.vendorName || ""}
                              onChange={(e) => {
                                const newAddOns = [...addOns];
                                newAddOns[index] = { ...addon, vendorName: e.target.value };
                                setAddOns(newAddOns);
                              }}
                              placeholder="Vendor name" 
                            />
                          </div>
                          <div>
                            <Label>Vendor Cost</Label>
                            <Input 
                              type="number"
                              value={addon.vendorCost || 0}
                              onChange={(e) => {
                                const newAddOns = [...addOns];
                                newAddOns[index] = { ...addon, vendorCost: Number(e.target.value) };
                                setAddOns(newAddOns);
                              }}
                              placeholder="0" 
                            />
                          </div>
                        </div>
                      )}
                      
                      {addon.type === "internal" && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Design Hours</Label>
                            <Input 
                              type="number"
                              value={addon.designHours || 0}
                              onChange={(e) => {
                                const newAddOns = [...addOns];
                                newAddOns[index] = { ...addon, designHours: Number(e.target.value) };
                                setAddOns(newAddOns);
                              }}
                              placeholder="0" 
                            />
                          </div>
                          <div>
                            <Label>Programming Hours</Label>
                            <Input 
                              type="number"
                              value={addon.programmingHours || 0}
                              onChange={(e) => {
                                const newAddOns = [...addOns];
                                newAddOns[index] = { ...addon, programmingHours: Number(e.target.value) };
                                setAddOns(newAddOns);
                              }}
                              placeholder="0" 
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    onClick={() => setAddOns([...addOns, { title: "", type: "" }])}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Add-on
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Reuse Third Party Costs from Corporate Websites */}
            <Card>
              <CardHeader>
                <CardTitle>Third Party Costs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {thirdPartyCosts.map((thirdParty, index) => (
                    <div key={index} className="flex gap-4 items-end">
                      <div className="flex-1">
                        <Label>Vendor</Label>
                        <Input 
                          value={thirdParty.vendor || ""}
                          onChange={(e) => {
                            const newThirdParty = [...thirdPartyCosts];
                            newThirdParty[index] = { ...thirdParty, vendor: e.target.value };
                            setThirdPartyCosts(newThirdParty);
                          }}
                          placeholder="Vendor name" 
                        />
                      </div>
                      <div className="w-32">
                        <Label>Cost</Label>
                        <Input 
                          type="number"
                          value={thirdParty.cost || 0}
                          onChange={(e) => {
                            const newThirdParty = [...thirdPartyCosts];
                            newThirdParty[index] = { ...thirdParty, cost: Number(e.target.value) };
                            setThirdPartyCosts(newThirdParty);
                          }}
                          placeholder="0" 
                        />
                      </div>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => {
                          const newThirdParty = thirdPartyCosts.filter((_, i) => i !== index);
                          setThirdPartyCosts(newThirdParty);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    onClick={() => setThirdPartyCosts([...thirdPartyCosts, { vendor: "", cost: 0 }])}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Third Party Cost
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>API Integrations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {apiIntegrations.map((api, index) => (
                    <div key={index} className="flex gap-4 items-end">
                      <div className="flex-1">
                        <Label>Description</Label>
                        <Input 
                          value={api.description || ""}
                          onChange={(e) => {
                            const newApis = [...apiIntegrations];
                            newApis[index] = { ...api, description: e.target.value };
                            setApiIntegrations(newApis);
                          }}
                          placeholder="API integration description" 
                        />
                      </div>
                      <div className="w-32">
                        <Label>Man Hours</Label>
                        <Input 
                          type="number"
                          value={api.manHours || 0}
                          onChange={(e) => {
                            const newApis = [...apiIntegrations];
                            newApis[index] = { ...api, manHours: Number(e.target.value) };
                            setApiIntegrations(newApis);
                          }}
                          placeholder="0" 
                        />
                      </div>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => {
                          const newApis = apiIntegrations.filter((_, i) => i !== index);
                          setApiIntegrations(newApis);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    onClick={() => setApiIntegrations([...apiIntegrations, { description: "", manHours: 0 }])}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add API Integration
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Reuse Maintenance from Corporate Websites */}
            <Card>
              <CardHeader>
                <CardTitle>Maintenance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {maintenanceItems.map((maintenance, index) => (
                    <div key={index} className="flex gap-4 items-end">
                      <div className="flex-1">
                        <Label>Description</Label>
                        <Input 
                          value={maintenance.description || ""}
                          onChange={(e) => {
                            const newMaintenance = [...maintenanceItems];
                            newMaintenance[index] = { ...maintenance, description: e.target.value };
                            setMaintenanceItems(newMaintenance);
                          }}
                          placeholder="Maintenance description" 
                        />
                      </div>
                      <div className="w-32">
                        <Label>Man Hours</Label>
                        <Input 
                          type="number"
                          value={maintenance.manHours || 0}
                          onChange={(e) => {
                            const newMaintenance = [...maintenanceItems];
                            newMaintenance[index] = { ...maintenance, manHours: Number(e.target.value) };
                            setMaintenanceItems(newMaintenance);
                          }}
                          placeholder="0" 
                        />
                      </div>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => {
                          const newMaintenance = maintenanceItems.filter((_, i) => i !== index);
                          setMaintenanceItems(newMaintenance);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    onClick={() => setMaintenanceItems([...maintenanceItems, { description: "", manHours: 0 }])}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Maintenance Item
                  </Button>
                </div>
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
        <p className="text-muted-foreground">
          Generate quotations for client projects
        </p>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
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
                  <SelectItem value="create-company">
                    <Dialog open={addClientDialogOpen} onOpenChange={setAddClientDialogOpen}>
                      <DialogTrigger asChild>
                        <span>Create Company</span>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle>Add New Company</DialogTitle>
                        </DialogHeader>
                        <AddClientForm 
                          onClose={() => setAddClientDialogOpen(false)}
                          onAdd={() => {}}
                          onAddClientPOC={() => {}}
                        />
                      </DialogContent>
                    </Dialog>
                  </SelectItem>
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
                      {poc.contactName} - {poc.contactEmail}
                    </SelectItem>
                  ))}
                  <SelectItem value="create-poc">
                    <Dialog open={addPOCDialogOpen} onOpenChange={setAddPOCDialogOpen}>
                      <DialogTrigger asChild>
                        <span>Create Client POC</span>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle>Add New Client POC</DialogTitle>
                        </DialogHeader>
                        <AddClientPOCForm 
                          onClose={() => setAddPOCDialogOpen(false)}
                          onAdd={(newPOC) => {
                            setAddPOCDialogOpen(false);
                            setSelectedClientPOC(newPOC.id);
                          }}
                          preselectedClientId={selectedCompany}
                        />
                      </DialogContent>
                    </Dialog>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Project Name</Label>
              <Input 
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter project name" 
              />
            </div>

            <div>
              <Label>Project Type</Label>
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
            </div>
          </div>
        </CardContent>
      </Card>

      {renderProjectFields()}

      {/* Quotation Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Quotation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-2xl font-bold">
              Total: {currency} ${totalCost.toLocaleString()}
            </div>
            
            {costBreakdown.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Cost Breakdown:</h4>
                {costBreakdown.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.description}</span>
                    <span>{currency} ${item.cost.toLocaleString()}</span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{currency} ${totalCost.toLocaleString()}</span>
                </div>
              </div>
            )}
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
