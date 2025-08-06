import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Download, Edit, Eye, Building2, Users } from "lucide-react";
import { mockClients, mockClientPOCs, getSalesStaff, getClientPOCsByClient } from "@/data/mockData";
import { Client, ClientPOC, ClientFilters, POCFilters } from "@/types/admin";

export default function ClientManagement() {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [clientPOCs, setClientPOCs] = useState<ClientPOC[]>(mockClientPOCs);
  const [clientFilters, setClientFilters] = useState<ClientFilters>({});
  const [pocFilters, setPOCFilters] = useState<POCFilters>({});
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedPOC, setSelectedPOC] = useState<ClientPOC | null>(null);

  const salesStaff = getSalesStaff();

  // Filter clients
  const filteredClients = clients.filter(client => {
    if (clientFilters.search) {
      const searchLower = clientFilters.search.toLowerCase();
      if (!client.companyName.toLowerCase().includes(searchLower) &&
          !client.registrationNumber.toLowerCase().includes(searchLower)) {
        return false;
      }
    }
    if (clientFilters.country && client.country !== clientFilters.country) return false;
    if (clientFilters.industry && client.industry !== clientFilters.industry) return false;
    return true;
  });

  // Filter POCs
  const filteredPOCs = clientPOCs.filter(poc => {
    if (pocFilters.search) {
      const searchLower = pocFilters.search.toLowerCase();
      if (!poc.contactName.toLowerCase().includes(searchLower) &&
          !poc.contactEmail.toLowerCase().includes(searchLower) &&
          !poc.contactNumber.includes(searchLower)) {
        return false;
      }
    }
    if (pocFilters.salesPIC && poc.salesPIC !== pocFilters.salesPIC) return false;
    if (pocFilters.projectStatus && poc.projectStatus !== pocFilters.projectStatus) return false;
    return true;
  });

  const handleExportClientsCSV = () => {
    const headers = ["Company Name", "Registration No.", "Company Main Address", "Country", "Industry", "Number of Projects"];
    const rows = filteredClients.map(client => [
      client.companyName,
      client.registrationNumber,
      client.addresses.find(addr => addr.isMain)?.address || "",
      client.country,
      client.industry,
      client.numberOfProjects.toString()
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "clients_list.csv";
    a.click();
  };

  const handleExportPOCsCSV = () => {
    const headers = ["Contact Name", "Contact Number", "Contact Email Address", "Contact Designation", "Sales PIC", "Project Status"];
    const rows = filteredPOCs.map(poc => {
      const salesPerson = salesStaff.find(staff => staff.id === poc.salesPIC);
      return [
        poc.contactName,
        poc.contactNumber,
        poc.contactEmail,
        poc.designation,
        salesPerson?.fullName || "",
        poc.projectStatus
      ];
    });
    
    const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "client_pocs_list.csv";
    a.click();
  };

  const getStatusBadge = (status: string) => {
    return status === "Confirmed" ? "default" : "secondary";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Client Management</h1>
          <p className="text-muted-foreground">
            Manage client companies and their points of contact
          </p>
        </div>
        <Button className="bg-admin-primary hover:bg-admin-primary-hover">
          <Plus className="h-4 w-4 mr-2" />
          Add New Client
        </Button>
      </div>

      <Tabs defaultValue="companies" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="companies">Companies</TabsTrigger>
          <TabsTrigger value="contacts">Client POCs</TabsTrigger>
        </TabsList>

        <TabsContent value="companies" className="space-y-6">
          {/* Company Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Search & Filter Companies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by company name, reg no..."
                    value={clientFilters.search || ""}
                    onChange={(e) => setClientFilters({ ...clientFilters, search: e.target.value })}
                    className="pl-9"
                  />
                </div>
                
                <Select value={clientFilters.country || ""} onValueChange={(value) => setClientFilters({ ...clientFilters, country: value || undefined })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by Country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Countries</SelectItem>
                    <SelectItem value="Singapore">Singapore</SelectItem>
                    <SelectItem value="Malaysia">Malaysia</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={clientFilters.industry || ""} onValueChange={(value) => setClientFilters({ ...clientFilters, industry: value || undefined })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by Industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Industries</SelectItem>
                    <SelectItem value="Retail">Retail</SelectItem>
                    <SelectItem value="F&B">F&B</SelectItem>
                    <SelectItem value="Professional Services">Professional Services</SelectItem>
                    <SelectItem value="Manufacturing, Engineering and Technology">Manufacturing, Engineering and Technology</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" onClick={handleExportClientsCSV} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Companies List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Companies ({filteredClients.length})
              </CardTitle>
              <CardDescription>
                Manage client companies and their information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company Name</TableHead>
                      <TableHead>Registration No.</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Industry</TableHead>
                      <TableHead>Projects</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClients.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell className="font-medium">{client.companyName}</TableCell>
                        <TableCell>{client.registrationNumber}</TableCell>
                        <TableCell>{client.country}</TableCell>
                        <TableCell>{client.industry}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{client.numberOfProjects}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedClient(client)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contacts" className="space-y-6">
          {/* POC Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Search & Filter Client POCs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, phone..."
                    value={pocFilters.search || ""}
                    onChange={(e) => setPOCFilters({ ...pocFilters, search: e.target.value })}
                    className="pl-9"
                  />
                </div>
                
                <Select value={pocFilters.salesPIC || ""} onValueChange={(value) => setPOCFilters({ ...pocFilters, salesPIC: value || undefined })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by Sales PIC" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Sales PICs</SelectItem>
                    {salesStaff.map(staff => (
                      <SelectItem key={staff.id} value={staff.id}>{staff.fullName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={pocFilters.projectStatus || ""} onValueChange={(value) => setPOCFilters({ ...pocFilters, projectStatus: value || undefined })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Statuses</SelectItem>
                    <SelectItem value="Quoted">Quoted</SelectItem>
                    <SelectItem value="Confirmed">Confirmed</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" onClick={handleExportPOCsCSV} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* POCs List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Client Points of Contact ({filteredPOCs.length})
              </CardTitle>
              <CardDescription>
                Manage client points of contact across all companies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Contact Name</TableHead>
                      <TableHead>Contact Number</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Designation</TableHead>
                      <TableHead>Sales PIC</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPOCs.map((poc) => {
                      const salesPerson = salesStaff.find(staff => staff.id === poc.salesPIC);
                      return (
                        <TableRow key={poc.id}>
                          <TableCell className="font-medium">{poc.contactName}</TableCell>
                          <TableCell>{poc.contactNumber}</TableCell>
                          <TableCell>{poc.contactEmail}</TableCell>
                          <TableCell>{poc.designation}</TableCell>
                          <TableCell>{salesPerson?.fullName || "Unknown"}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadge(poc.projectStatus)}>
                              {poc.projectStatus}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedPOC(poc)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Client Detail Modal */}
      {selectedClient && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Company Details - {selectedClient.companyName}</CardTitle>
              <CardDescription>Complete company information and client POCs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Company Name (As per ACRA)</label>
                  <p className="text-sm text-muted-foreground">{selectedClient.companyName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Registration Number</label>
                  <p className="text-sm text-muted-foreground">{selectedClient.registrationNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Country</label>
                  <p className="text-sm text-muted-foreground">{selectedClient.country}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Industry</label>
                  <p className="text-sm text-muted-foreground">{selectedClient.industry}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Number of Projects</label>
                  <p className="text-sm text-muted-foreground">{selectedClient.numberOfProjects}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Company Addresses</label>
                <div className="mt-2 space-y-2">
                  {selectedClient.addresses.map(address => (
                    <div key={address.id} className="p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={address.isMain ? "default" : "secondary"}>
                          {address.type}
                        </Badge>
                        {address.isMain && <Badge variant="outline">Main</Badge>}
                      </div>
                      <p className="text-sm">{address.address}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Client POCs</label>
                <div className="mt-2">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Designation</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getClientPOCsByClient(selectedClient.id).map(poc => (
                        <TableRow key={poc.id}>
                          <TableCell>{poc.contactName}</TableCell>
                          <TableCell>{poc.contactEmail}</TableCell>
                          <TableCell>{poc.designation}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadge(poc.projectStatus)}>
                              {poc.projectStatus}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setSelectedClient(null)}>
                  Close
                </Button>
                <Button>Edit Company</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* POC Detail Modal */}
      {selectedPOC && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Client POC Details - {selectedPOC.contactName}</CardTitle>
              <CardDescription>Complete contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Contact Name</label>
                  <p className="text-sm text-muted-foreground">{selectedPOC.contactName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Contact Number</label>
                  <p className="text-sm text-muted-foreground">{selectedPOC.contactNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Contact Email</label>
                  <p className="text-sm text-muted-foreground">{selectedPOC.contactEmail}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Designation</label>
                  <p className="text-sm text-muted-foreground">{selectedPOC.designation}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Sales PIC</label>
                  <p className="text-sm text-muted-foreground">
                    {salesStaff.find(staff => staff.id === selectedPOC.salesPIC)?.fullName || "Unknown"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Project Status</label>
                  <Badge variant={getStatusBadge(selectedPOC.projectStatus)}>
                    {selectedPOC.projectStatus}
                  </Badge>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setSelectedPOC(null)}>
                  Close
                </Button>
                <Button>Edit Contact</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}