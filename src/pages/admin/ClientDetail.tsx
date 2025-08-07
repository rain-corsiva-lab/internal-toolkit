import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Edit, Plus } from "lucide-react";
import { mockClients, getClientPOCsByClient, getSalesStaff } from "@/data/mockData";
import AddClientPOCForm from "@/components/admin/AddClientPOCForm";
import { ClientPOC } from "@/types/admin";

export default function ClientDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showAddPOCForm, setShowAddPOCForm] = useState(false);
  const [clientPOCs, setClientPOCs] = useState(getClientPOCsByClient(id || ""));
  
  const client = mockClients.find(c => c.id === id);
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
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{client.companyName}</h1>
          <p className="text-muted-foreground">
            Complete company information and client POCs
          </p>
        </div>
      </div>

      {/* Company Information */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Company Information</CardTitle>
            <Button>
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
                  <TableHead>Designation</TableHead>
                  <TableHead>Sales PIC</TableHead>
                  <TableHead>Status</TableHead>
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
                      <TableCell>{poc.designation}</TableCell>
                      <TableCell>{salesPerson?.fullName || "Unknown"}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadge(poc.projectStatus)}>
                          {poc.projectStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
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
        />
      )}
    </div>
  );
}