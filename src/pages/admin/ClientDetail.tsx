import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Edit, Plus, Trash2 } from "lucide-react";
import { mockClients, getClientPOCsByClient, getSalesStaff } from "@/data/mockData";
import AddClientPOCForm from "@/components/admin/AddClientPOCForm";
import EditClientForm from "@/components/admin/EditClientForm";
import EditClientPOCForm from "@/components/admin/EditClientPOCForm";
import { ClientPOC, Client } from "@/types/admin";
import { useToast } from "@/hooks/use-toast";

export default function ClientDetail() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const [showAddPOCForm, setShowAddPOCForm] = useState(false);
  const [showEditClientForm, setShowEditClientForm] = useState(false);
  const [showEditPOCForm, setShowEditPOCForm] = useState(false);
  const [selectedPOC, setSelectedPOC] = useState<ClientPOC | null>(null);
  const [client, setClient] = useState(mockClients.find(c => c.id === id) || null);
  const [clientPOCs, setClientPOCs] = useState(getClientPOCsByClient(id || ""));
  const salesStaff = getSalesStaff();

  if (!client) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Client Not Found</h1>
          <Button onClick={() => navigate("/admin/clients")} className="mt-4">
            Back to Client Management
          </Button>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    return status === "Confirmed" ? "default" : "secondary";
  };

  const handleAddClientPOC = (newPOC: ClientPOC) => {
    setClientPOCs([...clientPOCs, newPOC]);
  };

  const handleEditClient = (updatedClient: Client) => {
    setClient(updatedClient);
  };

  const handleEditClientPOC = (updatedPOC: ClientPOC) => {
    setClientPOCs(clientPOCs.map(poc => poc.id === updatedPOC.id ? updatedPOC : poc));
  };

  const handleEditPOC = (poc: ClientPOC) => {
    setSelectedPOC(poc);
    setShowEditPOCForm(true);
  };

  const handleDeleteClient = () => {
    if (window.confirm("Are you sure you want to delete this client? This action cannot be undone.")) {
      // In a real app, this would call an API to delete the client
      toast({
        title: "Client Deleted",
        description: "The client has been successfully deleted.",
      });
      navigate("/admin/clients");
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/admin/clients")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{client.companyName}</h1>
          <p className="text-muted-foreground">
            Complete company information and client POCs
          </p>
        </div>
        <Button 
          variant="destructive"
          onClick={handleDeleteClient}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Client
        </Button>
      </div>

      {/* Company Information */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Company Information</CardTitle>
            <Button onClick={() => setShowEditClientForm(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Company
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium">Company Name (As per ACRA)</label>
              <p className="text-sm text-muted-foreground mt-1">{client.companyName}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Registration Number</label>
              <p className="text-sm text-muted-foreground mt-1">{client.registrationNumber}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Country</label>
              <p className="text-sm text-muted-foreground mt-1">{client.country}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Industry</label>
              <p className="text-sm text-muted-foreground mt-1">{client.industry}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Number of Projects</label>
              <p className="text-sm text-muted-foreground mt-1">{client.numberOfProjects}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company Addresses */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Company Addresses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
              {client.addresses.map(address => (
                <div key={address.id} className="p-3 bg-muted rounded-lg">
                  <p className="text-sm">{address.address}</p>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Client POCs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Client Points of Contact ({clientPOCs.length})</CardTitle>
            <Button onClick={() => setShowAddPOCForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Client POC
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
             <Table>
               <TableHeader>
                 <TableRow>
                   <TableHead>Contact Name</TableHead>
                   <TableHead>Phone Number</TableHead>
                   <TableHead>Email</TableHead>
                   <TableHead>Sales PIC</TableHead>
                   <TableHead>Project</TableHead>
                   <TableHead>Actions</TableHead>
                 </TableRow>
               </TableHeader>
              <TableBody>
                {clientPOCs.map((poc) => {
                  const salesPerson = salesStaff.find(staff => staff.id === poc.salesPIC);
                  return (
                    <TableRow key={poc.id}>
                      <TableCell className="font-medium">{poc.contactName}</TableCell>
                      <TableCell>{poc.contactNumber}</TableCell>
                      <TableCell>{poc.contactEmail}</TableCell>
                      <TableCell>{salesPerson?.fullName || "Unknown"}</TableCell>
                      <TableCell>
                        {poc.projectName ? (
                          <div className="space-y-1">
                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                              {poc.projectName}
                            </Badge>
                            {poc.projectType && (
                              <div className="text-xs text-muted-foreground">{poc.projectType}</div>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">No project</span>
                        )}
                       </TableCell>
                       <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditPOC(poc)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Client POC Form */}
      {showAddPOCForm && (
        <AddClientPOCForm 
          onClose={() => setShowAddPOCForm(false)}
          onAdd={handleAddClientPOC}
          preselectedClientId={client?.id}
        />
      )}

      {/* Edit Client Form */}
      {showEditClientForm && client && (
        <EditClientForm 
          client={client}
          onClose={() => setShowEditClientForm(false)}
          onSave={handleEditClient}
        />
      )}

      {/* Edit Client POC Form */}
      {showEditPOCForm && selectedPOC && (
        <EditClientPOCForm 
          poc={selectedPOC}
          onClose={() => {
            setShowEditPOCForm(false);
            setSelectedPOC(null);
          }}
          onSave={handleEditClientPOC}
        />
      )}
    </div>
  );
}