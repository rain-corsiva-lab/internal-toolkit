
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Building2, Users, MapPin, Phone, Mail, Edit, Trash2, FileText, Plus } from "lucide-react";
import { getClientById, getClientPOCsByClient, getSalesStaff } from "@/data/mockData";
import EditClientPOCForm from "@/components/admin/EditClientPOCForm";
import AddClientPOCForm from "@/components/admin/AddClientPOCForm";
import EditClientForm from "@/components/admin/EditClientForm";
import { useToast } from "@/hooks/use-toast";
import { ClientPOC, Client } from "@/types/admin";

export default function ClientDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [client, setClient] = useState(getClientById(id || ""));
  const [clientPOCs, setClientPOCs] = useState(getClientPOCsByClient(id || ""));
  const [selectedPOC, setSelectedPOC] = useState<ClientPOC | null>(null);
  const [showEditPOCForm, setShowEditPOCForm] = useState(false);
  const [showAddPOCForm, setShowAddPOCForm] = useState(false);
  const [showEditClientForm, setShowEditClientForm] = useState(false);
  
  const salesStaff = getSalesStaff();

  if (!client) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Client Not Found</h1>
          <Button onClick={() => navigate("/clients")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Clients
          </Button>
        </div>
      </div>
    );
  }

  const mainAddress = client.addresses.find(addr => addr.isMain);
  const otherAddresses = client.addresses.filter(addr => !addr.isMain);

  const getStatusBadge = (status: string) => {
    return status === "Active" ? "default" : "secondary";
  };

  const handleEditPOC = (poc: ClientPOC) => {
    setSelectedPOC(poc);
    setShowEditPOCForm(true);
  };

  const handleUpdatePOC = (updatedPOC: ClientPOC) => {
    setClientPOCs(clientPOCs.map(poc => poc.id === updatedPOC.id ? updatedPOC : poc));
    toast({
      title: "Success",
      description: "POC updated successfully",
    });
  };

  const handleUpdateClient = (updatedClient: Client) => {
    setClient(updatedClient);
    toast({
      title: "Success",
      description: "Company updated successfully",
    });
  };

  const handleAddPOC = (newPOC: ClientPOC) => {
    setClientPOCs([...clientPOCs, newPOC]);
    toast({
      title: "Success",
      description: "POC created successfully",
    });
  };

  const handleDeleteCompany = () => {
    if (window.confirm("Are you sure you want to delete this company? This action cannot be undone.")) {
      toast({
        title: "Success",
        description: "Company deleted successfully",
      });
      navigate("/clients");
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/clients")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{client.companyName}</h1>
          <p className="text-muted-foreground">
            Complete company profile and contact information
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowEditClientForm(true)}
            className="shrink-0"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Company
          </Button>
          <Button 
            variant="destructive"
            onClick={handleDeleteCompany}
            className="shrink-0"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Company
          </Button>
        </div>
      </div>

      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Company Information
          </CardTitle>
          <CardDescription>
            Basic company details and registration information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Company Name</label>
              <p className="text-sm text-muted-foreground">{client.companyName}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Registration Number</label>
              <p className="text-sm text-muted-foreground">{client.registrationNumber}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Country</label>
              <p className="text-sm text-muted-foreground">{client.country}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Industry</label>
              <p className="text-sm text-muted-foreground">{client.industry}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Number of Projects</label>
              <Badge variant="outline">{client.numberOfProjects}</Badge>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Last Updated</label>
              <p className="text-sm text-muted-foreground">
                {new Date(client.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Addresses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Addresses
          </CardTitle>
          <CardDescription>
            Company registered and operational addresses
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {mainAddress && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="default">Main Address</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{mainAddress.address}</p>
            </div>
          )}
          
          {otherAddresses.map((address) => (
            <div key={address.id} className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline">Other Address</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{address.address}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quotations */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Quotations
              </CardTitle>
              <CardDescription>
                All quotations generated for this company
              </CardDescription>
            </div>
            <Button onClick={() => navigate("/costing-calculator")}>
              <Plus className="h-4 w-4 mr-2" />
              Create Quotation
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No quotations found for this company</p>
            <p className="text-sm">Create a new quotation to get started</p>
          </div>
        </CardContent>
      </Card>

      {/* Points of Contact */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Points of Contact ({clientPOCs.length})
              </CardTitle>
              <CardDescription>
                All contacts associated with this company
              </CardDescription>
            </div>
            <Button onClick={() => setShowAddPOCForm(true)}>
              <Users className="h-4 w-4 mr-2" />
              Create POC
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contact Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Sales PIC</TableHead>
                  <TableHead>POC Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientPOCs.map((poc) => {
                  const salesPerson = salesStaff.find(staff => staff.id === poc.salesPIC);
                  return (
                    <TableRow key={poc.id}>
                      <TableCell className="font-medium">{poc.contactName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          {poc.contactNumber}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          {poc.contactEmail}
                        </div>
                      </TableCell>
                      <TableCell>{salesPerson?.fullName || "Unknown"}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadge(poc.projectStatus)}>
                          {poc.projectStatus}
                        </Badge>
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

      {/* Edit POC Form */}
      {showEditPOCForm && selectedPOC && (
        <EditClientPOCForm 
          poc={selectedPOC}
          onClose={() => {
            setShowEditPOCForm(false);
            setSelectedPOC(null);
          }}
          onSave={handleUpdatePOC}
        />
      )}

      {/* Add POC Form */}
      {showAddPOCForm && (
        <AddClientPOCForm 
          onClose={() => setShowAddPOCForm(false)}
          onAdd={handleAddPOC}
          preselectedClientId={id}
        />
      )}

      {/* Edit Client Form */}
      {showEditClientForm && client && (
        <EditClientForm 
          client={client}
          onClose={() => setShowEditClientForm(false)}
          onSave={handleUpdateClient}
        />
      )}
    </div>
  );
}
